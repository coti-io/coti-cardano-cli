import { exec } from '../helpers';
import { StakeAddressInfo } from '../interfaces';

export interface QueryStakesParams {
  cliPath: string;
  address: string;
  network: string;
}

const buildCommand = (
  cliPath: string,
  network: string,
  address: string
): string => {
  return `${cliPath} query stake-address-info \
        ${network} \
        --address ${address}
        `;
};

export async function queryStakeCommand(
  options: QueryStakesParams
): Promise<StakeAddressInfo[]> {
  const { cliPath, address, network } = options;
  const stakeAddressInfo = await exec(buildCommand(cliPath, network, address));
  return JSON.parse(stakeAddressInfo) as StakeAddressInfo[];
}
