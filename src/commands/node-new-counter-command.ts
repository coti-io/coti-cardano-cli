import { deleteFile, exec, readFile } from '../helpers';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeNewCounterParams {
  cliPath: string;
  counter: string;
}

const buildCommand = (
  cliPath: string,
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
  const { cliPath, counter } = options;
  const UID = uuid();

  const filePath = `tmp/${UID}.node.counter`;
  const nodeVerificationPath = `tmp/${UID}.node.vkey`;
  const nodeVkey = await stakePoolIdCommand({ cliPath });

  await fs.writeFile(nodeVerificationPath, nodeVkey);
  await exec(buildCommand(cliPath, counter, filePath, nodeVerificationPath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVerificationPath);

  return fileContent;
}
