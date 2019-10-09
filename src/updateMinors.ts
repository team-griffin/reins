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

export type UpdateMinors = () => Promise<void>;

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
): UpdateMinors => async() => {
  log('Updating minor changes');
  const outdated = await getOutdated();
  const minors = outdated.filter(({ current, wanted }) => current !== wanted);
  log(`Found ${minors.length} minor changes`);

  // eslint-disable-next-line no-plusplus
  for (let x = 0, l = minors.length; x < l; x++) {
    const minor = minors[x];
    const {
      name,
      current,
      wanted,
    } = minor;
    const branch = `refactor/minor-upgrade/${name}`;
    const exists = await checkBranchExists(branch);

    log(`Upgrading ${name} (${x+1}/${l}) from ${current} to ${wanted}`);
    await resetBranch();
    await checkoutBranch(branch);
    await upgrade(name);
    const dirty = await isBranchDirty();

    if (!dirty) {
      log('No changes detected, skipping upgrade', LogLevel.INFO);
      continue;
    }

    if (config.testCmd) {
      log(`Running test command: ${config.testCmd}`, LogLevel.INFO);
      try {
        await exec(config.testCmd);
        log('Test ran okay. No need to update this package', LogLevel.INFO);
      } catch (err) {
        log('Test failed. Creating a pull request to manually fix', LogLevel.WARNING);
        log(err, LogLevel.DEBUG);

        const head = `refactor: upgrade ${name} from ${current} to ${wanted}`;
        const body = [
          'This is a minor change, but tests failed with the following error:',
          err,
        ].join('\n\n');
        const commitMsg = [ head, body ].join('\n\n');
        await commit(commitMsg);
        await push(branch);
        if (!exists) {
          await createPr(branch, head, body);
        }
      }
    } else {
      const head = `refactor: upgrade ${name} from ${current} to ${wanted}`;
      const body = 'Minor change';
      const commitMsg = [ head, body ].join('\n\n');
      await commit(commitMsg);
      await push(branch);
      if (!exists) {
        await createPr(branch, head, body);
      }
    }
  }
};
