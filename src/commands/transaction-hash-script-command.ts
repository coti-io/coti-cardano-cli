import { exec } from '../helpers';
import { JSONValue } from '../types';

export interface TransactionHashScriptDataParams {
  cliPath: string;
  script: JSONValue;
}

const buildCommand = (cliPath: string, script: JSONValue): string => {
  return `${cliPath} transaction hash-script-data --script-data-value '${JSON.stringify(
    script
  )}'`;
};

export async function transactionHashScriptDataCommand(
  options: TransactionHashScriptDataParams
): Promise<string> {
  const stdout = await exec(buildCommand(options.cliPath, options.script));
  return stdout.toString().trim();
}
