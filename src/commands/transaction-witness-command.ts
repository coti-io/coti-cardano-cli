import { deleteFile, exec, readFile } from '../helpers';
import { TransactionWitnessOptions } from '../interfaces';
import { uuid } from 'uuidv4';

const buildCommand = (
  cliPath: string,
  networkParam: string,
  txBody: string,
  filePath: string,
  signingParams: string
): string => {
  return `${cliPath} transaction witness \
        --tx-body-file ${txBody} \
        ${networkParam} \
        --out-file ${filePath} \
        ${signingParams}`;
};

export async function transactionWitnessCommand(
  options: TransactionWitnessOptions,
  cliPath: string,
  networkParam: string
): Promise<string> {
  const UID = uuid();
  if (!options.signingKey && !options.scriptFile) {
    throw new Error(
      'script-file or signing-key required for transaction witness command'
    );
  }
  let signingParams = '';
  if (options.scriptFile) {
    signingParams += `--script-file ${options.scriptFile} `;
  }
  if (options.signingKey) {
    signingParams += `--signing-key-file ${options.signingKey}`;
  }
  const filePath = `tmp/tx_${UID}.witness`;
  await exec(
    buildCommand(cliPath, networkParam, options.txBody, filePath, signingParams)
  );

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
