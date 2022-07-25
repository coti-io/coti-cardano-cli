import { deleteFile, exec, readFile } from '../helpers';
import { uuid } from 'uuidv4';

export interface StakePoolIdParams {
  cliPath: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-pool id --cold-verification-key-file ${filePath}`;
};

export async function stakePoolIdCommand(
  options: StakePoolIdParams
): Promise<string> {
  const { cliPath } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.node.vkey`;
  await exec(buildCommand(cliPath, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent.toString().replace(/\s+/g, ' ');
}
