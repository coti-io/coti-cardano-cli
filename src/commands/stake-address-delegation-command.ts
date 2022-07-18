import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';

export interface StakeAddressDelegationParams {
  cliPath: string;
  account: string;
  poolId: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string,
  stakingVerificationPath: string,
  poolId: string
): string => {
  return `${cliPath} stake-address delegation-certificate \
                        --staking-verification-key-file ${stakingVerificationPath} \
                        --stake-pool-id ${poolId} \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressDelegationCommand(
  options: StakeAddressDelegationParams
): Promise<JSONValue> {
  const { cliPath, account, poolId } = options;
  const filePath = `tmp/${account}.deleg.cert`;
  const stakingVerificationPath = `tmp/${account}.stake.vkey`;
  const stakeAddressKey = await stakeAddressKeyGenCommand({ account, cliPath });
  await fs.writeFile(stakingVerificationPath, stakeAddressKey);
  await exec(
    buildCommand(cliPath, account, filePath, stakingVerificationPath, poolId)
  );

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
