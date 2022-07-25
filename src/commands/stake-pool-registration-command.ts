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
import { uuid } from 'uuidv4';

export interface StakePoolRegistrationParams {
  cliPath: string;
  network: string;
  options: StakePoolRegistrationOptions;
}

const buildCommand = (
  cliPath: string,
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
): Promise<string> {
  const { cliPath, options, network } = input;
  const UID = uuid();

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

  const nodeVkeyPath = `tmp/${UID}.node.vkey`;
  const vrfVkeyPath = `tmp/${UID}.stake.vkey`;

  const nodeVkey = await stakePoolIdCommand({ cliPath });
  const stakeVkey = await stakeAddressKeyGenCommand({
    cliPath,
  });

  await fs.writeFile(nodeVkeyPath, nodeVkey);
  await fs.writeFile(vrfVkeyPath, stakeVkey);

  const filePath = `tmp/${UID}.pool.cert`;
  await exec(
    buildCommand(
      cliPath,
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
