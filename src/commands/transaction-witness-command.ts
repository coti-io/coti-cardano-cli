import { deleteFile, exec, readFile } from '../helpers';
import { TransactionWitnessOptions } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

const buildCommand = (
  cliPath: string,
  networkParam: string,
  txBody: string,
  filePath: string,
  signingParams: string,
  address: string
): string => {
  return `${cliPath} transaction witness \
        --tx-body-file ${txBody} \
        ${networkParam} \
        --signing-key-file ${signingParams} \
        --address ${address} \
        --out-file ${filePath} 
        `;
};

export async function transactionWitnessCommand(
  options: TransactionWitnessOptions,
  cliPath: string,
  networkParam: string
): Promise<string> {
  const { txBody, signingKey, address } = options;
  const UID = uuid();
  if (!options.signingKey) {
    throw new Error('signing-key required for transaction witness command');
  }
  const txBodyFilePath = `tmp/${UID}.txBody`;
  const signingKeyFilePath = `tmp/${UID}.signingkey`;
  await fs.writeFile(txBodyFilePath, txBody);
  await fs.writeFile(signingKeyFilePath, signingKey);

  const filePath = `tmp/tx_${UID}.witness`;
  await exec(
    buildCommand(
      cliPath,
      networkParam,
      txBodyFilePath,
      filePath,
      signingKeyFilePath,
      address
    )
  );

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(txBodyFilePath);
  await deleteFile(signingKeyFilePath);

  return fileContent;
}
