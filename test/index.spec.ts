import { CardanoCli, ProtocolParams, Tip, Utxo } from '../src';
import { AddressKeyGenRes } from '../src/commands/address-key-gen-command';

describe('Cardano cli test with blockfrost', () => {
  let cardanoCliInstance: CardanoCli;
  beforeAll(() => {
    cardanoCliInstance = new CardanoCli({
      blockfrostApiKey: '<API_KEY>',
    });
  });

  it('Query tip', async () => {
    const tip: Tip = await cardanoCliInstance.queryTip();
    expect(tip).toBeDefined();
  });

  it('Query protocol parameters', async () => {
    const protocolParameters: ProtocolParams =
      await cardanoCliInstance.queryProtocolParameters();
    expect(protocolParameters).toBeDefined();
  });

  it('Query address utxos', async () => {
    const address =
      'addr_test1wzqpaq7vjn87ytud4k3p8ds9mmhzexdzvltyaqmp5jnq5pccup954';
    const utxos: Utxo[] = await cardanoCliInstance.queryUtxo(address);
    expect(utxos).toBeDefined();
  });

  it('Get address key-gen command', async () => {
    const keyGen: AddressKeyGenRes = await cardanoCliInstance.addressKeyGen();
    expect(keyGen).toBeDefined();
  });
});
