import { exec } from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface TransactionSubmitParams {
  cliPath: string;
  networkParam: string;
  tx: string;
}

const buildCommand = (
  cliPath: string,
  txFilePath: string,
  networkParam: string
): string => {
  return `${cliPath} transaction submit ${networkParam} --tx-file ${txFilePath}`;
};

export async function transactionSubmitCommand(
  options: TransactionSubmitParams
): Promise<string> {
  const tx = options.tx;
  const UID = uuid();
  const txFilePAth = `tmp/tx_${UID}.signed`;

  await fs.writeFile(
    txFilePAth,
    typeof tx === 'object' ? JSON.stringify(tx) : tx
  );

  const stdout = await exec(
    buildCommand(options.cliPath, txFilePAth, options.networkParam)
  );

  return stdout.trim();
}
