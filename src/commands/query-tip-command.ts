import { exec } from '../helpers';
import { Tip } from '../interfaces';
import { NullableApi } from '../cardano-cli';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export interface QueryTimParamsParams {
  cliPath: string;
  networkParam: string;
}

const buildCommand = (cliPath: string, networkParam: string): string => {
  return `${cliPath} query tip \
          ${networkParam} \
          --cardano-mode
                          `;
};

export async function queryTipCommand(
  options: QueryTimParamsParams,
  api?: NullableApi
): Promise<Tip> {
  const command = buildCommand(options.cliPath, options.networkParam);
  const stdout = await exec(command);

  return JSON.parse(stdout) as Tip;
}
