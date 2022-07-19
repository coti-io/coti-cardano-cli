import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

import {
  Account,
  AddressBuildOptions,
  AddressInfo,
  CalculateMinFeeOptions,
  ConstructorOptions,
  Pool,
  ProtocolParams,
  SignedTransaction,
  StakeAddressInfo,
  StakePoolRegistrationOptions,
  Tip,
  Transaction,
  TransactionAssembleOptions,
  TransactionSignOptions,
  TransactionViewOptions,
  TransactionWitnessOptions,
  TxOut,
  Utxo,
} from './interfaces';
import mainnetShelleyGenesis from './genesis-files/mainnet-shelley-genesis.json';
import testnetShelleyGenesis from './genesis-files/testnet-shelley-genesis.json';
import { JSONValue, Network } from './types';
import {
  addressKeyGenCommand,
  AddressKeyGenRes,
} from './commands/address-key-gen-command';
import { queryUTXOCommand } from './commands/query-utxo-command';
import { queryTipCommand } from './commands/query-tip-command';
import { queryProtocolParamsCommand } from './commands/query-protocol-params-command';
import { buildRawTxCommand } from './commands/build-raw-tx-command';
import { buildAddressCommand } from './commands/build-address-command';
import { buildAddressKeyHashCommand } from './commands/address-key-hash-command';
import { addressInfoCommand } from './commands/address-info-command';
import { addressBuildScriptCommand } from './commands/address-build-script-command';
import { transactionBuildCommand } from './commands/transaction-build-command';
import { calculateFeesCommand } from './commands/calculate-min-fee-comand';
import { transactionPolicyidCommand } from './commands/transaction-policy-command';
import { transactionHashScriptDataCommand } from './commands/transaction-hash-script-command';
import { transactionWitnessCommand } from './commands/transaction-witness-command';
import { transactionSignCommand } from './commands/transaction-sign-command';
import { transactionAssembleCommand } from './commands/transaction-assemble-command';
import { transactionCalculateMinValueCommand } from './commands/transaction-calculate-min-value-command';
import { transactionCalculateMinRequiredUtxoCommand } from './commands/transaction-calculate-min-required-command';
import { transactionIdCommand } from './commands/transaction-id-command';
import { transactionSubmitCommand } from './commands/transaction-submit-command';
import { transactionViewCommand } from './commands/transaction-view-command';
import { queryStakeCommand } from './commands/query-stakes-command';
import { stakeAddressKeyGenCommand } from './commands/stake-address-key-gen-command';
import { stakeAddressBuildCommand } from './commands/stake-address-build-command';
import { stakePoolIdCommand } from './commands/stake-pool-id-command';
import { poolCommand } from './commands/pool-command';
import { stakeAddressRegistrationCommand } from './commands/stake-address-registration-command';
import { stakeAddressDeregistrationCommand } from './commands/stake-address-deregistration-command';
import { stakeAddressDelegationCommand } from './commands/stake-address-delegation-command';
import { stakeAddressKeyHashCommand } from './commands/stake-address-key-hash-command';
import { nodeKeyGenKesCommand } from './commands/node-key-gen-kes-command';
import { nodeKeyGenCommand } from './commands/node-key-gen-command';
import { nodeIssueOpCertCommand } from './commands/node-issue-op-cert-command';
import { nodeKeyGenVrfCommand } from './commands/node-key-gen-vrf-command';
import { nodeNewCounterCommand } from './commands/node-new-counter-command';
import { stakePoolMetadaCommand } from './commands/stake-pool-metadata-command';
import { stakePoolRegistrationCommand } from './commands/stake-pool-registration-command';
import { stakePoolDeregistrationCommand } from './commands/stake-pool-deregistration-command';
import { queryAddressUtxo } from './helpers';

export type NullableApi = BlockFrostAPI | null;

export class CardanoCli {
  era = '';
  network: Network = 'mainnet';
  cliPath = 'cardano-cli';
  networkParam = '';
  shelleyGenesis: { slotsPerKESPeriod?: number } = {};
  testnetMagic = '1097911063';
  protocolParametersPath = '';
  api: NullableApi = null;

  constructor(options: ConstructorOptions) {
    if (options) {
      options.socketPath &&
        (process.env['CARDANO_NODE_SOCKET_PATH'] = options.socketPath);
      options.era && (this.era = '--' + options.era + '-era');
      options.network && (this.network = options.network);
      options.cliPath && (this.cliPath = options.cliPath);
      options.testnetMagic && (this.testnetMagic = options.testnetMagic);
      this.buildShelleyGenesisOptions(options.shelleyGenesisPath || '');
      this.networkParam =
        this.network === 'mainnet'
          ? '--mainnet'
          : `--testnet-magic ${options.testnetMagic || ''}`;
    }
    const tempDir = './tmp';
    if (!existsSync(tempDir)) execSync(`mkdir -p ${tempDir}`);
    if (options.blockfrostApiKey) {
      this.api = new BlockFrostAPI({ projectId: options.blockfrostApiKey });
    }
  }

