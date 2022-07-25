import { deleteFile, exec, readFile } from '../helpers';
import { addressKeyGenCommand } from './address-key-gen-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface AddressKeyGenParams {
  cliPath: string;
}

const buildCommand = (
  cliPath: string,
  filePath: string
): string => {
  return `${cliPath} address key-hash \
                              --payment-verification-key-file ${filePath} \
                          `;
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyGenParams
): Promise<string> {
  const { cliPath } = options;
  const UUID = uuid();
  const { vkey } = await addressKeyGenCommand({ cliPath });
  const filePath = `tmp/${UUID}.payment.vkey`;
  await fs.writeFile(filePath, vkey);

  const command = buildCommand(cliPath, filePath);
  await exec(command);

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent.trim();
}
