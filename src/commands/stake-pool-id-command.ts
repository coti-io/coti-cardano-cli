import { deleteFile, exec, readFile } from '../helpers';

export interface StakePoolIdParams {
  cliPath: string;
  poolName: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-pool id --cold-verification-key-file ${filePath}`;
};

export async function stakePoolIdCommand(
  options: StakePoolIdParams
): Promise<string> {
  const { cliPath, poolName } = options;
  const filePath = `tmp/${poolName}.node.vkey`;
  await exec(buildCommand(cliPath, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent.toString().replace(/\s+/g, ' ');
}
