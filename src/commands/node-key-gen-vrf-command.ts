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
}

const buildCommand = (cliPath: string, vkey: string, skey: string): string => {
  return `${cliPath} node key-gen-VRF \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `;
};

export async function nodeKeyGenVrfCommand(
  options: NodeKeyGenVrfParams
): Promise<Account> {
  const { cliPath } = options;
  const UID = uuid();
  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;
  if (await checkFileExists(nodeVkeyPath))
    return Promise.reject(`${nodeVkeyPath} file already exists`);
  if (await checkFileExists(nodeSkeyPath))
    return Promise.reject(`${nodeSkeyPath} file already exists`);

  const { skey, vkey } = await addressKeyGenCommand({ cliPath });

  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, skey);

  await exec(buildCommand(cliPath, JSON.stringify(vkey), JSON.stringify(skey)));

  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);

  return {
    vkey,
    skey,
  };
}
