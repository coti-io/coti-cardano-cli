import { deleteFile, exec } from '../helpers';
import { CalculateMinFeeOptions, ProtocolParams } from '../interfaces';
import { promises as fs } from 'fs';

export interface CalculateFeeParams {
  cliPath: string;
  networkParam: string;
  address: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  protocolParametersPath: string,
  options: CalculateMinFeeOptions,
  txBodyFilePath: string
): string => {
  return `${cliPath} transaction calculate-min-fee \
                      --tx-body-file ${txBodyFilePath} \
                      --tx-in-count ${options.txIn} \
                      --tx-out-count ${options.txOut} \
                      ${networkParam} \
                      --witness-count ${options.witnessCount} \
                      --protocol-params-file ${protocolParametersPath}`;
};

export async function calculateFeesCommand(
  options: CalculateMinFeeOptions,
  cliPath: string,
  networkParam: string,
  protocolParams: ProtocolParams
): Promise<string> {
  const protocolParametersPath = 'tmp/protocol-parameters.json';
  const txBodyFilePath = 'tmp/tx-body.json';

  await fs.writeFile(protocolParametersPath, JSON.stringify(protocolParams));
  await fs.writeFile(txBodyFilePath, JSON.stringify(options.txBody), 'utf8');

  const command = buildCommand(
    cliPath,
    networkParam,
    protocolParametersPath,
    options,
    txBodyFilePath
  );

  const stdout = await exec(command);

  await deleteFile(protocolParametersPath);
  await deleteFile(txBodyFilePath);

  return stdout.toString().replace(/\s+/g, ' ').split(' ')[0];
}
