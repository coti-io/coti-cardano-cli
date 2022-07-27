import { JSONValue, Network, TestnetMagic } from './types';

export interface ConstructorOptions {
  shelleyGenesisPath?: string;
  socketPath?: string;
  cliPath?: string;
  dir?: string;
  era?: Eras;
  network?: Network;
  httpProvider?: string;
  testnetMagic?: TestnetMagic;
  blockfrostApiKey: string;
}

export interface ProtocolParams {
  txFeePerByte: number;
  minUTxOValue: number;
  stakePoolDeposit: number;
  decentralization: number;
  poolRetireMaxEpoch: number;
  extraPraosEntropy: any;
  stakePoolTargetNum: number;
  maxBlockBodySize: number;
  maxTxSize: number;
  treasuryCut: number;
  minPoolCost: number;
  maxBlockHeaderSize: number;
  protocolVersion: {
    minor: number;
    major: number;
  };
  txFeeFixed: number;
  stakeAddressDeposit: number;
  monetaryExpansion: number;
  poolPledgeInfluence: number;
}

export interface AddressBuildOptions {
  paymentVkey?: string;
  paymentVkeyFilePath?: string;
  paymentScript?: string;
  stakeVkey?: string;
  stakeVkeyFilePath?: string;
  stakeScript?: string;
}

export interface StakePoolRegistrationOptions {
  pledge: number;
  margin: number;
  cost: number;
  url: string;
  metaHash: string;
  rewardAccount: string;
  owners: string[];
  relays: any[];
}

export interface CalculateMinFeeOptions {
  txBody: CborTransaction;
  txIn: number;
  txOut: number;
  witnessCount: number;
}

export interface TransactionSignOptions {
  signingKeys: string[];
  txBody: string;
}

export interface TransactionWitnessOptions {
  txBody: string;
  signingKey: string;
  address: string;
}

export interface TransactionAssembleOptions {
  txBody: string;
  witnessFiles: string[];
}

export interface TransactionViewOptions {
  txBody?: string;
  txFile?: string;
}

export interface Transaction {
  txIn: TxIn[];
  txOut: TxOut[];
  txInCollateral?: TxInCollateral[];
  withdrawals?: Withdrawal[];
  certs?: Certificate[];
  fee?: number;
  mint?: Mint[];
  auxScript?: any;
  metadata?: any;
  invalidBefore?: number;
  invalidAfter?: number;
  scriptInvalid?: boolean;
  changeAddress?: string;
  witnessOverride?: string;
}

export class Metadata {
  [key: number]: {
    int?: number;
    string?: string;
    bytes?: string;
    list?: {
      int?: number;
      string?: string;
    }[];
    map?: {
      k: Metadata;
      v: Metadata;
    }[];
  };
}

export interface Tip {
  epoch: number;
  hash: string;
  slot: number;
  block: number;
  era: string;
  syncProgress: string;
}

export interface CborTransaction {
  type: string;
  description: string;
  cborHex: string;
}

export interface SignedTransaction {
  txHash: string;
  signedCborTransaction: CborTransaction;
}

export interface VerificationKey {
  type: string;
  description: string;
  cborHex: string;
}

export interface SecretKey {
  type: string;
  description: string;
  cborHex: string;
}

export interface Wallet {
  name: string;
  paymentAddr: string;
  stakingAddr: string;
  balance: () => Promise<{
    utxo: Utxo[];
    value: any;
  }>;
  reward: () => Promise<StakeAddressInfo>;
}

export interface Pool {
  id: string;
}

export interface StakeAddressInfo {
  address: string;
  rewardAccountBalance: number;
  delegation: string;
}

export interface AddressInfo {
  address: string;
  era: string;
  encoding: string;
  type: string;
  base16: string;
}

export interface TxIn extends TxInCollateral {
  script?: JSONValue;
  datum?: JSONValue;
  redeemer?: JSONValue;
  executionUnits?: string[];
}

export interface TxOut {
  address: string;
  value: { [key: string]: string };
  datumHash: string;
  referenceScript: string;
}

export interface TxInCollateral {
  txHash: string;
  txId: string;
}

export interface Withdrawal {
  stakingAddress: string;
  reward: number;
  script: JSONValue;
  datum: JSONValue;
  redeemer: JSONValue;
  executionUnits: string[];
}

export interface Certificate {
  cert: string;
  script: JSONValue;
  datum: JSONValue;
  redeemer: JSONValue;
  executionUnits: string[];
}

export interface Mint {
  action: string;
  quantity: string;
  asset: string;
  script: JSONValue;
  datum: JSONValue;
  redeemer: JSONValue;
  executionUnits: string[];
}

export interface Utxo {
  txHash: string;
  txId: number;
  value: { [key: string]: string };
  datumHash?: string;
}

export interface Account {
  vkey: string;
  skey: string;
  counter?: string;
}

export enum Eras {
  'BYRON' = 'byron',
  'SHELLEY' = 'shelley',
  'ALLEGRA' = 'allegra',
  'MARY' = 'mary',
  'ALONZO' = 'alonzo',
  'BABBAGE' = 'babbage',
}
