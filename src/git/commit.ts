import { Exec } from '../utils';

export type Commit = (message: string) => Promise<void>;

export default (exec: Exec): Commit => async(message) => {
  await exec('git add .');
  await exec(`git commit -m "${message} --no-verify`);
};
