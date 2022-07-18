import { deleteFile, exec, readFile } from '../helpers';

export interface StakeAddressKeyHashParams {
  cliPath: string;
  account: string;
}

const buildCommand = (
  cliPath: string,
  account: string,
  filePath: string
): string => {
  return `${cliPath} stake-address key-hash \
                        --staking-verification-key-file ${filePath} \
                    `;
};

export async function stakeAddressKeyHashCommand(
  options: StakeAddressKeyHashParams
): Promise<string> {
  const { cliPath, account } = options;
  const filePath = `tmp/${account}.stake.vkey`;
  await exec(buildCommand(cliPath, account, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
