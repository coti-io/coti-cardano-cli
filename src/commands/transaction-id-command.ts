import { exec } from '../helpers';
import { TransactionViewOptions } from '../interfaces';

export interface TransactionIdParams {
  cliPath: string;
  options: TransactionViewOptions;
}

const buildCommand = (cliPath: string, txArg: string): string => {
  return `${cliPath} transaction txid ${txArg}`;
};

export async function transactionIdCommand(
  input: TransactionIdParams
): Promise<string> {
  const { options, cliPath } = input;
  const txArg = options.txBody
    ? `--tx-body-file ${options.txBody}`
    : `--tx-file ${options.txFile || ''}`;
  const stdout = await exec(buildCommand(cliPath, txArg));

  return stdout.trim();
}
