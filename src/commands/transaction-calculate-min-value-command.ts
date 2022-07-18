import { deleteFile, exec, multiAssetToString, readFile } from '../helpers';
import { ProtocolParams, TxOut } from '../interfaces';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface TransactionCalculateMinValueParams {
  cliPath: string;
  txOut: TxOut;
  protocolParameters: ProtocolParams;
  networkParam: string;
}

const buildCommand = (
  txOut: TxOut,
  multiAsset: string,
  cliPath: string,
  protocolParametersPath: string
): string => {
  return `${cliPath} transaction calculate-min-required-utxo \
                --tx-out ${multiAsset} \
                --protocol-params-file ${protocolParametersPath}`;
};

export async function transactionCalculateMinValueCommand(
  input: TransactionCalculateMinValueParams
): Promise<string> {
  const { protocolParameters } = input;
  const UID = uuid();
  const protocolParametersPath = `tmp/protocolParameters_${UID}.json`;
  await fs.writeFile(
    protocolParametersPath,
    JSON.stringify(protocolParameters)
  );
  const multiAsset = multiAssetToString(input.txOut);

  await exec(
    buildCommand(input.txOut, multiAsset, input.cliPath, protocolParametersPath)
  );

  const fileContent = await readFile(protocolParametersPath);
  await deleteFile(protocolParametersPath);

  return fileContent.replace(/\s+/g, ' ').split(' ')[1];
}
