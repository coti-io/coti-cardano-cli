import { deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from '../types';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface TransactionPolicyParams {
  cliPath: string;
  script: string | JSONValue;
}

const buildCommand = (cliPath: string, filePath: string): string => {
  return `${cliPath} transaction policyid --script-file ${filePath}`;
};

export async function transactionPolicyidCommand(
  options: TransactionPolicyParams
): Promise<string> {
  const UID = uuid();
  const filePath = `tmp/script_${UID}.json`;

  await fs.writeFile(
    filePath,
    typeof options.script === 'object'
      ? JSON.stringify(options.script)
      : options.script
  );
  const command = buildCommand(options.cliPath, filePath);
  await exec(command);

  const fileContent = readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
