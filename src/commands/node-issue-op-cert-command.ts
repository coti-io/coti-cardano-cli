import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { addressKeyGenCommand } from './address-key-gen-command';
import { nodeNewCounterCommand } from './node-new-counter-command';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface NodeIssueOpCertParams {
  cliPath: string;
  kesPeriod: number;
  nodeCounter: string;
  nodeVkey: string;
  nodeSkey: string;
}

const buildCommand = (
  cliPath: string,
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
): Promise<string> {
  const { cliPath, kesPeriod, nodeCounter, nodeSkey, nodeVkey } = options;
  const UID = uuid();
  const filePath = `tmp/${UID}.node.cert`;

  const nodeVkeyPath = `tmp/${UID}.kes.vkey`;
  const nodeSkeyPath = `tmp/${UID}.node.skey`;
  const nodeCounterPath = `tmp/${UID}.node.counter`;

  await fs.writeFile(nodeVkeyPath, nodeVkey);
  await fs.writeFile(nodeSkeyPath, nodeSkey);
  await fs.writeFile(nodeCounterPath, nodeCounter);

  await exec(
    buildCommand(
      cliPath,
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
