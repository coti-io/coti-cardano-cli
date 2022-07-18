import { deleteFile, exec, readFile } from '../helpers';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';

export interface StakeAddressBuildParams {
  cliPath: string;
  account: string;
  network: string;
}

const buildCommand = (
  cliPath: string,
  network: string,
  filePath: string,
  stakingVerificationPath: string
): string => {
  return `${cliPath} stake-address build \
                        --staking-verification-key-file ${stakingVerificationPath} \
                        --out-file ${filePath} \
                        ${network}
                    `;
};

export async function stakeAddressBuildCommand(
  options: StakeAddressBuildParams
): Promise<string> {
  const { account, cliPath, network } = options;
  const filePath = `tmp/${account}.stake.addr`;
  const stakingVerificationPath = `tmp/${account}.stake.vkey`;
  const stakeAddressKey = await stakeAddressKeyGenCommand({ account, cliPath });
  await fs.writeFile(stakingVerificationPath, stakeAddressKey);
  await exec(buildCommand(cliPath, network, filePath, stakingVerificationPath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
