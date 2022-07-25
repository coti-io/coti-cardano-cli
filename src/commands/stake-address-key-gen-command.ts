import { deleteFile, exec } from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface StakeAddressKeyGenParams {
  cliPath: string;
  vKey: string;
  sKey: string;
}

const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
  skeyFilePath: string
): string => {
  return `${cliPath} stake-address key-gen \
                        --verification-key-file ${vkeyFilePath} \
                        --signing-key-file ${skeyFilePath}
                    `;
};

export async function stakeAddressKeyGenCommand(
  options: StakeAddressKeyGenParams
): Promise<string> {
  const { cliPath, vKey, sKey } = options;
  const UID = uuid();
  const vkeyFilePath = `tmp/${UID}.stake.vkey`;
  const skeyFilePath = `tmp/${UID}.stake.skey`;

  await fs.writeFile(vkeyFilePath, vKey);
  await fs.writeFile(skeyFilePath, sKey);

  const stdout = await exec(buildCommand(cliPath, vkeyFilePath, skeyFilePath));

  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);

  return stdout.trim();
}
