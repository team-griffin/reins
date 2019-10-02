import { Exec } from '../utils';

export type IsBranchDirty = () => Promise<boolean>;

export default (exec: Exec): IsBranchDirty => async() => {
  const result = await exec('git status --porcelain');
  return Boolean(result);
};
