import { Log, Exec } from '../utils';
import { LogLevel } from '../constants';
import { CreateBranch } from './createBranch';
import { CheckBranchExists } from './checkBranchExists';

export type CheckoutBranch = (branch: string) => Promise<void>;

export default (
  log: Log,
  exec: Exec,
  checkBranchExists: CheckBranchExists,
  createBranch: CreateBranch,
): CheckoutBranch => async(branch) => {
  const exists = await checkBranchExists(branch);
  if (!exists) {
    return createBranch(branch);
  }

  log(`Checking out existing branch ${branch}`, LogLevel.INFO);
  await exec(`git checkout ${branch}`);
};
