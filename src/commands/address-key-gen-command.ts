import {
  buildRandomFilePath,
  deleteFile,
  exec,
  readFile,
} from '../helpers';

export interface AddressKeyGenParams {
  cliPath: string;
}

export interface AddressKeyGenRes {
  skey: string;
  vkey: string;
}

const buildCommand = (
  cliPath: string,
  vkeyFilePath: string,
  skeyFilePath: string
): string => {
  return `${cliPath} address key-gen \
                        --verification-key-file ${vkeyFilePath} \
                        --signing-key-file ${skeyFilePath}
                    `;
};

export async function addressKeyGenCommand(
  options: AddressKeyGenParams
): Promise<AddressKeyGenRes> {
  const vkeyFilePath = buildRandomFilePath();
  const skeyFilePath = buildRandomFilePath();


  const command = buildCommand(options.cliPath, vkeyFilePath, skeyFilePath);
  await exec(command);

  const vkey = await readFile(vkeyFilePath);
  const skey = await readFile(skeyFilePath);
  await deleteFile(vkeyFilePath);
  await deleteFile(skeyFilePath);
  return {skey, vkey};
}
