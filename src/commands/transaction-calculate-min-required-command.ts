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
  era: string;
}

const buildCommand = (
  cliPath: string,
  address: string,
  multiAsset: string,
  protocolParametersPath: string,
  era: string
): string => {
  return `${cliPath} transaction calculate-min-required-utxo \
                ${era}   
                --tx-out ${address}+${multiAsset} \
                --protocol-params-file ${protocolParametersPath}
                `;
};

export async function transactionCalculateMinRequiredUtxoCommand(
  options: TransactionCalculateMinRequiredParams
): Promise<string> {
  const { protocolParameters, era } = options;
  const UUID = uuid();
  const protocolParametersPath = `tmp/protocol-parameters-${UUID}.json`;
  await fs.writeFile(
    protocolParametersPath,
    JSON.stringify(protocolParameters)
  );
  const multiAsset = multiAssetToString(options.value);

  const stdout = await exec(
    buildCommand(
      options.cliPath,
      options.address,
      multiAsset,
      protocolParametersPath,
      era
    )
  );

  await deleteFile(protocolParametersPath);

  return stdout.replace(/\s+/g, ' ').split(' ')[1];
}
