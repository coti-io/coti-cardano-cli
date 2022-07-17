import { checkFileExists, exec } from '../helpers';
import { Account } from '../interfaces';

export interface NodeKeyGenParams {
  cliPath: string;
  poolName: string;
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
  const { cliPath, poolName } = options;
  const vkey = `tmp/${poolName}.node.vkey`;
  const skey = `tmp/${poolName}.node.skey`;
  const counter = `tmp/${poolName}.node.counter`;
  if (await checkFileExists(vkey))
    return Promise.reject(`${vkey} file already exists`);
  if (await checkFileExists(skey))
    return Promise.reject(`${skey} file already exists`);
  if (await checkFileExists(counter))
    return Promise.reject(`${counter} file already exists`);
  await exec(buildCommand(cliPath, vkey, skey, counter));
  return {
    vkey,
    skey,
    counter,
  };
}
