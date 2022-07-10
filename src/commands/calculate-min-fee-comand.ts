import { exec } from '../helpers';
import { CalculateMinFeeOptions } from '../interfaces';

export interface CalculateFeeParams {
  cliPath: string;
  networkParam: string;
  protocolParametersPath: string;
  address: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  protocolParametersPath: string,
  options: CalculateMinFeeOptions
): string => {
  return `${cliPath} transaction calculate-min-fee \
                      --tx-body-file ${options.txBody} \
                      --tx-in-count ${options.txIn.length} \
                      --tx-out-count ${options.txOut.length} \
                      ${networkParam} \
                      --witness-count ${options.witnessCount} \
                      --protocol-params-file ${protocolParametersPath}`;
};

export async function calculateFeesCommand(
  options: CalculateMinFeeOptions,
  cliPath: string,
  networkParam: string,
  protocolParametersPath: string
): Promise<string> {
  const command = buildCommand(
    cliPath,
    networkParam,
    protocolParametersPath,
    options
  );
  const stdout = await exec(command);

  return stdout.toString().replace(/\s+/g, ' ').split(' ')[0];
}
