import { exec } from '../helpers';
import { TransactionViewOptions } from '../interfaces';

export interface TransactionViewParams {
  cliPath: string;
  options: TransactionViewOptions;
}

const buildCommand = (cliPath: string, txArg: string): string => {
  return `${cliPath} transaction view ${txArg}`;
};

export async function transactionViewCommand(
  input: TransactionViewParams
): Promise<string> {
  const { cliPath, options } = input;
  const txArg = options.txBody
    ? `--tx-body-file ${options.txBody}`
    : `--tx-file ${options.txFile || ''}`;
  const stdout = await exec(buildCommand(cliPath, txArg));

  return stdout.trim();
}
