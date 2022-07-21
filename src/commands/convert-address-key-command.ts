import { deleteFile, exec, readFile } from '../helpers';
import { promises as fs } from 'fs';
import { JSONValue } from '../types';

export interface ConvertAddressKeyParams {
  cliPath: string;
  signingKey: string;
}

const buildCommand = (
  cliPath: string,
  signingKeyFilePath: string,
  filePath: string
): string => {
  return `${cliPath} key convert-cardano-address-key \
                        --shelley-payment-key \
                        --signing-key-file ${signingKeyFilePath} \
                        --out-file ${filePath}
                    `;
};

export async function ConvertAddressKeyCommand(
  options: ConvertAddressKeyParams
): Promise<JSONValue> {
  const { cliPath, signingKey } = options;
  const signingKeyPath = 'tmp/signingkey.skey';
  const filePath = 'tmp/converted-key.json';

  await fs.writeFile(signingKeyPath, signingKey);

  await exec(buildCommand(cliPath, signingKeyPath, filePath));

  const fileContent = await readFile(filePath);

  await deleteFile(signingKeyPath);
  await deleteFile(filePath);

  return fileContent;
}
