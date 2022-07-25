import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakeAddressDelegationParams {
  cliPath: string;
  poolId: string;
  stakeVkey: string;
}

const buildCommand = (
  cliPath: string,
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
): Promise<string> {
  const { cliPath, poolId, stakeVkey } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.deleg.cert`;
  const stakingVerificationPath = `tmp/${UID}.stake.vkey`;

  await fs.writeFile(stakingVerificationPath, stakeVkey);
  await exec(buildCommand(cliPath, filePath, stakingVerificationPath, poolId));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
