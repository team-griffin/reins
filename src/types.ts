import { LogLevel } from './constants';

export interface Config {
  // a command to run after upgrade a dependency
  // if it fails, it means we need to fix the build before we can upgrade
  testCmd: string,
  // where to stick the tmp files
  baseDir: string,
  // this will be the folder name used for the base git repo
  controlId: string,
  // this will be the folder where we upgrade the packages
  testId: string,
  controlDir: string,
  testDir: string,
  // the branch to fork from (i.e. master)
  master: string,
  // base url of the repo i.e. https://github.com
  // can include a token i.e. https://<token>.github.com
  baseUrl: string,
  // the url of the github api, i.e. https://api.github.com
  // enterprise repos will have a different endpoint
  apiUrl: string,
  // the org or user that owns the repo
  org: string,
  // the repo name
  repo: string,
  // an OAuth token that authorises us to read/write to the repo
  token: string,
  loglevel: LogLevel,
}

export interface Outdated {
  name: string,
  current: string,
  wanted: string,
  latest: string,
  type: string,
  url: string,
}

export interface ApiResponse {
  status: number,
  data: object,
}
export interface ApiResponseError {
  response: ApiResponse,
}
