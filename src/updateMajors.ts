import { Config } from './types';
import { LogLevel } from './constants';
import {
  CheckBranchExists,
  CheckoutBranch,
  Commit,
  CreatePullRequest,
  IsBranchDirty,
  Push,
  ResetBranch,
} from './git';
import {
  GetOutdated,
  Upgrade,
} from './yarn';
import {
  Exec,
  Log,
} from './utils';

export type UpdateMajors = () => Promise<void>;

export default (
  config: Config,
  log: Log,
  exec: Exec,
  getOutdated: GetOutdated,
  resetBranch: ResetBranch,
  checkoutBranch: CheckoutBranch,
  upgrade: Upgrade,
  checkBranchExists: CheckBranchExists,
  isBranchDirty: IsBranchDirty,
  commit: Commit,
  push: Push,
  createPr: CreatePullRequest,
): UpdateMajors => async() => {
  log('Updating minor changes');
  const outdated = await getOutdated();
  const majors = outdated.filter(({ current, latest }) => current !== latest);
  log(`Found ${majors.length} major changes`);

  // eslint-disable-next-line no-plusplus
  for (let x = 0, l = majors.length; x < l; x++) {
    const major = majors[x];
    const {
      name,
      current,
      latest,
    } = major;
    const branch = `refactor/major-upgrade/${name}`;
    const exists = await checkBranchExists(branch);

    log(`Upgrading ${name} (${x+1}/${l}) from ${current} to ${latest}`);
    await resetBranch();
    await checkoutBranch(branch);
    await upgrade(name, true);
    const dirty = await isBranchDirty();

    if (!dirty) {
      log('No changes detected, skipping upgrade', LogLevel.INFO);
      continue;
    }

    const head = `refactor: upgrade ${name} from ${current} to ${latest}`;
    let body = 'Major change requires explicit approval';
    
    if (config.testCmd) {
      log(`Running test command: ${config.testCmd}`, LogLevel.INFO);
      try {
        await exec(config.testCmd);
        log('Test ran okay', LogLevel.INFO);
        body = 'Major change requires explicit approval - Tests passed';
      } catch (err) {
        log('Test failed. Creating a pull request to manually fix', LogLevel.WARNING);
        log(err, LogLevel.DEBUG);

        body = [
          'Major change requires explicit approval',
          'Tests failed with the following error:',
          err,
        ].join('\n\n');
      }
    }

    const commitMsg = [ head, body ].join('\n\n');
    await commit(commitMsg);
    await push(branch);
    if (!exists) {
      await createPr(branch, head, body);
    }
  }
};
