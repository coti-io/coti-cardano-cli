import {
  buildRandomFilePath,
  deleteFile,
  exec,
  ownerToString,
  readFile,
  relayToString,
} from '../helpers';
import { StakePoolRegistrationOptions } from '../interfaces';
import { JSONValue } from "../types";

export interface StakePoolRegistrationParams {
  cliPath: string;
  poolName: string;
  network: string;
  options: StakePoolRegistrationOptions;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  options: StakePoolRegistrationOptions,
  owners: string,
  relays: string,
  network: string,
  filePath: string
): string => {
  return `${cliPath} stake-pool registration-certificate \
                --cold-verification-key-file tmp/priv/pool/${poolName}/${poolName}.node.vkey \
                --vrf-verification-key-file tmp/priv/pool/${poolName}/${poolName}.vrf.vkey \
                --pool-pledge ${options.pledge} \
                --pool-cost ${options.cost} \
                --pool-margin ${options.margin} \
                --pool-reward-account-verification-key-file ${options.rewardAccount} \
                ${owners} \
                ${relays} \
                --${network} \
                --metadata-url ${options.url} \
                --metadata-hash ${options.metaHash} \
                --out-file ${filePath}
            `;
};

export async function stakePoolRegistrationCommand(
  input: StakePoolRegistrationParams
): Promise<JSONValue> {
  const { cliPath, poolName, options, network } = input;

  if (
    !(
      options &&
      options.pledge &&
      options.margin &&
      options.cost &&
      options.url &&
      options.metaHash &&
      options.rewardAccount &&
      options.owners &&
      options.relays
    )
  )
    return Promise.reject('All options are required');

  const owners = ownerToString(options.owners);
  const relays = relayToString(options.relays);

  const filePath = `tmp/priv/pool/${poolName}/${poolName}.pool.cert`;
  await exec(
    buildCommand(cliPath, poolName, options, owners, relays, network, filePath)
  );

  const fileContent = readFile(filePath);

  await deleteFile(filePath);

  return fileContent;
}
