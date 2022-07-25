import {
  buildRandomFilePath,
  checkFileExists,
  deleteFile,
  exec,
} from '../helpers';
import { Account } from '../interfaces';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeKeyGenVrfParams {
  cliPath: string;
  skey: string;
  vkey: string;
}

const buildCommand = (cliPath: string, vkey: string, skey: string): string => {
  return `${cliPath} node key-gen-VRF \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `;
};

export async function nodeKeyGenVrfCommand(
  options: NodeKeyGenVrfParams
): Promise<string> {
  const { cliPath, skey, vkey } = options;
  const UID = uuid();
  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;

  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, skey);

  const stdout = await exec(buildCommand(cliPath, nodeVkeyPath, nodeSkeyPath));

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);

  return stdout.trim();
}
