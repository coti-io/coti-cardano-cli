import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';

export interface StakeAddressDeregistrationParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string,
  stakingVerificationPath: string
): string => {
  return `${cliPath} stake-address deregistration-certificate \
                        --staking-verification-key-file ${stakingVerificationPath} \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressDeregistrationCommand(
  options: StakeAddressDeregistrationParams
): Promise<JSONValue> {
  const { cliPath, account } = options;
  const filePath = `tmp/${account}.stake.cert`;
  const stakingVerificationPath = `tmp/${account}.stake.vkey`;
  const stakeAddressKey = await stakeAddressKeyGenCommand({ account, cliPath });
  await fs.writeFile(stakingVerificationPath, stakeAddressKey);

  await exec(buildCommand(cliPath, account, filePath, stakingVerificationPath));
  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
