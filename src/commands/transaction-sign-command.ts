import {
  deleteFile,
  exec,
  readJsonFile,
  signingKeysToString,
} from '../helpers';
import { SignedTransaction, TransactionSignOptions } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

const buildCommand = (
  cliPath: string,
  signingKey: string,
  filePath: string,
  networkParam: string,
  txBodyFilePath: string
): string => {
  return `${cliPath} transaction sign \
        --tx-body-file ${txBodyFilePath} \
        ${signingKey} \
        ${networkParam} \
        --out-file ${filePath}`;
};

export async function transactionSignCommand(
  options: TransactionSignOptions,
  cliPath: string,
  networkParam: string
): Promise<SignedTransaction> {
  const { txBody } = options;
  const signingKeysPaths = [];
  const UID = uuid();
  const txBodyFilePath = `tmp/tx-body-${UID}.json`;
  await fs.writeFile(txBodyFilePath, txBody);
  for (let i = 0; i < options.signingKeys.length; i++) {
    const signingKey = `tmp/signingKeys-${i}.json`;
    signingKeysPaths.push(signingKey);
    await fs.writeFile(signingKey, options.signingKeys[i]);
  }

  const signingKeys = signingKeysToString(signingKeysPaths);
  const filePath = `tmp/tx_${UID}.signed`;
  await exec(
    buildCommand(cliPath, signingKeys, filePath, networkParam, txBodyFilePath)
  );

  // @ts-ignore
  const fileContent: SignedTransaction = (await readJsonFile(
    filePath
  )) as SignedTransaction;
  const promisesArr = [];
  for (const signFilePath of signingKeysPaths) {
    promisesArr.push(deleteFile(signFilePath));
  }
  promisesArr.push(deleteFile(filePath));
  Promise.all(promisesArr).catch(err => {
    console.error(err);
  });

  return fileContent;
}
