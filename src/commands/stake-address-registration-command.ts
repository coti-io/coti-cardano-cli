import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakeAddressRegistrationParams {
  cliPath: string;
}

const buildCommand = (
  cliPath: string,
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
  const { cliPath } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.stake.cert`;
  const stakingKeyFilePath = `tmp/${UID}.stake.vkey`;
  const { vkey } = await stakeAddressKeyGenCommand({ cliPath });
  await fs.writeFile(stakingKeyFilePath, vkey);
  await exec(buildCommand(cliPath, filePath, stakingKeyFilePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingKeyFilePath);

  return fileContent;
}