  buildShelleyGenesisOptions(shelleyGenesisPath: string): void {
    if (shelleyGenesisPath) {
      this.shelleyGenesis = JSON.parse(
        readFileSync(shelleyGenesisPath).toString()
      );
    } else {
      if (this.network === 'mainnet') {
        this.shelleyGenesis = mainnetShelleyGenesis;
      } else {
        this.shelleyGenesis = testnetShelleyGenesis;
      }
    }
  }

  async queryTip(): Promise<Tip> {
    if (this.api) {
      const tip = await this.api.blocksLatest();
      if (tip.epoch && tip.slot && tip.height) {
        return {
          epoch: tip.epoch,
          block: tip.height,
          slot: tip.slot,
          era: this.era,
          hash: tip.hash,
          syncProgress: '100',
        };
      }
    }
    return queryTipCommand({
      cliPath: this.cliPath,
      networkParam: this.networkParam,
    });
  }

  async queryProtocolParameters(): Promise<ProtocolParams> {
    if (this.api) {
      const latestEpoch = await this.api.epochsLatest();

      const protocolParams = await this.api.epochsParameters(latestEpoch.epoch);
      return {
        txFeePerByte: protocolParams.min_fee_a,
        txFeeFixed: protocolParams.min_fee_b,
        minUTxOValue: Number(protocolParams.min_utxo),
        stakePoolDeposit: Number(protocolParams.pool_deposit),
        decentralization: protocolParams.decentralisation_param,
        poolRetireMaxEpoch: 1,
        extraPraosEntropy: protocolParams.extra_entropy,
        stakePoolTargetNum: 1,
        maxBlockBodySize: protocolParams.max_block_size,
        maxTxSize: protocolParams.max_tx_size,
        treasuryCut: 1,
        minPoolCost: 1,
        maxBlockHeaderSize: protocolParams.max_block_header_size,
        protocolVersion: {
          minor: protocolParams.protocol_minor_ver,
          major: protocolParams.protocol_major_ver,
        },
        stakeAddressDeposit: 1,
        monetaryExpansion: 1,
        poolPledgeInfluence: 1,
      };
    }
    return queryProtocolParamsCommand({
      cliPath: this.cliPath,
      networkParam: this.networkParam,
    });
  }

  async queryUtxo(address: string): Promise<Utxo[]> {
    if (this.api) {
      return queryAddressUtxo(this.api, address);
    }
    return queryUTXOCommand({
      address,
      networkParam: this.networkParam,
      cliPath: this.cliPath,
    });
  }

  async addressKeyGen(): Promise<AddressKeyGenRes> {
    return addressKeyGenCommand({ cliPath: this.cliPath });
  }

  async transactionBuildRaw(options: Transaction): Promise<JSONValue> {
    const tip = await this.queryTip();
    const protocolParams = await this.queryProtocolParameters();
    return buildRawTxCommand({
      cliPath: this.cliPath,
      networkParam: this.networkParam,
      transaction: options,
      era: this.era,
      tip,
      protocolParams,
    });
  }

  async addressBuild(
    account: string,
    options: AddressBuildOptions
  ): Promise<string> {
    return buildAddressCommand(
      options,
      account,
      this.cliPath,
      this.networkParam
    );
  }

  async addressKeyHash(account: string): Promise<string> {
    return buildAddressKeyHashCommand({
      cliPath: this.cliPath,
      account,
    });
  }

  async addressInfo(address: string): Promise<AddressInfo> {
    return addressInfoCommand({ cliPath: this.cliPath, address });
  }

  async addressBuildScript(script: JSONValue): Promise<string> {
    return addressBuildScriptCommand({
      cliPath: this.cliPath,
      networkParam: this.networkParam,
      script,
    });
  }

  async transactionBuild(options: Transaction): Promise<JSONValue> {
    const tip = await this.queryTip();
    const protocolParams = await this.queryProtocolParameters();
    return transactionBuildCommand({
      cliPath: this.cliPath,
      networkParam: this.networkParam,
      era: this.era,
      transaction: options,
      tip,
      protocolParams,
    });
  }

  async transactionCalculateMinFee(
    options: CalculateMinFeeOptions
  ): Promise<string> {
    const protocolParams = await this.queryProtocolParameters();
    return calculateFeesCommand(
      options,
      this.cliPath,
      this.networkParam,
      protocolParams
    );
  }
  async transactionPolicyid(script: JSONValue): Promise<string> {
    return transactionPolicyidCommand({ cliPath: this.cliPath, script });
  }

  async transactionHashScriptData(script: JSONValue): Promise<string> {
    return transactionHashScriptDataCommand({
      cliPath: this.cliPath,
      script,
    });
  }

  async transactionSign(
    options: TransactionSignOptions
  ): Promise<SignedTransaction> {
    return transactionSignCommand(options, this.cliPath, this.networkParam);
  }

  async transactionWitness(
    options: TransactionWitnessOptions
  ): Promise<string> {
    return transactionWitnessCommand(options, this.cliPath, this.networkParam);
  }
  async transactionAssemble(
    options: TransactionAssembleOptions
  ): Promise<string> {
    return transactionAssembleCommand({ options, cliPath: this.cliPath });
  }

