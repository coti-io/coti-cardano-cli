import { exec } from '../helpers';

export interface AddressKeyGenParams {
  cliPath: string;
  account: string;
}

const buildCommand = (cliPath: string, account: string): string => {
  return `${cliPath} address key-hash \
                              --payment-verification-key-file tmp/${account}.payment.vkey \
                          `;
};

export async function buildAddressKeyHashCommand(
  options: AddressKeyGenParams
): Promise<string> {
  const command = buildCommand(options.cliPath, options.account);
  const stdout = await exec(command);

  return stdout.trim();
}
