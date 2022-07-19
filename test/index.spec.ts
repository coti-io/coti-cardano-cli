import { CardanoCli, ProtocolParams, Tip, Transaction, Utxo } from '../src';
import { AddressKeyGenRes } from '../src/commands/address-key-gen-command';

describe('Cardano cli test with blockfrost', () => {
  jest.setTimeout(50000);
  let cardanoCliInstance: CardanoCli;
  beforeAll(() => {
    cardanoCliInstance = new CardanoCli({
      blockfrostApiKey: 'testneth3doUix8STTY7wQ4CIy6uf5unIzp1Sv3',
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

  it('Build rawTx', async () => {
    const buildRawTransactionRequest: Transaction = {
      txIn: [
        {
          txHash:
            'd42e86749031c724b380b70ba2e0f16fbf8c7c9618fb6f712dc9f1ffa84a4b79',
          txId: '1',
        },
      ],
      txOut: [
        {
          address:
            'addr_test1qr3pzzn4yhsgtxfj55y0wwlumnxllsumv8a98wst6sh4z6p4g663hkrkp8plfjl3epmegfedayyghgtpkmn2c9df3ddsa47p0d',
          value: { lovelace: '100000000' },
          datumHash: '',
        },

        {
          address:
            'addr_test1qr3pzzn4yhsgtxfj55y0wwlumnxllsumv8a98wst6sh4z6p4g663hkrkp8plfjl3epmegfedayyghgtpkmn2c9df3ddsa47p0d',
          value: { lovelace: '798000000' },
          datumHash: '',
        },
      ],
      fee: 1000000,
      invalidAfter: 1000,
    };

    const rawTx = await cardanoCliInstance.transactionBuildRaw(
      buildRawTransactionRequest
    );
    expect(rawTx).toBeDefined();
  });
});
