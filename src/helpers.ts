import { constants, existsSync, promises as fs } from 'fs';
import { exec as cpExec } from 'child_process';
import util from 'util';
import { uuid } from 'uuidv4';
import {
  Mint,
  ProtocolParams,
  TxIn,
  TxOut,
  Utxo,
  Withdrawal,
} from './interfaces';
import { JSONValue } from './types';
import Big from 'big.js';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const pexec = util.promisify(cpExec);

export const buildRandomFilePath = () => {
  return `./tmp/${uuid()}`;
};
export const exec = async (command: string): Promise<string> => {
  const { stdout, stderr } = await pexec(command);
  if (stderr) return Promise.reject(stderr);
  return stdout;
};

export const readJsonFile = async (filePath: string): Promise<JSONValue> => {
  const jsonFileContent = await fs.readFile(filePath);
  let fileContent: JSONValue;
  try {
    fileContent = JSON.parse(jsonFileContent.toString());
  } catch (error) {
    return Promise.reject(error);
  }
  return fileContent;
};
export const readFile = async (filePath: string): Promise<string> => {
  const jsonFileContent = await fs.readFile(filePath);
  let fileContent: string;
  try {
    fileContent = jsonFileContent.toString();
  } catch (error) {
    return Promise.reject(error);
  }
  return fileContent;
};

export const deleteFile = async (filePath: string): Promise<void> => {
  await fs.unlink(filePath);
};

export const ownerToString = (ownerList: string[]): string => {
  let result = '';
  ownerList.forEach(
    (owner: string) =>
      (result += `--pool-owner-stake-verification-key-file ${owner} `)
  );
  return result;
};

export const relayToString = (
  relayList: {
    host?: string;
    ip?: string;
    port: string;
    multiHost?: string;
  }[]
): string => {
  let result = '';
  relayList.forEach(relay => {
    if (!((relay.host || relay.ip) && relay.port) && !relay.multiHost)
      throw new Error('Relay is missing arguments');
    if (relay.host) {
      result += `--single-host-pool-relay ${relay.host} --pool-relay-port ${relay.port} `;
    } else if (relay.ip) {
      result += `--pool-relay-ipv4 ${relay.ip} --pool-relay-port ${relay.port} `;
    } else if (relay.multiHost) {
      result += `--multi-host-pool-relay ${relay.multiHost} `;
    }
  });
  return result;
};

