import { deleteFile, exec, readFile } from '../helpers';
import { AddressInfo } from '../interfaces';
import { uuid } from 'uuidv4';

export interface AddressInfoParams {
  cliPath: string;
  address: string;
}

const buildCommand = (
  cliPath: string,
  address: string,
  filePath: string
): string => {
  return `${cliPath} address info \
              --address ${address} \
              --out-file ${filePath} \
              `;
};

export async function addressInfoCommand(
  options: AddressInfoParams
): Promise<AddressInfo> {
  const UID = uuid();
  const filePath = `tmp/address_info${UID}.json`;
  const command = buildCommand(options.cliPath, options.address, filePath);
  await exec(command);

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return JSON.parse(fileContent) as AddressInfo;
}
