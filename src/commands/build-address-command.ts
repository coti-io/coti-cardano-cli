import { deleteFile, exec, jsonToPath, readFile } from '../helpers';
import { AddressBuildOptions } from '../interfaces';

export interface BuildAddressCommand {
  cliPath: string;
  networkParam: string;
  paymentVkey: string;
  stakeVkey: string;
  paymentScript: string;
  stakeScript: string;
  account: string;
  filePath: string;
}

const buildCommand = (options: BuildAddressCommand): string => {
  return `${options.cliPath} address build \
                    ${options.paymentVkey} \
                    ${options.stakeVkey} \
                    ${options.paymentScript} \
                    ${options.stakeScript} \
                    --out-file ${options.filePath} \
                    ${options.networkParam}
                `;
};

export async function buildAddressCommand(
  options: AddressBuildOptions,
  account: string,
  cliPath: string,
  networkParam: string
): Promise<string> {
  const paymentVkey = options.paymentVkey
    ? `--payment-verification-key-file ${options.paymentVkey}`
    : '';
  const stakeVkey = options.stakeVkey
    ? `--staking-verification-key-file ${options.stakeVkey}`
    : '';
  const paymentScript = options.paymentScript
    ? `--payment-script-file ${await jsonToPath(options.paymentScript)}`
    : '';
  const stakeScript = options.stakeScript
    ? `--stake-script-file ${await jsonToPath(options.stakeScript)}`
    : '';

  const filePath = `tmp/priv/wallet/${account}/${account}.payment.addr`;

  const commandInput = {
    cliPath: cliPath,
    networkParam: networkParam,
    paymentVkey: paymentVkey,
    stakeVkey: stakeVkey,
    paymentScript: paymentScript,
    stakeScript: stakeScript,
    account,
    filePath,
  };

  await exec(buildCommand(commandInput));

  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
