import { deleteFile, exec, readFile } from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface StakePoolIdParams {
  cliPath: string;
  nodevKey: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-pool id --cold-verification-key-file ${filePath}`;
};

export async function stakePoolIdCommand(
  options: StakePoolIdParams
): Promise<string> {
  const { cliPath, nodevKey } = options;
  const UID = uuid();
  const vKeyFilePath = `tmp/${UID}.node.vkey`;
  await fs.writeFile(vKeyFilePath, nodevKey);
  const stdout = await exec(buildCommand(cliPath, vKeyFilePath));

  await deleteFile(vKeyFilePath);

  return stdout.trim();
}
