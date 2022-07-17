import { checkFileExists, exec } from '../helpers';
import { Account } from '../interfaces';

export interface NodeKeyGenKesParams {
  cliPath: string;
  poolName: string;
}

const buildCommand = (cliPath: string, vkey: string, skey: string): string => {
  return `${cliPath} node key-gen-KES \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `;
};

export async function nodeKeyGenKesCommand(
  options: NodeKeyGenKesParams
): Promise<Account> {
  const { cliPath, poolName } = options;
  const vkey = `tmp/${poolName}.kes.vkey`;
  const skey = `tmp/${poolName}.kes.skey`;
  if (await checkFileExists(vkey))
    return Promise.reject(`${vkey} file already exists`);
  if (await checkFileExists(skey))
    return Promise.reject(`${skey} file already exists`);
  await exec(buildCommand(cliPath, vkey, skey));
  return {
    vkey,
    skey,
  };
}
