import {
  auxScriptToString,
  buildRandomFilePath,
  certToString,
  deleteFile,
  exec,
  jsonToPath,
  mintToString,
  readFile,
  txInToString,
  txOutToString,
  withdrawalToString,
} from '../helpers';
import { ProtocolParams, Tip, Transaction } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';
import { JSONValue } from '../types';

export interface BuildTransactionParams {
  cliPath: string;
  networkParam: string;
  transaction: Transaction;
  era: string;
  tip: Tip;
  protocolParams: ProtocolParams;
}

interface ValidateTransaction {
  txInString: string;
  txOutString: string;
  txInCollateralString: string;
  changeAddressString: string;
  mintString: string;
  withdrawals: string;
  certs: string;
  metadata: string;
  auxScript: string;
  scriptInvalid: string;
  witnessOverride: string;
}

const buildCommand = (options: {
  cliPath: string;
  transaction: ValidateTransaction;
  networkParam: string;
  originTransaction: Transaction;
  slot: number;
  protocolParametersPath: string;
  filePath: string;
  changeAddressString: string;
  era: string;
}): string => {
  const {
    cliPath,
    transaction,
    networkParam,
    originTransaction,
    slot,
    protocolParametersPath,
    filePath,
    changeAddressString,
    era,
  } = options;
  return `${cliPath} transaction build \
                ${transaction.txInString} \
                ${transaction.txOutString} \
                ${transaction.txInCollateralString} \
                ${transaction.certs} \
                ${transaction.withdrawals} \
                ${transaction.mintString} \
                ${transaction.auxScript} \
                ${transaction.metadata} \
                ${transaction.scriptInvalid} \
                ${transaction.witnessOverride} \
                --invalid-hereafter ${
                  originTransaction.invalidAfter
                    ? originTransaction.invalidAfter
                    : slot + 10000
                } \
                --invalid-before ${
                  originTransaction.invalidBefore
                    ? originTransaction.invalidBefore
                    : 0
                } \
                --out-file ${filePath} \
                ${changeAddressString} \
                ${networkParam} \
                --protocol-params-file ${protocolParametersPath} \
                ${era}`;
};

export async function transactionBuildCommand(
  options: BuildTransactionParams
): Promise<JSONValue> {
  const { transaction, cliPath, networkParam, era, tip, protocolParams } =
    options;
  const slot = tip.slot;
  if (!(transaction && transaction.txIn && transaction.txOut))
    return Promise.reject('TxIn and TxOut required');
  const UID = uuid();
  const txInString = await txInToString(transaction.txIn);
  const txOutString = txOutToString(transaction.txOut);
  const txInCollateralString = transaction.txInCollateral
    ? await txInToString(transaction.txInCollateral, true)
    : '';
  const changeAddressString = transaction.changeAddress
    ? `--change-address ${transaction.changeAddress || ''}`
    : '';
  const mintString = transaction.mint ? mintToString(transaction.mint) : '';
  const withdrawals = transaction.withdrawals
    ? await withdrawalToString(transaction.withdrawals)
    : '';
  const certs = transaction.certs ? await certToString(transaction.certs) : '';
  const metadata = transaction.metadata
    ? '--metadata-json-file ' +
      (await jsonToPath(transaction.metadata, 'metadata'))
    : '';
  const auxScript = transaction.auxScript
    ? await auxScriptToString(transaction.auxScript)
    : '';
  const scriptInvalid = transaction.scriptInvalid ? '--script-invalid' : '';
  const witnessOverride = transaction.witnessOverride
    ? `--witness-override ${transaction.witnessOverride}`
    : '';

  const protocolParametersPath =
    'tmp/protocolParametersPath/protocol-parameters.json';
  await fs.writeFile(protocolParametersPath, JSON.stringify(protocolParams), {
    flag: 'wx',
  });

  const filePath = `tmp/tx_${UID}.raw`;

  const txData: ValidateTransaction = {
    txInString,
    txOutString,
    txInCollateralString,
    changeAddressString,
    mintString,
    withdrawals,
    certs,
    metadata,
    auxScript,
    scriptInvalid,
    witnessOverride,
  };

  await exec(
    buildCommand({
      transaction: txData,
      originTransaction: transaction,
      cliPath,
      networkParam,
      slot,
      filePath,
      protocolParametersPath:
        'tmp/protocolParametersPath/protocol-parameters.json',
      changeAddressString,
      era,
    })
  );

  const fileContent = await readFile(filePath);

  await deleteFile(filePath);
  await deleteFile(protocolParametersPath);

  return fileContent;
}
