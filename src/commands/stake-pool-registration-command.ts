import {
  deleteFile,
  exec,
  ownerToString,
  readFile,
  relayToString,
} from '../helpers';
import { StakePoolRegistrationOptions } from '../interfaces';
import { JSONValue } from '../types';
import { stakePoolIdCommand } from './stake-pool-id-command';
import { stakeAddressKeyGenCommand } from './stake-address-key-gen-command';
import { promises as fs } from 'fs';

export interface StakePoolRegistrationParams {
  cliPath: string;
  poolName: string;
  network: string;
  account: string;
  options: StakePoolRegistrationOptions;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  options: StakePoolRegistrationOptions,
  owners: string,
  relays: string,
  network: string,
  filePath: string,
  nodeVkeyPath: string,
  vrfVkeyPath: string
): string => {
  return `${cliPath} stake-pool registration-certificate \
                --cold-verification-key-file ${nodeVkeyPath} \
                --vrf-verification-key-file ${vrfVkeyPath} \
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
  const { cliPath, poolName, options, network, account } = input;

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

  const nodeVkeyPath = `tmp/${poolName}.node.vkey`;
  const vrfVkeyPath = `tmp/${poolName}.stake.vkey`;

  const nodeVkey = await stakePoolIdCommand({ cliPath, poolName });
  const stakeVkey = await stakeAddressKeyGenCommand({
    cliPath,
    account,
  });

  await fs.writeFile(nodeVkeyPath, nodeVkey);
  await fs.writeFile(vrfVkeyPath, stakeVkey);

  const filePath = `tmp/${poolName}.pool.cert`;
  await exec(
    buildCommand(
      cliPath,
      poolName,
      options,
      owners,
      relays,
      network,
      filePath,
      nodeVkeyPath,
      vrfVkeyPath
    )
  );

  const fileContent = readFile(filePath);

  await deleteFile(filePath);
  await deleteFile(nodeVkeyPath);
  await deleteFile(vrfVkeyPath);

  return fileContent;
}