  async transactionCalculateMinValue(options: TxOut): Promise<string> {
    const protocolParameters = await this.queryProtocolParameters();
    return transactionCalculateMinValueCommand({
      txOut: options,
      cliPath: this.cliPath,
      networkParam: this.protocolParametersPath,
      protocolParameters,
    });
  }
  async transactionCalculateMinRequiredUtxo(
    address: string,
    value: TxOut
  ): Promise<string> {
    const protocolParameters = await this.queryProtocolParameters();
    return transactionCalculateMinRequiredUtxoCommand({
      cliPath: this.cliPath,
      address,
      value,
      networkParam: this.networkParam,
      protocolParameters,
    });
  }
  async transactionSubmit(tx: string): Promise<string> {
    if (this.api) {
      return this.api.txSubmit(tx);
    }
    return transactionSubmitCommand({
      cliPath: this.cliPath,
      tx,
      networkParam: this.networkParam,
    });
  }
  async transactionTxid(options: TransactionViewOptions): Promise<string> {
    return transactionIdCommand({ cliPath: this.cliPath, options });
  }

  async transactionView(options: TransactionViewOptions): Promise<string> {
    return transactionViewCommand({ options, cliPath: this.cliPath });
  }

  async queryStakeAddressInfo(address: string): Promise<StakeAddressInfo[]> {
    return queryStakeCommand({
      cliPath: this.cliPath,
      address,
      network: this.network,
    });
  }
  async stakeAddressKeyGen(account: string): Promise<Account> {
    return stakeAddressKeyGenCommand({ account, cliPath: this.cliPath });
  }
  async stakeAddressBuild(account: string): Promise<string> {
    return stakeAddressBuildCommand({
      account,
      cliPath: this.cliPath,
      network: this.network,
    });
  }

  async KESPeriod(): Promise<number> {
    if (!this.shelleyGenesis) throw new Error('shelleyGenesisPath required');
    const tip = await this.queryTip();
    return tip.slot / (this.shelleyGenesis.slotsPerKESPeriod as number);
  }

  async pool(poolName: string): Promise<Pool> {
    return poolCommand({ cliPath: this.cliPath, poolName });
  }

  async stakePoolId(poolName: string): Promise<string> {
    return stakePoolIdCommand({ cliPath: this.cliPath, poolName });
  }

  async stakeAddressRegistrationCertificate(
    account: string
  ): Promise<JSONValue> {
    return stakeAddressRegistrationCommand({
      cliPath: this.cliPath,
      account,
    });
  }

  async stakeAddressDeregistrationCertificate(
    account: string
  ): Promise<JSONValue> {
    return stakeAddressDeregistrationCommand({
      cliPath: this.cliPath,
      account,
    });
  }

  async stakeAddressDelegationCertificate(
    account: string,
    poolId: string
  ): Promise<JSONValue> {
    return stakeAddressDelegationCommand({
      cliPath: this.cliPath,
      account,
      poolId,
    });
  }

  async stakeAddressKeyHash(account: string): Promise<string> {
    return stakeAddressKeyHashCommand({ cliPath: this.cliPath, account });
  }

  async nodeKeyGenKES(poolName: string): Promise<Account> {
    return nodeKeyGenKesCommand({ cliPath: this.cliPath, poolName });
  }

  async nodeKeyGen(poolName: string, counter: string): Promise<Account> {
    return nodeKeyGenCommand({ cliPath: this.cliPath, poolName, counter });
  }
  async nodeIssueOpCert(
    poolName: string,
    counter: string,
    kesPeriod: number
  ): Promise<JSONValue> {
    const kesPeriodFinal = kesPeriod ? kesPeriod : await this.KESPeriod();
    return nodeIssueOpCertCommand({
      cliPath: this.cliPath,
      poolName,
      kesPeriod: kesPeriodFinal,
      counter,
    });
  }
  async nodeKeyGenVRF(poolName: string): Promise<Account> {
    return nodeKeyGenVrfCommand({ cliPath: this.cliPath, poolName });
  }
  async nodeNewCounter(poolName: string, counter: string): Promise<string> {
    return nodeNewCounterCommand({
      cliPath: this.cliPath,
      poolName,
      counter,
    });
  }

  async stakePoolMetadataHash(metadata: string): Promise<string> {
    return stakePoolMetadaCommand({ cliPath: this.cliPath, metadata });
  }

  async stakePoolRegistrationCertificate(
    poolName: string,
    account: string,
    options: StakePoolRegistrationOptions
  ): Promise<JSONValue> {
    return stakePoolRegistrationCommand({
      cliPath: this.cliPath,
      poolName,
      options,
      network: this.network,
      account,
    });
  }

  async stakePoolDeregistrationCertificate(
    poolName: string,
    epoch: number
  ): Promise<JSONValue> {
    return stakePoolDeregistrationCommand({
      cliPath: this.cliPath,
      poolName,
      epoch,
    });
  }
}
