import { deleteFile, exec, readFile } from '../helpers';
import { Utxo } from '../interfaces';
import { uuid } from 'uuidv4';

export interface QueryUtxoParamsParams {
  cliPath: string;
  networkParam: string;
  address: string;
}

const buildCommand = (
  cliPath: string,
  networkParam: string,
  address: string,
  filePath: string
): string => {
  return `${cliPath} query utxo \
            ${networkParam} \
            --address ${address} \
            --cardano-mode
            --out-file ${filePath}
            `;
};

export async function queryUTXOCommand(
  options: QueryUtxoParamsParams
): Promise<Utxo[]> {
  const UID = uuid();
  const utxosPath = `tmp/${UID}.utxos`;
  const command = buildCommand(
    options.cliPath,
    options.networkParam,
    options.address,
    utxosPath
  );
  await exec(command);

  const fileContent = await readFile(utxosPath);
  await deleteFile(utxosPath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const utxos = fileContent.split('\n');
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
