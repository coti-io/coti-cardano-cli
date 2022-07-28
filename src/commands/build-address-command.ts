import { deleteFile, exec, readFile } from '../helpers';
import { AddressBuildOptions } from '../interfaces';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';

export interface BuildAddressCommand {
  cliPath: string;
  networkParam: string;
  paymentVkey: string | undefined;
  paymentScript: string | undefined;
  stakeVkey: string | undefined;
  stakeScript: string | undefined;
  filePath: string;
}

const buildCommand = (options: BuildAddressCommand): string => {
  return `${options.cliPath} address build
                    ${
                      options.paymentVkey
                        ? `--payment-verification-key '${options.paymentVkey}'`
                        : ''
                    }
                    ${
                      options.paymentScript
                        ? ` --payment-script-file ${options.paymentScript}`
                        : ''
                    }
                    ${
                      options.stakeVkey
                        ? `--stake-verification-key '${options.stakeVkey}'`
                        : ''
                    }
                    ${
                      options.stakeScript
                        ? `--stake-script-file ${options.stakeScript}`
                        : ''
                    }
                    --out-file ${options.filePath}
                    ${options.networkParam}
                `.replace(/\n/g, " ");;
};

export async function buildAddressCommand(
  options: AddressBuildOptions,
  cliPath: string,
  networkParam: string
): Promise<string> {
  const UID = uuid();
  let paymentVkey = '';
  let stakeVkey = '';
  let paymentScriptPath = '';
  let stakeScriptPath = '';

  if(options.paymentVkey) {
    paymentVkey = JSON.stringify(JSON.parse(options.paymentVkey));
  }
  if(options.stakeVkey) {
    stakeVkey = JSON.stringify(JSON.parse(options.stakeVkey));
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
    paymentVkey,
    paymentScript: paymentScriptPath,
    stakeVkey,
    stakeScript: stakeScriptPath,
    filePath,
  };
  const command = buildCommand(commandInput)
  await exec(buildCommand(commandInput));

  if (paymentScriptPath !== '') await deleteFile(paymentScriptPath);
  if (stakeScriptPath !== '') await deleteFile(stakeScriptPath);

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
