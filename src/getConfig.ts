import path from 'path';
import { Argv } from 'yargs';
import { Config } from './types';
import { LogLevel } from './constants';

interface Args {
  test: string,
  tmpDir: string,
  master: string,
  ghToken: string,
  token: string,
  ghApi: string,
  ghUrl: string,
  org: string,
  repo: string,
  level: number,
}

const randomNumber = () => Math.random() * 20000;

export default (
  argv: Argv<Args>['argv'],
  process: NodeJS.Process,
  getTmpDir: () => string,
) => {
  let config: Config;
  return (): Config => {
    if (!config) {
      const loglevel = (() => {
        if (argv.level != null) {
          return Number(argv.level);
        }
        if (argv.verbose) {
          return LogLevel.VERBOSE;
        }
        return LogLevel.ERROR;
      })();
      const token = argv.ghToken || argv.token || process.env.GH_TOKEN;
      const org = argv.org;
      const repo = argv.repo;
      const testCmd = argv.test || '';
      const apiUrl = argv.ghApi || 'https://api.github.com';
      // eslint-disable-next-line max-len
      const baseUrl = (argv.ghUrl || process.env.GH_URL || 'https://github.com').replace('<token>', token);
      const controlId = `${randomNumber()}`;
      const testId = `${randomNumber()}`;
      const master = argv.master || 'master';
      const baseDir = argv.tmpDir || path.join(getTmpDir(), 'team-griffin-reins');
      const controlDir = path.join(baseDir, controlId);
      const testDir = path.join(baseDir, testId);

      if (!org || !repo) {
        throw new Error('You must provide an org and repo');
      }
      if (!token) {
        // eslint-disable-next-line max-len
        throw new Error('You must provide a gh-token, token, or set a GH_TOKEN environment variable');
      }

      config = {
        testCmd,
        apiUrl,
        baseUrl,
        controlId,
        testId,
        master,
        org,
        repo,
        token,
        baseDir,
        controlDir,
        testDir,
        loglevel,
      };
    }
    return config;
  };
};
