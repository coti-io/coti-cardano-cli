import { deleteFile, exec } from '../helpers';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface AddressKeyHashParams {
  cliPath: string;
  vkey: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} address key-hash \
                              --payment-verification-key-file ${filePath} \
                          `;
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyHashParams
): Promise<string> {
  const { cliPath, vkey } = options;
  const UUID = uuid();

  const vKeyFilePath = `tmp/${UUID}.payment.vkey`;
  await fs.writeFile(vKeyFilePath, vkey);

  const command = buildCommand(cliPath, vKeyFilePath);
  const stdout = await exec(command);

  await deleteFile(vKeyFilePath);

  return stdout.trim();
}
