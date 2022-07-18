import { deleteFile, exec, readFile } from '../helpers';
import { addressKeyGenCommand } from './address-key-gen-command';
import { promises as fs } from 'fs';

export interface AddressKeyGenParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string
): string => {
  return `${cliPath} address key-hash \
                              --payment-verification-key-file ${filePath} \
                          `;
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyGenParams
): Promise<string> {
  const { account, cliPath } = options;
  const { vkey } = await addressKeyGenCommand({ cliPath });
  const filePath = `tmp/${account}.payment.vkey`;
  await fs.writeFile(filePath, vkey);

  const command = buildCommand(cliPath, account, filePath);
  await exec(command);

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent.trim();
}
