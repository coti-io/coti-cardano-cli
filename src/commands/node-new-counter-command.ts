import { deleteFile, exec, readFile } from '../helpers';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';

export interface NodeNewCounterParams {
  cliPath: string;
  poolName: string;
  counter: string;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  counter: string,
  filePath: string,
  nodeVerificationPath: string
): string => {
  return `${cliPath} node new-counter \
                        --cold-verification-key-file ${nodeVerificationPath} \
                        --counter-value ${counter} \
                        --operational-certificate-issue-counter-file ${filePath}
                    `;
};

export async function nodeNewCounterCommand(
  options: NodeNewCounterParams
): Promise<string> {
  const { cliPath, poolName, counter } = options;

  const filePath = `tmp/${poolName}.node.counter`;
  const nodeVerificationPath = `tmp/${poolName}.node.vkey`;
  const nodeVkey = await stakePoolIdCommand({ cliPath, poolName });

  await fs.writeFile(nodeVerificationPath, nodeVkey);
  await exec(
    buildCommand(cliPath, poolName, counter, filePath, nodeVerificationPath)
  );

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVerificationPath);

  return fileContent;
}
