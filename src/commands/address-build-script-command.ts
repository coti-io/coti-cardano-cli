import { deleteFile, exec } from '../helpers';
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
  networkParam: string,
  scriptPath: string
): string => {
  return `${cliPath} address build-script --script-file ${scriptPath} ${networkParam}`;
};

export async function addressBuildScriptCommand(
  options: AddressBuildScriptParams
): Promise<string> {
  const UID = uuid();
  const scriptPath = `tmp/script_${UID}.json`;
  await fs.writeFile(scriptPath, JSON.stringify(options.script));
  await exec(
    buildCommand(options.cliPath, UID, options.networkParam, scriptPath)
  );

  const fileContent = await fs.readFile(scriptPath);
  await deleteFile(scriptPath);

  return fileContent.toString().replace(/\s+/g, ' ');
}
