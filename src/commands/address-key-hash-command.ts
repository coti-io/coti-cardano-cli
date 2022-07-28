import {cleanJson, deleteFile, exec, readFile} from '../helpers';
import { promises, promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface AddressKeyHashParams {
  cliPath: string;
  vkey: string;
}

const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
): string => {
  return `${cliPath} address key-hash --payment-verification-key-file ${vkeyFilePath}`
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyHashParams
): Promise<string> {
  const { cliPath, vkey } = options;
  if (!vkey) throw new Error('no input provided');
  const cleanVkey = cleanJson(vkey);
  const UUID = uuid();
  const vKeyFilePath = `tmp/${UUID}.payment.vkey`;
  await fs.writeFile(vKeyFilePath, cleanVkey);


  const command = buildCommand(cliPath, vKeyFilePath);
  const stdout = await exec(command);

  await deleteFile(vKeyFilePath);

  return stdout.toString().trim();
}
