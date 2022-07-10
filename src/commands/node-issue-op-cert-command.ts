import { buildRandomFilePath, deleteFile, exec, readFile } from '../helpers';
import { JSONValue } from "../types";

export interface NodeIssueOpCertParams {
  cliPath: string;
  poolName: string;
  kesPeriod: number;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  kesPeriod: number,
  filePath: string
): string => {
  return `${cliPath} node issue-op-cert \
                        --kes-verification-key-file tmp/priv/pool/${poolName}/${poolName}.kes.vkey \
                        --cold-signing-key-file tmp/priv/pool/${poolName}/${poolName}.node.skey \
                        --operational-certificate-issue-counter tmp/priv/pool/${poolName}/${poolName}.node.counter \
                        --kes-period ${kesPeriod} \
                        --out-file ${filePath}
                    `;
};

export async function nodeIssueOpCertCommand(
  options: NodeIssueOpCertParams
): Promise<JSONValue> {
  const { cliPath, poolName, kesPeriod } = options;
  const filePath = `tmp/priv/pool/${poolName}/${poolName}.node.cert`;
  await exec(buildCommand(cliPath, poolName, kesPeriod, filePath));
  const fileContent = await readFile(filePath);
  await deleteFile(filePath);

  return fileContent;
}
