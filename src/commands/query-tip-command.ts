import { exec, readFile } from '../helpers';
import { Tip } from '../interfaces';
import { promises as fs } from 'fs';
import { uuid } from 'uuidv4';

export interface QueryTimParamsParams {
  cliPath: string;
  networkParam: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  filePath: string
): string => {
  return `${cliPath} query tip \
          ${networkParam} \
          --cardano-mode \
          --out-file ${filePath}              
            `;
};

export async function queryTipCommand(
  options: QueryTimParamsParams
): Promise<Tip> {
  const UID = uuid();
  const protocolParametersPath = `tmp/${UID}.protocolparams`;
  const command = buildCommand(
    options.cliPath,
    options.networkParam,
    protocolParametersPath
  );
  await exec(command);

  const fileContent = await readFile(protocolParametersPath);

  return JSON.parse(fileContent) as Tip;
}
