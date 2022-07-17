import { exec } from '../helpers';
import { promises as fs } from 'fs';

export interface StakePoolMetadataParams {
  cliPath: string;
  metadata: string;
}

const buildCommand = (cliPath: string): string => {
  return `${cliPath} stake-pool metadata-hash --pool-metadata-file tmp/poolmeta.json`;
};

export async function stakePoolMetadaCommand(
  options: StakePoolMetadataParams
): Promise<string> {
  const { cliPath, metadata } = options;

  await fs.writeFile('tmp/poolmeta.json', metadata);
  const stdout = await exec(buildCommand(cliPath));
  const metaHash = stdout.toString().replace(/\s+/g, ' ');
  await exec('rm tmp/poolmeta.json');

  return metaHash;
}
