import { exec } from 'child_process';
import { LogLevel } from '../constants';
import { Config } from '../types';
import { Log } from './log';

type NodeExec = typeof exec;

export type Exec = (
  cmd: string,
  options?: object,
) => Promise<string>;

export {};

export default (exec: NodeExec, log: Log, config: Config): Exec => (cmd, options) => {
  return new Promise((res, rej) => {
    log(`executing command: ${cmd}`, LogLevel.VERBOSE);
    exec(
      cmd,
      {
        cwd: config.testDir,
        ...options,
      },
      (err, stdout) => {
        if (err) {
          log(err, LogLevel.DEBUG);
          log(stdout, LogLevel.DEBUG);
          rej(stdout);
        } else {
          res(stdout);
        }
      },
    );
  });
};
