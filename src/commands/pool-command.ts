import { setKeys } from '../helpers';
import { Pool } from '../interfaces';
import { promises as fs } from 'fs';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { uuid } from 'uuidv4';

export interface PoolParams {
  cliPath: string;
  nodevKey: string;
}

export async function poolCommand(options: PoolParams): Promise<Pool> {
  const { cliPath, nodevKey } = options;
  const UID = uuid();
  const id = await stakePoolIdCommand({ cliPath, nodevKey });
  const files = await fs.readdir('tmp/');
  const keysPath = {};
  files.forEach(file => {
    const name = file.split('.')[1] + '.' + file.split('.')[2];
    setKeys(keysPath, name, `tmp/${UID}.${file}`);
  });
  return {
    id,
    ...keysPath,
  };
}
