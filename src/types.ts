export type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type Network = 'mainnet' | 'testnet';

export type TestnetMagic = string;
