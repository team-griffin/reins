import { LogLevel } from '../constants';
import { Config } from '../types';

export type Log = (msg: any, level?: LogLevel) => void;

export default (config: Config): Log => {
  return (
    msg,
    level = LogLevel.ALWAYS,
  ) => {
    if (level >= config.loglevel) {
      let method = 'log';
      let lvl = '';
      switch (level) {
      case LogLevel.DEBUG:
        method = 'debug';
        lvl = 'DBG';
        break;
      case LogLevel.VERBOSE:
        method = 'info';
        lvl = 'VER';
        break;
      case LogLevel.INFO:
        method = 'info';
        lvl = 'INF';
        break;
      case LogLevel.WARNING:
        method = 'warn';
        lvl = 'WRN';
        break;
      case LogLevel.ERROR:
        method = 'error';
        lvl = 'ERR';
        break;
      default:
        break;
      }
      /* eslint-disable */
      // @ts-ignore
      console[method](`[${lvl}]: ${msg}`);
      /* eslint-enable */
    }
  };
};
