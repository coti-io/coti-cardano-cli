import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakeAddressDeregistrationParams {
  cliPath: string;
  stakeVkey: string;
}

const buildCommand = (
  cliPath: string,
  filePath: string,
  stakingVerificationPath: string
): string => {
  return `${cliPath} stake-address deregistration-certificate \
                        --staking-verification-key-file ${stakingVerificationPath} \
                        --out-file ${filePath}
                    `;
};

export async function stakeAddressDeregistrationCommand(
  options: StakeAddressDeregistrationParams
): Promise<JSONValue> {
  const { cliPath, stakeVkey } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.stake.cert`;
  const stakingVerificationPath = `tmp/${UID}.stake.vkey`;

  await fs.writeFile(stakingVerificationPath, stakeVkey);
  await exec(buildCommand(cliPath, filePath, stakingVerificationPath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(stakingVerificationPath);

  return fileContent;
}
