import {deleteFile, exec, readFile} from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface StakeAddressKeyGenParams {
  cliPath: string;
}

export interface  StakeAddressKeyGenRes {
  vkey: string;
  skey: string;
}

const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
  skeyFilePath: string
): string => {
  return `${cliPath} stake-address key-gen \
                        --verification-key-file ${vkeyFilePath} \
                        --signing-key-file ${skeyFilePath}
                    `;
};

export async function stakeAddressKeyGenCommand(
  options: StakeAddressKeyGenParams
): Promise<StakeAddressKeyGenRes> {
  const { cliPath } = options;
  const UID = uuid();
  const vkeyFilePath = `tmp/${UID}.stake.vkey`;
  const skeyFilePath = `tmp/${UID}.stake.skey`;


  await exec(buildCommand(cliPath, vkeyFilePath, skeyFilePath));
  const vkey = await readFile(vkeyFilePath);
  const skey = await readFile(skeyFilePath);
  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);

  return { skey, vkey };
}
