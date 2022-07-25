import { deleteFile, exec, readFile } from '../helpers';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakeAddressKeyHashParams {
  cliPath: string;
  vKey: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-address key-hash \
                        --staking-verification-key-file ${filePath} \
                    `;
};

export async function stakeAddressKeyHashCommand(
  options: StakeAddressKeyHashParams
): Promise<string> {
  const { cliPath, vKey } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.stake.vkey`;
  await fs.writeFile(filePath, vKey);
  const stdout = await exec(buildCommand(cliPath, filePath));

  await deleteFile(filePath);

  return stdout.trim();
}
