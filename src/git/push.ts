import { LogLevel } from '../constants';
import { Exec, Log } from '../utils';
import { CheckBranchExists } from './checkBranchExists';

export type Push = (branch: string) => Promise<void>;

export default (
  log: Log,
  exec: Exec,
  checkBranchExists: CheckBranchExists,
): Push => async(branch) => {
  const exists = await checkBranchExists(branch);

  if (exists) {
    log(`Pushing branch ${branch}`, LogLevel.INFO);
    await exec('git push');
  } else {
    log(`Pushing new branch ${branch}`, LogLevel.INFO);
    await exec(`git push --set-upstream origin ${branch}`);
  }
};
