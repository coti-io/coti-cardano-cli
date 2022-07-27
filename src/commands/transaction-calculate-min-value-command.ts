import { deleteFile, exec, multiAssetToString, readFile } from '../helpers';
import { ProtocolParams, TxOut } from '../interfaces';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface TransactionCalculateMinValueParams {
  cliPath: string;
  txOut: TxOut;
  protocolParameters: ProtocolParams;
  networkParam: string;
  era: string;
}

const buildCommand = (
  txOut: TxOut,
  multiAsset: string,
  cliPath: string,
  protocolParametersPath: string,
  era: string,
  txOutDatumHash: string,
  txOutReferenceScript: string
): string => {
  return `${cliPath} transaction calculate-min-required-utxo \
                ${era}
                --tx-out ${multiAsset} \
                --protocol-params-file ${protocolParametersPath} \
                --tx-out-datum-hash ${txOutDatumHash}
                --tx-out-reference-script-file ${txOutReferenceScript}
`;
};

export async function transactionCalculateMinValueCommand(
  input: TransactionCalculateMinValueParams
): Promise<string> {
  const { protocolParameters, era, txOut } = input;
  const { datumHash, referenceScript } = txOut;
  const UID = uuid();
  const protocolParametersPath = `tmp/protocolParameters_${UID}.json`;
  const txDatumHashPath = `tmp/protocolParameters_${UID}.json`;
  const txOutReferenceScriptPath = `tmp/protocolParameters_${UID}.json`;
  await fs.writeFile(
    protocolParametersPath,
    JSON.stringify(protocolParameters)
  );
  await fs.writeFile(txDatumHashPath, datumHash);
  await fs.writeFile(txOutReferenceScriptPath, referenceScript);
  const multiAsset = multiAssetToString(input.txOut);

  const stdout = await exec(
    buildCommand(
      input.txOut,
      multiAsset,
      input.cliPath,
      protocolParametersPath,
      era,
      txDatumHashPath,
      txOutReferenceScriptPath
    )
  );

  await deleteFile(protocolParametersPath);
  await deleteFile(txDatumHashPath);
  await deleteFile(txOutReferenceScriptPath);

  return stdout.replace(/\s+/g, ' ').split(' ')[1];
}
