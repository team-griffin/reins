import { Exec } from '../utils/exec';

export type Upgrade = (name: string, latest?: boolean) => Promise<void>;

export default (exec: Exec): Upgrade => async(name, latest = false) => {
  let cmd = `yarn upgrade ${name}`;
  if (latest) {
    cmd = `${cmd} --latest`;
  }
  await exec(cmd);
};
