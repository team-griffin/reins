import { Config } from '../types';
import { Exec } from '../utils';

export type ResetBranch = () => Promise<void>;

export default (config: Config, exec: Exec): ResetBranch => async() => {
  const cwd = config.baseDir;
  await exec(`rm -rf ${config.testId}`, { cwd });
  await exec(`cp -r ${config.controlId} ${config.testId}`, { cwd });
  await exec(`git checkout ${config.master}`);
};
