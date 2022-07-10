import { exec } from '../helpers';
import { Utxo } from '../interfaces';

export interface QueryUtxoParamsParams {
  cliPath: string;
  networkParam: string;
  address: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  address: string
): string => {
  return `${cliPath} query utxo \
            ${networkParam} \
            --address ${address} \
            --cardano-mode
            `;
};

export async function queryUTXOCommand(
  options: QueryUtxoParamsParams
): Promise<Utxo[]> {
  const command = buildCommand(
    options.cliPath,
    options.networkParam,
    options.address
  );
  const stdout = await exec(command);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const utxos = stdout.split('\n');
  utxos.splice(0, 1);
  utxos.splice(0, 1);
  utxos.splice(utxos.length - 1, 1);
  return utxos.map((raw: string) => {
    const utxo = raw.replace(/\s+/g, ' ').split(' ');
    const txHash = utxo[0];
    const txId = parseInt(utxo[1]);
    const valueList = utxo.slice(2, utxo.length).join(' ').split('+');
    const value: { [key: string]: string } = {};
    let datumHash = '';
    valueList.forEach(v => {
      if (v.includes('TxOutDatumHash') || v.includes('TxOutDatumNone')) {
        if (!v.includes('None')) datumHash = JSON.parse(v.trim().split(' ')[2]);
        return;
      }
      const [quantity, asset] = v.trim().split(' ');
      value[asset] = quantity;
    });
    const utxoData: Utxo = { txHash, txId, value };
    if (datumHash) utxoData.datumHash = datumHash;

    return utxoData;
  });
}
