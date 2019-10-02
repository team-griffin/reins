import { is404 } from './utils';
import { LogLevel } from '../constants';
import { Log } from '../utils';

export type CheckBranchExists = (branch: string) => Promise<boolean>;

export default (repo: any, log: Log): CheckBranchExists => {
  const cache: { [key: string]: boolean } = {};
  return async(branch) => {
    if (cache[branch] !== void 0) {
      return cache[branch];
    }

    log(`Checking if branch ${branch} exists`, LogLevel.VERBOSE);
    try {
      await repo.getBranch(branch);
      cache[branch] = true;
      return true;
    } catch (err) {
      if (is404(err)) {
        cache[branch] = false;
        return false;
      }
      throw err;
    }
  };
};
