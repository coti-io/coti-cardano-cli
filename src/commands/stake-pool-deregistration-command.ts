import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakePoolDeregistrationParams {
  cliPath: string;
  epoch: number;
  nodevKey: string;
}

const buildCommand = (
  cliPath: string,
  epoch: number,
  filePath: string,
  nodeVkeyPath: string
): string => {
  return `${cliPath} stake-pool deregistration-certificate \
                --cold-verification-key-file ${nodeVkeyPath} \
                --epoch ${epoch} \
                --out-file ${filePath}
              `;
};

export async function stakePoolDeregistrationCommand(
  input: StakePoolDeregistrationParams
): Promise<string> {
  const { cliPath, epoch, nodevKey } = input;
  const UID = uuid();
  const filePath = `tmp/${UID}.pool.cert`;
  const nodeVkeyPath = `tmp/${UID}.node.vkey`;

  await fs.writeFile(nodeVkeyPath, nodevKey);
  await exec(buildCommand(cliPath, epoch, filePath, nodeVkeyPath));

  const fileContent = readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVkeyPath);

  return fileContent;
}
