import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface StakePoolDeregistrationParams {
  cliPath: string;
  epoch: number;
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
  const { cliPath, epoch } = input;
  const UID = uuid();
  const filePath = `tmp/${UID}.pool.cert`;
  const nodeVkeyPath = `tmp/${UID}.node.vkey`;
  const vkey = await stakePoolIdCommand({ cliPath });
  await fs.writeFile(nodeVkeyPath, vkey);
  await exec(buildCommand(cliPath, epoch, filePath, nodeVkeyPath));

  const fileContent = readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVkeyPath);

  return fileContent;
}
