import { Config } from '../types';
import { LogLevel } from '../constants';
import { Exec, Log } from '../utils';

export type CloneRepo = () => Promise<void>;

export default (
  log: Log,
  exec: Exec,
  config: Config,
): CloneRepo => async() => {
  log('Cloning repository...');
  log('Creating tmp directory', LogLevel.VERBOSE);
  await exec(`mkdir -p ${config.baseDir}`);
  const repoUrl = `${config.baseUrl}/${config.org}/${config.repo}.git`;
  log(`Cloning git repo: ${repoUrl}`, LogLevel.VERBOSE);
  await exec(`git clone ${repoUrl} ${config.controlId}`, { cwd: config.baseDir });
  await exec(`git checkout ${config.master}`, { cwd: config.controlDir });
  await exec('yarn install', { cwd: config.controlDir });
};
