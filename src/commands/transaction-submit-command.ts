import { buildRandomFilePath, exec } from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';
import { transactionIdCommand } from './transaction-id-command';

export interface TransactionSubmitParams {
  cliPath: string;
  networkParam: string;
  tx: string;
}

const buildCommand = (
  cliPath: string,
  parsedTx: string,
  networkParam: string
): string => {
  return `${cliPath} transaction submit ${networkParam} --tx-file ${parsedTx}`;
};

export async function transactionSubmitCommand(
  options: TransactionSubmitParams
): Promise<string> {
  const tx = options.tx;
  const UID = uuid();
  let parsedTx;

  if (typeof tx === 'object') {
    await fs.writeFile(`tmp/tx_${UID}.signed`, JSON.stringify(tx));
    parsedTx = `tmp/tx_${UID}.signed`;
  } else {
    parsedTx = tx;
  }

  await exec(buildCommand(options.cliPath, parsedTx, options.networkParam));

  return await transactionIdCommand({
    cliPath: options.cliPath,
    options: { txFile: parsedTx },
  });
}
