import { exec } from '../helpers';
import { JSONValue } from '../types';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface TransactionPolicyParams {
  cliPath: string;
  script: JSONValue;
}

const buildCommand = (cliPath: string, UID: string): string => {
  return `${cliPath} transaction policyid --script-file tmp/script_${UID}.json`;
};

export async function transactionPolicyidCommand(
  options: TransactionPolicyParams
): Promise<string> {
  const UID = uuid();
  await fs.writeFile(`tmp/script_${UID}.json`, JSON.stringify(options.script));
  const command = buildCommand(options.cliPath, UID);
  const stdout = await exec(command);

  return stdout.toString().trim();
}
