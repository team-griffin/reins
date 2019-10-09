import { Config } from '../types';
import { Log } from '../utils';

export type CreatePullRequest = (
  branch: string,
  title: string,
  body: string,
) => Promise<void>;

export default (
  repo: any,
  log: Log,
  config: Config,
): CreatePullRequest => async(
  branch,
  title,
  body,
) => {
  log(`Creating Pull Request for ${branch}`);
  await repo.createPullRequest({
    title,
    body,
    head: branch,
    base: config.master,
    // eslint-disable-next-line camelcase
    maintainer_can_modify: true,
    draft: false,
  });
};
