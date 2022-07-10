import { exec } from '../helpers';
import { AddressInfo } from '../interfaces';

export interface AddressInfoParams {
  cliPath: string;
  address: string;
}

const buildCommand = (cliPath: string, address: string): string => {
  return `${cliPath} address info \
              --address ${address} \
              `;
};

export async function addressInfoCommand(
  options: AddressInfoParams
): Promise<AddressInfo> {
  const command = buildCommand(options.cliPath, options.address);
  const stdout = await exec(command);

  return JSON.parse(stdout.replace(/\s+/g, ' ')) as AddressInfo;
}
