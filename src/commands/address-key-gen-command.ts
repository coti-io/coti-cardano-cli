import {
  buildRandomFilePath,
  deleteFile,
  exec,
  readJsonFile,
} from '../helpers';
import { JSONValue } from '../types';

export interface AddressKeyGenParams {
  cliPath: string;
}

export interface AddressKeyGenRes {
  skey: JSONValue;
  vkey: JSONValue;
}

const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
  skeyFilePath: string
): string => {
  return `${cliPath} address key-gen \
                        --verification-key-file ${vkeyFilePath} \
                        --signing-key-file ${skeyFilePath}
                    `;
};

export async function addressKeyGenCommand(
  options: AddressKeyGenParams
): Promise<AddressKeyGenRes> {
  const vkeyFilePath = buildRandomFilePath();
  const skeyFilePath = buildRandomFilePath();
  const command = buildCommand(options.cliPath, vkeyFilePath, skeyFilePath);
  await exec(command);

  const vkey = await readJsonFile(vkeyFilePath);
  const skey = await readJsonFile(skeyFilePath);
  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);
  return { vkey, skey };
}
