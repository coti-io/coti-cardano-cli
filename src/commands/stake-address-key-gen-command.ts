import {
  buildRandomFilePath,
  checkFileExists,
  deleteFile,
  exec,
  readFile,
} from '../helpers';
import { Account } from '../interfaces';

export interface StakeAddressKeyGenParams {
  cliPath: string;
  account: string;
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
  const { cliPath, account } = options;
  const vkeyFilePath = `tmp/${account}.stake.vkey`;
  const skeyFilePath = `tmp/${account}.stake.skey`;
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
