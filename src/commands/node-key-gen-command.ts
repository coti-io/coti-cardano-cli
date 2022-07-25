import { checkFileExists, deleteFile, exec } from '../helpers';
import { Account } from '../interfaces';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeKeyGenParams {
  cliPath: string;
  counter: string;
  vkey: string;
  nodeSkey: string;
  nodeCounter: string;
}

const buildCommand = (
  cliPath: string,
  vkey: string,
  skey: string,
  counter: string
): string => {
  return `${cliPath} node key-gen \
                        --cold-verification-key-file ${vkey} \
                        --cold-signing-key-file ${skey} \
                        --operational-certificate-issue-counter ${counter}
                    `;
};

export async function nodeKeyGenCommand(
  options: NodeKeyGenParams
): Promise<string> {
  const { cliPath, nodeCounter, nodeSkey, vkey } = options;
  const UID = uuid();
  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;
  const nodeCounterPath = `tmp/${UID}.node.counter`;

  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, nodeSkey);
  await fs.writeFile(nodeCounterPath, nodeCounter);

  const stdout = await exec(
    buildCommand(cliPath, nodeVkeyPath, nodeSkeyPath, nodeCounterPath)
  );

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);
  await deleteFile(nodeCounterPath);

  return stdout.trim();
}
