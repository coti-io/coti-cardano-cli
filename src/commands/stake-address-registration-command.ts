import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';

export interface StakeAddressRegistrationParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string,
  stakingKeyFilePath: string
): string => {
  return `${cliPath} stake-address registration-certificate \
                        --staking-verification-key-file ${stakingKeyFilePath} \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressRegistrationCommand(
  options: StakeAddressRegistrationParams
): Promise<JSONValue> {
  const { cliPath, account } = options;
  const filePath = `tmp/${account}.stake.cert`;
  const stakingKeyFilePath = `tmp/${account}.stake.vkey`;
  const { vkey } = await stakeAddressKeyGenCommand({ cliPath, account });
  await fs.writeFile(stakingKeyFilePath, vkey);
  await exec(buildCommand(cliPath, account, filePath, stakingKeyFilePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingKeyFilePath);

  return fileContent;
}
