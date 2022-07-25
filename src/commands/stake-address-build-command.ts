import { deleteFile, exec, readFile } from '../helpers';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakeAddressBuildParams {
  cliPath: string;
  network: string;
  stakeVkey: string;
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
  const { cliPath, network, stakeVkey } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.stake.addr`;
  const stakingVerificationPath = `tmp/${UID}.stake.vkey`;

  await fs.writeFile(stakingVerificationPath, stakeVkey);
  await exec(buildCommand(cliPath, network, filePath, stakingVerificationPath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
