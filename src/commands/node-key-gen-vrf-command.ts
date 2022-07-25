import {
  buildRandomFilePath,
  checkFileExists,
  deleteFile,
  exec, readFile,
} from '../helpers';
import { Account } from '../interfaces';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeKeyGenVrfParams {
  cliPath: string;
}

export interface NodeKeyGenVrfRes {
  vkey: string;
  skey: string;
}

const buildCommand = (cliPath: string, nodeVkeyPath: string, nodeSkeyPath: string): string => {
  return `${cliPath} node key-gen-VRF \
                        --verification-key-file ${nodeVkeyPath} \
                        --signing-key-file ${nodeSkeyPath}
                    `;
};

export async function nodeKeyGenVrfCommand(
  options: NodeKeyGenVrfParams
): Promise<NodeKeyGenVrfRes> {
  const { cliPath } = options;
  const UID = uuid();
  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;


  await exec(buildCommand(cliPath, nodeVkeyPath, nodeSkeyPath));

  const vkey = await readFile(nodeVkeyPath);
  const skey = await readFile(nodeSkeyPath);

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);

  return {skey, vkey};
}
