import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { promises as fs } from 'fs';

export interface StakePoolDeregistrationParams {
  cliPath: string;
  poolName: string;
  epoch: number;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
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
): Promise<JSONValue> {
  const { cliPath, poolName, epoch } = input;
  const filePath = `tmp/${poolName}.pool.cert`;
  const nodeVkeyPath = `tmp/${poolName}.node.vkey`;
  const vkey = await stakePoolIdCommand({ cliPath, poolName });
  await fs.writeFile(nodeVkeyPath, vkey);
  await exec(buildCommand(cliPath, poolName, epoch, filePath, nodeVkeyPath));

  const fileContent = readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVkeyPath);

  return fileContent;
}
