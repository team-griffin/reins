import { LogLevel } from '../constants';
import { Exec, Log } from '../utils';

export type CreateBranch = (branch: string) => Promise<void>;

export default (log: Log, exec: Exec): CreateBranch => async(branch) => {
  log(`Creating new branch ${branch}`, LogLevel.INFO);
  await exec(`git checkout -b ${branch}`);
};
