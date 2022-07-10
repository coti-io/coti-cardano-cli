import { buildRandomFilePath, setKeys } from '../helpers';
import { StakeAddressInfo, Wallet } from '../interfaces';
import { promises as fs } from 'fs';
import Big from 'big.js';
import { queryUTXOCommand } from './query-utxo-command';
import { queryStakeCommand } from './query-stakes-command';

export interface WalletParams {
  cliPath: string;
  account: string;
  networkParam: string;
  network: string;
}

export async function walletCommand(options: WalletParams): Promise<Wallet> {
  const { account, cliPath, networkParam, network } = options;
  const paymentAddr = 'No payment keys generated';
  const stakingAddr = 'No staking keys generated';

  await fs.readFile(`tmp/priv/wallet/${account}/${account}.payment.addr`);

  await fs.readFile(`tmp/priv/wallet/${account}/${account}.stake.addr`);

  const files = await fs.readdir(`tmp/priv/wallet/${account}`);
  const keysPath = {};
  files.forEach(file => {
    const name = file.split('.')[1] + '.' + file.split('.')[2];
    setKeys(keysPath, name, `tmp/priv/wallet/${account}/${file}`);
  });

  const balance = async () => {
    const utxos = await queryUTXOCommand({
      address: paymentAddr,
      cliPath,
      networkParam,
    });
    const value: { [key: string]: string } = {};
    utxos.forEach(utxo => {
      Object.keys(utxo.value).forEach(asset => {
        if (!value[asset]) value[asset] = '0';
        value[asset] = new Big(utxo.value[asset]).add(value[asset]).toFixed();
      });
    });

    return { utxo: utxos, value };
  };
  const reward = async (): Promise<StakeAddressInfo> => {
    const stakingAddressInfoArray = await queryStakeCommand({
      cliPath,
      address: paymentAddr,
      network,
    });
    const stakingAddressInfo = stakingAddressInfoArray.find(
      delegation => delegation.address == stakingAddr
    );
    if (!stakingAddressInfo)
      return Promise.reject('Staking key is not registered');
    return stakingAddressInfo;
  };

  return {
    name: account,
    paymentAddr,
    stakingAddr,
    balance,
    reward,
    ...keysPath,
  };
}
