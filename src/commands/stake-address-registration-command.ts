import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';

export interface StakeAddressRegistrationParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string
): string => {
  return `${cliPath} stake-address registration-certificate \
                        --staking-verification-key-file tmp/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressRegistrationCommand(
  options: StakeAddressRegistrationParams
): Promise<JSONValue> {
  const { cliPath, account } = options;
  const filePath = `tmp/priv/wallet/${account}/${account}.stake.cert`;
  await exec(buildCommand(cliPath, account, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
