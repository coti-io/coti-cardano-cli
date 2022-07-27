import { deleteFile, exec, readFile } from '../helpers';
import { TransactionAssembleOptions } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface TransactionAssembleParams {
  cliPath: string;
  options: TransactionAssembleOptions;
}

const buildCommand = (
  cliPath: string,
  txBodyFilePath: string,
  witnessFiles: string,
  filePath: string
): string => {
  return `${cliPath} transaction assemble \
        --tx-body-file ${txBodyFilePath} \
        ${witnessFiles} \
        --out-file ${filePath}`;
};

export async function transactionAssembleCommand(
  input: TransactionAssembleParams
): Promise<string> {
  const { options, cliPath } = input;
  const { txBody, witnessFiles } = options;
  const UID = uuid();
  const filePath = `tmp/tx_${UID}.signed`;
  const txBodyFilePath = `tmp/tx_${UID}.signed`;
  await fs.writeFile(txBodyFilePath, txBody);

  const witnessFilesPaths = [];
  let witnessFilePathsToString = '';
  for (const witnessFile of witnessFiles) {
    const innerUID = uuid();
    const path = `tmp/witness_${innerUID}`;
    await fs.writeFile(path, witnessFile);
    witnessFilesPaths.push(path);
    witnessFilePathsToString += `--witness-file ${path} `;
  }

  await exec(
    buildCommand(cliPath, txBodyFilePath, witnessFilePathsToString, filePath)
  );

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);
  await deleteFile(txBodyFilePath);
  for (const witnessPath of witnessFilesPaths) {
    await deleteFile(witnessPath);
  }

  return fileContent;
}
