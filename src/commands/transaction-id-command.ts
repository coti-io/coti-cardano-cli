import { deleteFile, exec } from '../helpers';
import { TransactionViewOptions } from '../interfaces';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface TransactionIdParams {
  cliPath: string;
  options: TransactionViewOptions;
}

const buildCommand = (
  cliPath: string,
  txBodyFilePath: string,
  txFile: string
): string => {
  return `${cliPath} transaction txid \
          ${txBodyFilePath ? `--tx-body-file ${txBodyFilePath}` : ''} \
          ${txFile ? `--tx-file ${txFile}` : ''} `;
};

export async function transactionIdCommand(
  input: TransactionIdParams
): Promise<string> {
  const { options, cliPath } = input;
  const { txBody, txFile } = options;
  const UID = uuid();
  let txBodyFilePath = '';
  let txFilePath = '';

  if (txBody) {
    txBodyFilePath = `tmp/tx_body_${UID}.view`;
    await fs.writeFile(txBodyFilePath, txBody);
  }
  if (txFile) {
    txFilePath = `tmp/tx_${UID}.view`;
    await fs.writeFile(txFilePath, txFile);
  }

  const stdout = await exec(buildCommand(cliPath, txBodyFilePath, txFilePath));

  await deleteFile(txBodyFilePath);

  return stdout.trim();
}
