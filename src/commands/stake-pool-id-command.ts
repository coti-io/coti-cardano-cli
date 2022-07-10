import { exec } from '../helpers';

export interface StakePoolIdParams {
  cliPath: string;
  poolName: string;
}

const buildCommand = (cliPath: string, poolName: string): string => {
  return `${cliPath} stake-pool id --cold-verification-key-file tmp/priv/pool/${poolName}/${poolName}.node.vkey`;
};

export async function stakePoolIdCommand(
  options: StakePoolIdParams
): Promise<string> {
  const { cliPath, poolName } = options;
  const stdout = await exec(buildCommand(cliPath, poolName));
  return stdout.toString().replace(/\s+/g, ' ');
}
