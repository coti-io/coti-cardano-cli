import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';

export interface StakeAddressDeregistrationParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string
): string => {
  return `${cliPath} stake-address deregistration-certificate \
                        --staking-verification-key-file tmp/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressDeregistrationCommand(
  options: StakeAddressDeregistrationParams
): Promise<JSONValue> {
  const { cliPath, account } = options;
  const filePath = `tmp/priv/wallet/${account}/${account}.stake.cert`;

  await exec(buildCommand(cliPath, account, filePath));
  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
