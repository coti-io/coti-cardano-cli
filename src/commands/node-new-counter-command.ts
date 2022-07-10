import { exec } from '../helpers';

export interface NodeNewCounterParams {
  cliPath: string;
  poolName: string;
  counter: string;
}

const buildCommand = (
  cliPath: string,
  poolName: string,
  counter: string
): string => {
  return `${cliPath} node new-counter \
                        --cold-verification-key-file tmp/priv/pool/${poolName}/${poolName}.node.vkey \
                        --counter-value ${counter} \
                        --operational-certificate-issue-counter-file tmp/priv/pool/${poolName}/${poolName}.node.counter
                    `;
};

export async function nodeNewCounterCommand(
  options: NodeNewCounterParams
): Promise<string> {
  const { cliPath, poolName, counter } = options;
  await exec(`mkdir -p tmp/priv/pool/${poolName}`);
  await exec(buildCommand(cliPath, poolName, counter));
  return `tmp/priv/pool/${poolName}/${poolName}.node.counter`;
}
