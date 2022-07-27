import { deleteFile, exec } from '../helpers';
import { TransactionViewOptions } from '../interfaces';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface TransactionViewParams {
  cliPath: string;
  options: TransactionViewOptions;
}

const buildCommand = (
  cliPath: string,
  txBodyFilePath: string,
  txFile: string
): string => {
  return `${cliPath} transaction view \
          ${txBodyFilePath ? `--tx-body-file ${txBodyFilePath}` : ''} \
          ${txFile ? `--tx-file ${txFile}` : ''} \
         `;
};

export async function transactionViewCommand(
  input: TransactionViewParams
): Promise<string> {
  const { cliPath, options } = input;
  const { txBody, txFile } = options;

  const UID = uuid();
  let txBodyFilePath = '';

  if (txBody) {
    txBodyFilePath = `tmp/tx_${UID}.view`;
    await fs.writeFile(txBodyFilePath, txBody);
  }

  const stdout = await exec(
    buildCommand(cliPath, txBodyFilePath, txFile || '')
  );

  if (txBodyFilePath !== '') await deleteFile(txBodyFilePath);

  return stdout.trim();
}
