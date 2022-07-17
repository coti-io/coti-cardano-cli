import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';

export interface StakeAddressDelegationParams {
  cliPath: string;
  account: string;
  poolId: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string,
  poolId: string
): string => {
  return `${cliPath} stake-address delegation-certificate \
                        --staking-verification-key-file tmp/priv/wallet/${account}/${account}.stake.vkey \
                        --stake-pool-id ${poolId} \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressDelegationCommand(
  options: StakeAddressDelegationParams
): Promise<JSONValue> {
  const { cliPath, account, poolId } = options;
  const filePath = `tmp/priv/wallet/${account}/${account}.deleg.cert`;
  await exec(buildCommand(cliPath, account, filePath, poolId));
  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
