import {
  auxScriptToString,
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

export interface BuildRawTxParams {
  cliPath: string;
  networkParam: string;
  transaction: Transaction;
  era: string;
  tip: Tip;
  protocolParams: ProtocolParams;
}

const buildCommand = (
  options: BuildRawTxParams,
  commandInput: {
    txInString: string;
    txOutString: string;
    txInCollateralString: string;
    mintString: string;
    withdrawals: string;
    certs: string;
    fee: number;
    invalidBefore: number;
    invalidAfter: number;
    metadata: string;
    auxScript: string;
    scriptInvalid: string;
    rawFilePath: string;
    protocolParametersPath: string;
    slot: number;
  }
): string => {
  const { transaction, cliPath, era } = options;
  return `${cliPath} transaction build-raw \
                ${commandInput.txInString} \
                ${commandInput.txOutString} \
                ${commandInput.txInCollateralString} \
                ${commandInput.certs} \
                ${commandInput.withdrawals} \
                ${commandInput.mintString} \
                ${commandInput.auxScript} \
                ${commandInput.metadata} \
                ${commandInput.scriptInvalid} \
                --invalid-hereafter ${
                  commandInput.invalidAfter
                    ? commandInput.invalidAfter
                    : commandInput.slot + 10000
                } \
                --invalid-before ${
                  commandInput.invalidBefore
                    ? commandInput.invalidBefore
                    : commandInput.slot
                } \
                --fee ${transaction.fee ? transaction.fee : 0} \
                --out-file ${commandInput.rawFilePath} \
                --protocol-params-file ${commandInput.protocolParametersPath} \
                ${era}`;
};

export async function buildRawTxCommand(
  options: BuildRawTxParams
): Promise<JSONValue> {
  const { transaction, tip, protocolParams } = options;
  const { fee, invalidAfter, invalidBefore } = transaction;
  const slot = tip.slot;
  if (!(transaction && transaction.txIn && transaction.txOut))
    return Promise.reject('TxIn and TxOut required');
  const fileUuid = uuid();
  const txInString = await txInToString(transaction.txIn);
  const txOutString = txOutToString(transaction.txOut);
  const txInCollateralString = transaction.txInCollateral
    ? await txInToString(transaction.txInCollateral, true)
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

  const protocolParametersPath = `tmp/protocol-parameters-${fileUuid}.json`;
  await fs.writeFile(protocolParametersPath, JSON.stringify(protocolParams), {
    flag: 'wx',
  });

  const rawFilePath = `tmp/tx_${fileUuid}.raw`;
  const scriptInvalid = transaction.scriptInvalid ? '--script-invalid' : '';

  const commandInput = {
    txInString,
    txOutString,
    txInCollateralString,
    mintString,
    withdrawals,
    certs,
    metadata,
    auxScript,
    protocolParams,
    invalidAfter: invalidAfter || 0,
    invalidBefore: invalidBefore || 0,
    scriptInvalid,
    rawFilePath,
    protocolParametersPath,
    slot,
    fee: fee || 0,
  };
  await exec(buildCommand(options, commandInput));

  const fileContent = await readFile(rawFilePath);

  await deleteFile(protocolParametersPath);
  await deleteFile(rawFilePath);

  return fileContent;
}
