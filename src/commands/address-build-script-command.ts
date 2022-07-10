import { exec } from '../helpers';
import { uuid } from 'uuidv4';
import { promises as fs } from 'fs';
import { JSONValue } from '../types';

export interface AddressBuildScriptParams {
  cliPath: string;
  script: JSONValue;
  networkParam: string;
}

const buildCommand = (
  cliPath: string,
  UID: string,
  networkParam: string
): string => {
  return `${cliPath} address build-script --script-file tmp/script_${UID}.json ${networkParam}`;
};

export async function addressBuildScriptCommand(
  options: AddressBuildScriptParams
): Promise<string> {
  const UID = uuid();
  await fs.writeFile(`tmp/script_${UID}.json`, JSON.stringify(options.script));
  const stdout = await exec(
    buildCommand(options.cliPath, UID, options.networkParam)
  );

  return stdout.toString().replace(/\s+/g, ' ');
}
