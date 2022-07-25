import {
  buildRandomFilePath,
  deleteFile,
  exec,
  readFile,
  readJsonFile,
} from '../helpers';
import { promises as fs } from 'fs';

export interface AddressKeyGenParams {
  cliPath: string;
  skey: string;
  vkey: string;
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
): Promise<string> {
  const { skey, vkey } = options;
  const vkeyFilePath = buildRandomFilePath();
  const skeyFilePath = buildRandomFilePath();

  await fs.writeFile(vkeyFilePath, skey);
  await fs.writeFile(skeyFilePath, vkey);

  const command = buildCommand(options.cliPath, vkeyFilePath, skeyFilePath);
  const stdout = await exec(command);

  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);
  return stdout.trim();
}
