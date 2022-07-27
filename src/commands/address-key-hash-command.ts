import { deleteFile, exec, readFile } from '../helpers';
import { promises, promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface AddressKeyHashParams {
  cliPath: string;
  vkey?: string;
  vkeyFile?: string;
}

// TODO Add era
// TODO add option --payment-verification-key
// TODO --out-file
const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
  filePath: string
): string => {
  return `${cliPath} address key-hash \
                              --payment-verification-key-file ${vkeyFilePath} \
                              --out-file-file ${filePath} \
                          `;
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyHashParams
): Promise<string> {
  const { cliPath, vkey, vkeyFile } = options;
  if (!vkey && !vkeyFile) throw new Error('no input provided');

  const UUID = uuid();
  const filePath = `tmp/${UUID}.address.keyHash`;
  let vKeyFilePath = '';
  if (vkey) {
    vKeyFilePath = `tmp/${UUID}.payment.vkey`;
    await fs.writeFile(vKeyFilePath, vkey);
  } else if (vkeyFile) {
    vKeyFilePath = vkeyFile;
  }

  const command = buildCommand(cliPath, vKeyFilePath, filePath);
  await exec(command);

  const fileContent = await readFile(filePath);

  if (vkey) await deleteFile(vKeyFilePath);
  await deleteFile(filePath);

  return fileContent.trim();
}
