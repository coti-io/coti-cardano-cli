import { checkFileExists, deleteFile, exec } from '../helpers';
import { Account } from '../interfaces';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeKeyGenKesParams {
  cliPath: string;
  vkey: string;
  skey: string;
}

const buildCommand = (cliPath: string, vkey: string, skey: string): string => {
  return `${cliPath} node key-gen-KES \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `;
};

export async function nodeKeyGenKesCommand(
  options: NodeKeyGenKesParams
): Promise<string> {
  const { cliPath, skey, vkey } = options;
  const UID = uuid();
  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;

  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, skey);

  const stdout = await exec(
    buildCommand(cliPath, JSON.stringify(vkey), JSON.stringify(skey))
  );

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);

  return stdout.trim();
}
