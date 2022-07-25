import { deleteFile, exec, readFile } from '../helpers';
import { uuid } from 'uuidv4';

export interface StakeAddressKeyHashParams {
  cliPath: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-address key-hash \
                        --staking-verification-key-file ${filePath} \
                    `;
};

export async function stakeAddressKeyHashCommand(
  options: StakeAddressKeyHashParams
): Promise<string> {
  const { cliPath } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.stake.vkey`;
  await exec(buildCommand(cliPath, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
