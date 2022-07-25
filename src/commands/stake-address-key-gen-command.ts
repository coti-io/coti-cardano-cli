import { checkFileExists, deleteFile, exec, readFile } from '../helpers';
import { Account } from '../interfaces';
import { uuid } from 'uuidv4';

export interface StakeAddressKeyGenParams {
  cliPath: string;
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
): Promise<Account> {
  const { cliPath } = options;
  const UID = uuid();
  const vkeyFilePath = `tmp/${UID}.stake.vkey`;
  const skeyFilePath = `tmp/${UID}.stake.skey`;
  if (await checkFileExists(vkeyFilePath))
    return Promise.reject(`${vkeyFilePath} file already exists`);
  if (await checkFileExists(skeyFilePath))
    return Promise.reject(`${skeyFilePath} file already exists`);
  await exec(buildCommand(cliPath, vkeyFilePath, skeyFilePath));

  const vkeyFileContent = await readFile(vkeyFilePath);
  const skeyFileContent = await readFile(skeyFilePath);

  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);

  return {
    vkey: vkeyFileContent,
    skey: skeyFileContent,
  };
}
