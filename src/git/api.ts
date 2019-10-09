import GithubApi from 'github-api';
import { Config } from '../types';

export default (Github: typeof GithubApi, config: Config) => {
  const github = new Github({ token: config.token }, config.apiUrl);
  const repo = github.getRepo(config.org, config.repo);
  return repo;
};
