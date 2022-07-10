import { buildRandomFilePath, checkFileExists, exec } from '../helpers';
import { Account } from '../interfaces';

export interface NodeKeyGenVrfParams {
  cliPath: string;
  poolName: string;
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
  const { poolName, cliPath } = options;
  const vkey = `tmp/priv/pool/${poolName}/${poolName}.vrf.vkey`;
  const skey = `tmp/priv/pool/${poolName}/${poolName}.vrf.skey`;
  if (await checkFileExists(vkey))
    return Promise.reject(`${vkey} file already exists`);
  if (await checkFileExists(skey))
    return Promise.reject(`${skey} file already exists`);
  await exec(`mkdir -p tmp/priv/pool/${poolName}`);
  await exec(buildCommand(cliPath, vkey, skey));
  return {
    vkey,
    skey,
  };
}
