import { deleteFile, exec, readFile } from '../helpers';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeNewCounterParams {
  cliPath: string;
  counter: string;
  nodeVkey: string;
  issueCounter: string;
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
  const { cliPath, counter, nodeVkey, issueCounter } = options;
  const UID = uuid();

  const issueCounterFilePath = `tmp/${UID}.node.counter`;
  const nodeVerificationPath = `tmp/${UID}.node.vkey`;

  await fs.writeFile(nodeVerificationPath, nodeVkey);
  await fs.writeFile(issueCounterFilePath, issueCounter);
  const stdout = await exec(
    buildCommand(cliPath, counter, issueCounterFilePath, nodeVerificationPath)
  );

  await deleteFile(issueCounterFilePath);
  await deleteFile(nodeVerificationPath);

  return stdout.trim();
}
