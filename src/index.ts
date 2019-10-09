import { LogLevel } from './constants';
import composite from './composite';

const {
  log,
  git,
  updateMajors,
  updateMinors,
} = composite();

export default async() => {
  let code = 0;
  try {
    await git.cloneRepo();
    await git.resetBranch();
    await updateMinors();
    await updateMajors();
  } catch (err) {
    log(err, LogLevel.ERROR);
    code = 1;
  }

  await git.destroyRepo();
  process.exit(code);
};
