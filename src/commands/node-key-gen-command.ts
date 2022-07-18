import { checkFileExists, deleteFile, exec } from '../helpers';
import { Account } from '../interfaces';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';

export interface NodeKeyGenParams {
  cliPath: string;
  poolName: string;
  counter: string;
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
): Promise<Account> {
  const { cliPath, poolName, counter } = options;
  const nodeVkeyPath = `tmp/${poolName}.kes.vkey`;
  const nodeSkeyPath = `tmp/${poolName}.node.skey`;
  const nodeCounterPath = `tmp/${poolName}.node.counter`;
  if (await checkFileExists(nodeVkeyPath))
    return Promise.reject(`${nodeVkeyPath} file already exists`);
  if (await checkFileExists(nodeSkeyPath))
    return Promise.reject(`${nodeSkeyPath} file already exists`);
  if (await checkFileExists(nodeCounterPath))
    return Promise.reject(`${nodeCounterPath} file already exists`);
  const { skey, vkey } = await addressKeyGenCommand({ cliPath });
  const nodeCounter = await nodeNewCounterCommand({
    cliPath,
    poolName,
    counter,
  });

  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, skey);
  await fs.writeFile(nodeCounterPath, nodeCounter);

  await exec(
    buildCommand(cliPath, JSON.stringify(vkey), JSON.stringify(skey), counter)
  );

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);
  await deleteFile(nodeCounterPath);
  return {
    vkey,
    skey,
    counter,
  };
}
