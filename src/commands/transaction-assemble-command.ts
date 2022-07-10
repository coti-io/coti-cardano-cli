import { deleteFile, exec, readFile, witnessFilesToString } from "../helpers";
import { TransactionAssembleOptions } from '../interfaces';
import { uuid } from 'uuidv4';

export interface TransactionAssembleParams {
  cliPath: string;
  options: TransactionAssembleOptions;
}

const buildCommand = (
  cliPath: string,
  options: TransactionAssembleOptions,
  witnessFiles: string,
  filePath: string
): string => {
  return `${cliPath} transaction assemble \
        --tx-body-file ${options.txBody} \
        ${witnessFiles} \
        --out-file ${filePath}`;
};

export async function transactionAssembleCommand(
  input: TransactionAssembleParams
): Promise<string> {
  const { options, cliPath } = input;
  const UID = uuid();
  const witnessFiles = witnessFilesToString(options.witnessFiles);
  const filePath = `tmp/tx_${UID}.signed`;
  await exec(buildCommand(cliPath, options, witnessFiles, filePath));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