export const certToString = async (
  certList: {
    cert: string;
    script: JSONValue;
    datum: JSONValue;
    redeemer: JSONValue;
    executionUnits: string[];
  }[]
): Promise<string> => {
  let result = '';
  for (const cert of certList) {
    result += `--certificate ${cert.cert} ${
      cert.script
        ? `--certificate-script-file ${await jsonToPath(cert.script)} `
        : ''
    } ${
      cert.datum
        ? `--certificate-script-datum-value '${JSON.stringify(cert.datum)}' `
        : ''
    } ${
      cert.redeemer
        ? `--certificate-script-redeemer-value '${JSON.stringify(
            cert.redeemer
          )}' `
        : ''
    } ${
      cert.executionUnits && cert.executionUnits[0] && cert.executionUnits[1]
        ? `--certificate-execution-units "(${
            cert.executionUnits[0] + ',' + cert.executionUnits[1]
          })" `
        : ''
    }`;
  }
  return result;
};

export const withdrawalToString = async (
  withdrawalList: Withdrawal[]
): Promise<string> => {
  let result = '';
  for (const withdrawal of withdrawalList) {
    result += `--withdrawal ${withdrawal.stakingAddress}+${withdrawal.reward} ${
      withdrawal.script
        ? `--withdrawal-script-file ${await jsonToPath(withdrawal.script)} `
        : ''
    } ${
      withdrawal.datum
        ? `--withdrawal-script-datum-value '${JSON.stringify(
            withdrawal.datum
          )}' `
        : ''
    } ${
      withdrawal.redeemer
        ? `--withdrawal-script-redeemer-value '${JSON.stringify(
            withdrawal.redeemer
          )}' `
        : ''
    } ${
      withdrawal.executionUnits &&
      withdrawal.executionUnits[0] &&
      withdrawal.executionUnits[1]
        ? `--withdrawal-execution-units "(${
            withdrawal.executionUnits[0] + ',' + withdrawal.executionUnits[1]
          })" `
        : ''
    }`;
  }
  return result;
};

export const auxScriptToString = async (
  scriptList: JSONValue[]
): Promise<string> => {
  const promises = [];
  for (const script of scriptList) {
    promises.push(jsonToPath(script));
  }
  const scriptFilesPathes = await Promise.all(promises);
  return scriptFilesPathes
    .map(scriptFilePath => `--auxiliary-script-file ${scriptFilePath}`)
    .join(' ');
};

export const jsonToPath = async (
  json: JSONValue,
  type = 'script'
): Promise<string> => {
  const scriptUID = uuid();
  const filePath = `/tmp/${type}_${scriptUID}.json`;
  await fs.writeFile(filePath, JSON.stringify(json));
  // TODO: release the file
  return filePath;
};

export const txInToString = async (
  txInList: TxIn[],
  isCollateral = false
): Promise<string> => {
  let result = '';
  for (const txIn of txInList) {
    result += `--tx-in${isCollateral ? '-collateral' : ''} ${txIn.txHash}#${
      txIn.txId
    } ${
      txIn.script ? `--tx-in-script-file ${await jsonToPath(txIn.script)} ` : ''
    } ${
      txIn.datum ? `--tx-in-datum-value '${JSON.stringify(txIn.datum)}' ` : ''
    } ${
      txIn.redeemer
        ? `--tx-in-redeemer-value '${JSON.stringify(txIn.redeemer)}' `
        : ''
    } ${
      txIn.executionUnits && txIn.executionUnits[0] && txIn.executionUnits[1]
        ? `--tx-in-execution-units "(${
            txIn.executionUnits[0] + ',' + txIn.executionUnits[1]
          })" `
        : ''
    }`;
  }
  return result;
};

export const txOutToString = (txOutList: TxOut[]): string => {
  let result = '';
  let assetOutStr = '';
  txOutList.forEach(txOut => {
    assetOutStr = '';
    result += ` --tx-out ${txOut.address}+${txOut.value.lovelace}`;
    Object.keys(txOut.value).forEach(asset => {
      if (asset == 'lovelace') return;
      assetOutStr += `+${txOut.value[asset]} ${asset}`;
    });
    if (assetOutStr) result += `+"${assetOutStr.slice(1)}"`;
    txOut.datumHash && (result += ` --tx-out-datum-hash ${txOut.datumHash}`);
  });
  return result;
};

export const signingKeysToString = (signingKeys: string[]): string => {
  let result = '';
  signingKeys.forEach(
    signingKey => (result += `--signing-key-file ${signingKey} `)
  );
  return result;
};

export const witnessFilesToString = (witnessFiles: string[]): string => {
  let result = '';
  witnessFiles.forEach(
    witnessFile => (result += `--witness-file ${witnessFile} `)
  );
  return result;
};

export const setKeys = (
  obj: { [key: string]: JSONValue },
  path: string,
  value: string
): void => {
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem: string = pList[i];
    if (!obj[elem]) obj[elem] = {};
    obj = obj[elem] as any;
  }

  obj[pList[len - 1]] = value;
};

export const fileExists = async (files: string[]): Promise<void> => {
  for (const file of files) {
    if (existsSync(file))
      return Promise.reject(
        `File ${file} already exists. Remove it manually if you want to create a new file.`
      );
  }
};

export const mintToString = (minting: Mint[]): string => {
  let result = '--mint="';
  minting.forEach((mint, index, arr) => {
    if (
      !(
        (mint.quantity || mint.asset) &&
        (mint.action == 'mint' || mint.action == 'burn')
      )
    )
      throw new Error('action, asset and quantity property required');
    if (Object.is(arr.length - 1, index)) {
      result += `${mint.action == 'mint' ? '' : '-'}${mint.quantity} ${
        mint.asset
      }`;
    } else {
      result += `${mint.action == 'mint' ? '' : '-'}${mint.quantity} ${
        mint.asset
      }+`;
    }
  });
  result = result.trim();
  result += '" ';
  const usedScripts: string[] = [];
  result += minting
    .map(async mint => {
      const script = await jsonToPath(mint.script);
      if (usedScripts.includes(script)) return '';
      usedScripts.push(script);
      return `--mint-script-file ${script} ${
        mint.redeemer
          ? `--mint-redeemer-value '${JSON.stringify(mint.redeemer)}' `
          : ''
      } ${
        mint.executionUnits
          ? `--mint-execution-units "(${
              mint.executionUnits[0] + ',' + mint.executionUnits[1]
            })" `
          : ''
      }`;
    })
    .join(' ');
  return result;
};

export const multiAssetToString = (options: {
  address: string;
  value: { [key: string]: string };
}): string => {
  let result = `"${options.address} + `;
  result += `${options.value.lovelace}`;
  Object.keys(options.value).forEach(asset => {
    if (asset == 'lovelace') return;
    result += `+${options.value[asset]} ${asset}`;
  });
  result += '"';
  return result;
};

export const checkFileExists = (file: string): Promise<boolean> => {
  return fs
    .access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

export function toLovelace(ada: string): string {
  const lovelace = new Big(ada).mul('1e6');
  return lovelace.toFixed();
}
export function toAda(lovelace: string): string {
  const ada = new Big(lovelace).mul('1e-6');
  return ada.toFixed();
}

export async function queryAddressUtxo(
  api: BlockFrostAPI,
  address: string
): Promise<Utxo[]> {
  try {
    const utxos = await api.addressesUtxosAll(address);
    return utxos.map(utxo => ({
      txHash: utxo.tx_hash,
      txId: utxo.tx_index,
      value: utxo.amount[0],
      datumHash: utxo.data_hash || '',
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}
