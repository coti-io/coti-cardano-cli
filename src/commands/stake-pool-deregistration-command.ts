import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';

export interface StakePoolDeregistrationParams {
  cliPath: string;
  poolName: string;
  epoch: number;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  epoch: number,
  filePath: string
): string => {
  return `${cliPath} stake-pool deregistration-certificate \
                --cold-verification-key-file tmp/priv/pool/${poolName}/${poolName}.node.vkey \
                --epoch ${epoch} \
                --out-file ${filePath}
              `;
};

export async function stakePoolDeregistrationCommand(
  input: StakePoolDeregistrationParams
): Promise<JSONValue> {
  const { cliPath, poolName, epoch } = input;
  const filePath = `tmp/${poolName}.pool.cert`;
  await exec(buildCommand(cliPath, poolName, epoch, filePath));

  const fileContent = readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
