import { deleteFile, exec, multiAssetToString, readFile } from '../helpers';
import { ProtocolParams, TxOut } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface TransactionCalculateMinRequiredParams {
  cliPath: string;
  address: string;
  value: TxOut;
  networkParam: string;
  protocolParameters: ProtocolParams;
}

const buildCommand = (
  cliPath: string,
  address: string,
  multiAsset: string,
  protocolParametersPath: string
): string => {
  return `${cliPath} transaction calculate-min-required-utxo \
                --babbage-era \
                --tx-out ${address}+${multiAsset} \
                --protocol-params-file ${protocolParametersPath}`;
};

export async function transactionCalculateMinRequiredUtxoCommand(
  options: TransactionCalculateMinRequiredParams
): Promise<string> {
  const { protocolParameters } = options;
  const UUID = uuid();
  const protocolParametersPath = `tmp/protocol-parameters-${UUID}.json`;
  await fs.writeFile(
    protocolParametersPath,
    JSON.stringify(protocolParameters)
  );
  const multiAsset = multiAssetToString(options.value);

  await exec(
    buildCommand(
      options.cliPath,
      options.address,
      multiAsset,
      protocolParametersPath
    )
  );

  const fileContent = await readFile(protocolParametersPath);
  await deleteFile(protocolParametersPath);

  return fileContent.replace(/\s+/g, ' ').split(' ')[1];
}
