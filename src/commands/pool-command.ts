import { setKeys } from '../helpers';
import { Pool } from '../interfaces';
import { promises as fs } from 'fs';
import { stakePoolIdCommand } from './stake-pool-id-command';

export interface PoolParams {
  cliPath: string;
  poolName: string;
}

export async function poolCommand(options: PoolParams): Promise<Pool> {
  const { poolName, cliPath } = options;
  await fs.readFile(`tmp/priv/pool/${poolName}/${poolName}.node.vkey`);
  const id = await stakePoolIdCommand({ cliPath, poolName });
  const files = await fs.readdir(`tmp/priv/pool/${poolName}`);
  const keysPath = {};
  files.forEach(file => {
    const name = file.split('.')[1] + '.' + file.split('.')[2];
    setKeys(keysPath, name, `tmp/priv/pool/${poolName}/${file}`);
  });
  return {
    name: poolName,
    id,
    ...keysPath,
  };
}
