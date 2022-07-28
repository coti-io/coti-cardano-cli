import { deleteFile, exec, readFile } from '../helpers';
import { AddressBuildOptions } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface BuildAddressCommand {
  cliPath: string;
  networkParam: string;
  paymentVkey: string;
  paymentVkeyPath: string;
  paymentScript: string;
  stakeVkey: string;
  stakeVkeyPath: string;
  stakeScript: string;
  filePath: string;
}

const buildCommand = (options: BuildAddressCommand): string => {
  return `${options.cliPath} address build \
                    ${
                      options.paymentVkeyPath
                        ? `--payment-verification-key-file ${options.paymentVkeyPath}`
                        : ''
                    } \
                    ${
                      options.paymentVkey
                        ? `--payment-verification-key ${options.paymentVkey}`
                        : ''
                    } \
                    ${
                      options.paymentScript
                        ? `--payment-script-file ${options.paymentScript}`
                        : ''
                    } \
                    ${
                      options.stakeVkey
                        ? `--stake-verification-key ${options.stakeVkey}`
                        : ''
                    } \
                    ${
                      options.stakeVkeyPath
                        ? `--stake-verification-key-file ${options.stakeVkeyPath}`
                        : ''
                    } \
                    ${
                      options.stakeScript
                        ? `--stake-script-file ${options.stakeScript}`
                        : ''
                    } \
                    --out-file ${options.filePath} \
                    ${options.networkParam}
                `;
};

export async function buildAddressCommand(
  options: AddressBuildOptions,
  cliPath: string,
  networkParam: string
): Promise<string> {
  const UID = uuid();
  let paymentVkeyPath = '';
  let stakeVkeyPath = '';
  let paymentScriptPath = '';
  let stakeScriptPath = '';

  if (options.paymentVkey) {
    paymentVkeyPath = `tmp/${UID}.payment.vkey`;
    await fs.writeFile(paymentVkeyPath, options.paymentVkey);
  }
  if (options.stakeVkey) {
    stakeVkeyPath = `tmp/${UID}.stake.vkey`;
    await fs.writeFile(stakeVkeyPath, options.stakeVkey);
  }
  if (options.paymentScript) {
    paymentScriptPath = `tmp/${UID}.payment.vkey`;
    await fs.writeFile(paymentScriptPath, options.paymentScript);
  }
  if (options.stakeScript) {
    stakeScriptPath = `tmp/${UID}.payment.vkey`;
    await fs.writeFile(stakeScriptPath, options.stakeScript);
  }

  const filePath = `tmp/${UID}.payment.addr`;

  const commandInput = {
    cliPath: cliPath,
    networkParam: networkParam,
    paymentVkey: paymentVkeyPath,
    paymentVkeyPath: options.paymentVkeyFilePath || '',
    paymentScript: paymentScriptPath,
    stakeVkey: stakeVkeyPath,
    stakeVkeyPath: options.stakeVkeyFilePath || '',
    stakeScript: stakeScriptPath,
    filePath,
  };

  await exec(buildCommand(commandInput));

  if (paymentVkeyPath !== '') await deleteFile(paymentVkeyPath);
  if (stakeVkeyPath !== '') await deleteFile(stakeVkeyPath);
  if (paymentScriptPath !== '') await deleteFile(paymentScriptPath);
  if (stakeScriptPath !== '') await deleteFile(stakeScriptPath);

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
