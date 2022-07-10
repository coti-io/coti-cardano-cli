import { exec } from '../helpers';

export interface StakeAddressKeyHashParams {
  cliPath: string;
  account: string;
}

const buildCommand = (cliPath: string, account: string): string => {
  return `${cliPath} stake-address key-hash \
                        --staking-verification-key-file tmp/priv/wallet/${account}/${account}.stake.vkey \
                    `;
};

export async function stakeAddressKeyHashCommand(
  options: StakeAddressKeyHashParams
): Promise<string> {
  const { cliPath, account } = options;
  const stdout = await exec(buildCommand(cliPath, account));

  return stdout.toString().trim();
}
