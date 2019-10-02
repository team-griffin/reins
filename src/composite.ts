import childProcess from 'child_process';
import os from 'os';
import yargs from 'yargs';
import GithubApi from 'github-api';
import * as _git from './git';
import * as _utils from './utils';
import * as _yarn from './yarn';
import _getConfig from './getConfig';
import _updateMajors from './updateMajors';
import _updateMinors from './updateMinors';

export default () => {
  const getConfig = _getConfig(yargs.argv as any, process, os.tmpdir);
  const config = getConfig();
  const log = _utils.log(config);
  const exec = _utils.exec(childProcess.exec, log, config);
  const git = (() => {
    const api = _git.api(GithubApi, config);
    const checkBranchExists = _git.checkBranchExists(api, log);
    const createBranch = _git.createBranch(log, exec);
    const checkoutBranch = _git.checkoutBranch(log, exec, checkBranchExists, createBranch);
    const cloneRepo = _git.cloneRepo(log, exec, config);
    const commit = _git.commit(exec);
    const createPullRequest = _git.createPullRequest(api, log, config);
    const destroyRepo = _git.destroyRepo(exec, config);
    const isBranchDirty = _git.isBranchDirty(exec);
    const push = _git.push(log, exec, checkBranchExists);
    const resetBranch = _git.resetBranch(config, exec);
    return {
      checkBranchExists,
      createBranch,
      checkoutBranch,
      cloneRepo,
      commit,
      createPullRequest,
      destroyRepo,
      isBranchDirty,
      push,
      resetBranch,
    };
  })();
  const yarn = {
    getOutdated: _yarn.getOutdated(log, exec),
    upgrade: _yarn.upgrade(exec),
  };

  const updateMajors = _updateMajors(
    config,
    log,
    exec,
    yarn.getOutdated,
    git.resetBranch,
    git.checkoutBranch,
    yarn.upgrade,
    git.checkBranchExists,
    git.isBranchDirty,
    git.commit,
    git.push,
    git.createPullRequest,
  );
  const updateMinors = _updateMinors(
    config,
    log,
    exec,
    yarn.getOutdated,
    git.resetBranch,
    git.checkoutBranch,
    yarn.upgrade,
    git.checkBranchExists,
    git.isBranchDirty,
    git.commit,
    git.push,
    git.createPullRequest,
  );

  return {
    getConfig,
    config,
    log,
    exec,
    git,
    yarn,
    updateMajors,
    updateMinors,
  };
};
