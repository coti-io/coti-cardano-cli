import { deleteFile, exec } from '../helpers';
import { ProtocolParams } from '../interfaces';

export interface QueryProtocolParams {
  cliPath: string;
  networkParam: string;
  filePath?: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  filePath: string
): string => {
  return `${cliPath} query protocol-parameters \
                            ${networkParam} \
                            --cardano-mode \
                            --out-file ${filePath}
                        `;
};

export async function queryProtocolParamsCommand(
  options: QueryProtocolParams
): Promise<ProtocolParams> {
  const filePath = 'tmp/protocol-parameters.json';
  const command = buildCommand(options.cliPath, options.networkParam, filePath);
  const stdout = await exec(command);

  await deleteFile(filePath);

  return JSON.parse(stdout) as ProtocolParams;
}
