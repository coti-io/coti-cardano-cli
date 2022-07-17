import { buildRandomFilePath, checkFileExists, exec } from '../helpers';
import { Account } from '../interfaces';

export interface NodeKeyGenKesParams {
  cliPath: string;
  poolName: string;
}

const buildCommand = (cliPath: string, account: string): string => {
  return `${cliPath} stake-address key-hash \
                        --staking-verification-key-file tmp/priv/wallet/${account}/${account}.stake.vkey \
                    `;
};

export async function nodeKeyGenKesCommand(
  options: NodeKeyGenKesParams
): Promise<Account> {
  const { cliPath, poolName } = options;
  const vkey = `tmp/priv/pool/${poolName}/${poolName}.kes.vkey`;
  const skey = `tmp/priv/pool/${poolName}/${poolName}.kes.skey`;
  if (await checkFileExists(vkey))
    return Promise.reject(`${vkey} file already exists`);
  if (await checkFileExists(skey))
    return Promise.reject(`${skey} file already exists`);
  await exec(`mkdir -p tmp/priv/pool/${poolName}`);
  await exec(`${cliPath} node key-gen-KES \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `);
  return {
    vkey,
    skey,
  };
}
