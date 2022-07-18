import { deleteFile, exec, readFile } from '../helpers';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface StakePoolMetadataParams {
  cliPath: string;
  metadata: string;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} stake-pool metadata-hash --pool-metadata-file ${filePath}`;
};

export async function stakePoolMetadaCommand(
  options: StakePoolMetadataParams
): Promise<string> {
  const { cliPath, metadata } = options;

  const filePath = 'tmp/poolmeta.json';
  await fs.writeFile(filePath, metadata);
  await exec(buildCommand(cliPath, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent.replace(/\s+/g, ' ');
}
