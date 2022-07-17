import { deleteFile, exec, readFile } from '../helpers';

export interface StakeAddressBuildParams {
  cliPath: string;
  account: string;
  network: string;
}

const buildCommand = (
  cliPath: string,
  network: string,
  filePath: string,
  account: string
): string => {
  return `${cliPath} stake-address build \
                        --staking-verification-key-file tmp/${account}.stake.vkey \
                        --out-file ${filePath} \
                        ${network}
                    `;
};

export async function stakeAddressBuildCommand(
  options: StakeAddressBuildParams
): Promise<string> {
  const { account, cliPath, network } = options;
  const filePath = `tmp/${account}.stake.addr`;
  await exec(buildCommand(cliPath, network, filePath, account));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
