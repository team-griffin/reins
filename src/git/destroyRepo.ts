import { Config } from '../types';
import { Exec } from '../utils';

export type DestroyRepo = () => Promise<void>;

export default (exec: Exec, config: Config): DestroyRepo => async() => {
  const cwd = config.baseDir;
  await exec(`rm -rf ${config.controlId}`, { cwd });
  await exec(`rm -rf ${config.testId}`, { cwd });
};
