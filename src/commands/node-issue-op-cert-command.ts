import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';

export interface NodeIssueOpCertParams {
  cliPath: string;
  poolName: string;
  kesPeriod: number;
  counter: string;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  kesPeriod: number,
  filePath: string,
  nodeVkeyPath: string,
  nodeSkeyPath: string,
  nodeCounterPath: string
): string => {
  return `${cliPath} node issue-op-cert \
                        --kes-verification-key-file ${nodeVkeyPath} \
                        --cold-signing-key-file ${nodeSkeyPath} \
                        --operational-certificate-issue-counter ${nodeCounterPath} \
                        --kes-period ${kesPeriod} \
                        --out-file ${filePath}
                    `;
};

export async function nodeIssueOpCertCommand(
  options: NodeIssueOpCertParams
): Promise<JSONValue> {
  const { cliPath, poolName, kesPeriod, counter } = options;
  const filePath = `tmp/${poolName}.node.cert`;
  const { skey, vkey } = await addressKeyGenCommand({ cliPath });
  const nodeCounter = await nodeNewCounterCommand({
    cliPath,
    poolName,
    counter,
  });
  const nodeVkeyPath = `tmp/${poolName}.kes.vkey`;
  const nodeSkeyPath = `tmp/${poolName}.node.skey`;
  const nodeCounterPath = `tmp/${poolName}.node.counter`;
  await fs.writeFile(nodeVkeyPath, vkey);
  await fs.writeFile(nodeSkeyPath, skey);
  await fs.writeFile(nodeCounterPath, nodeCounter);

  await exec(
    buildCommand(
      cliPath,
      poolName,
      kesPeriod,
      filePath,
      nodeVkeyPath,
      nodeSkeyPath,
      nodeCounterPath
    )
  );
  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(nodeVkeyPath);
  await deleteFile(nodeSkeyPath);
  await deleteFile(nodeCounterPath);

  return fileContent;
}
