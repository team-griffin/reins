import { LogLevel } from '../constants';
import { Outdated } from '../types';
import { Log } from '../utils/log';
import { Exec } from '../utils/exec';

type RawOutdated = string[][];
interface RawOutdatedResponse {
  data: {
    body: RawOutdated,
  },
}
export type GetOutdated = () => Promise<Outdated[]>;

const getRawOutdated = async(exec: Exec) => {
  try {
    // if this exits 0 then we have nothing outdated
    await exec('yarn outdated --json');
    return [];
  } catch (err) {
    const lines: string[] = err.split('\n');
    const raw: RawOutdatedResponse = JSON.parse(lines[1]);
    return raw.data.body;
  }
};

const rawToOutdated = (row: string[]): Outdated => {
  const [
    name,
    current,
    wanted,
    latest,
    type,
    url,
  ] = row;
  return {
    name,
    current,
    wanted,
    latest,
    type,
    url,
  };
};

export default (log: Log, exec: Exec): GetOutdated => {
  let outdated: Outdated[];
  return async() => {
    if (!outdated) {
      log('Finding all outdated packages', LogLevel.INFO);
      const raw = await getRawOutdated(exec);
      log(`Found ${raw.length} outdated packages`, LogLevel.INFO);
      outdated = raw
        .map(rawToOutdated)
        .filter(({ type }) => type === 'dependencies' || type === 'devDependencies');
    }
    return outdated;
  };
};
