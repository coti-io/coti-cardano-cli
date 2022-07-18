# Coti cardano-cli 

> A package to run cardano-cli commands from nodejs, if you hold a blockfrost API-KEY you could add 
> while  creating a cardano-cli instance and get the data directly from there.



---

# my-package-name

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

> My awesome module

## Install

```bash
npm install @coti-io/cardano-cli
```

## Usage

```ts
import { CardanoCli } from '@coti-io/cardano-cli';
const options: ConstructorOptions = {
    network: 'testnet',
    testnetMagic: '1097911063',
    blockfrostApiKey: '<API_KEY>'
};
const cardanoCli = new CardanoCli(options);

cardanoCli.queryTip()
    .then( tip => console.log(tip))
    .catch(error => console.log(error));

cardanoCli.queryProtocolParameters()
  .then( protocolParameters => console.log(protocolParameters))
  .catch(error => console.log(error));

// Build raw transaction
const buildRawTransactionRequest = {
  "txsIn": [
    {
      "txHash": "d42e86749031c724b380b70ba2e0f16fbf8c7c9618fb6f712dc9f1ffa84a4b79",
      "utxoIndex": 1
    }
  ],
  "txsOut": [
    {
      "address": "addr_test1qr3pzzn4yhsgtxfj55y0wwlumnxllsumv8a98wst6sh4z6p4g663hkrkp8plfjl3epmegfedayyghgtpkmn2c9df3ddsa47p0d",
      "amount": 100000000
    },

    {
      "address": "addr_test1qr3pzzn4yhsgtxfj55y0wwlumnxllsumv8a98wst6sh4z6p4g663hkrkp8plfjl3epmegfedayyghgtpkmn2c9df3ddsa47p0d",
      "amount": 798000000
    }
  ],
  "hereAfter": 63700063,
  "fee": 1000000
}

cardanoCli.transactionBuildRaw(buildRawTransactionRequest).then(rawTx => {
  console.log(rawTx);
}).catch(error => {
  console.log(error)
})

const signTransactionRequest = {
  "rawTransaction": {
    "type": "TxBodyBabbage",
    "description": "",
    "cborHex": "86a50081825820d42e86749031c724b380b70ba2e0f16fbf8c7c9618fb6f712dc9f1ffa84a4b79010182a200583900e2110a7525e0859932a508f73bfcdccdffc39b61fa53ba0bd42f51683546b51bd87609c3f4cbf1c87794272de9088ba161b6e6ac15a98b5b011a05f5e100a200583900e2110a7525e0859932a508f73bfcdccdffc39b61fa53ba0bd42f51683546b51bd87609c3f4cbf1c87794272de9088ba161b6e6ac15a98b5b011a2f908380021a000f4240031a03cbfc5f081a03cbf8bf9fff8080f5f6"
  },
  "paymentKeys": [
    {
      "type": "PaymentExtendedSigningKeyShelley_ed25519_bip32",
      "description": "",
      "cborHex": "5880307ff29b79629af045af5d71030e80b3765cee4fc144cd5e600b5b76a6f052579581f605479dfb8dd80566f139899b4487092ee03c0ab0c4902b9f7a832a8b55aee7603774f340ac6c59ab628a5e98b169641aa1a4b4c74ad43347d383fb77324a295865b519b718a91a4b7f561edd45d2092cb62320556416ec63b92f110b90"
    }
  ]
}

cardanoCli.transactionSign(signTransactionRequest).then(signTx => {
  console.log(signTx);
}).catch(error => {
  console.log(error)
})

const submitTransactionRequest = {
  "signedTransaction": {
    "type": "Tx BabbageEra",
    "description": "",
    "cborHex": "84a50081825820d42e86749031c724b380b70ba2e0f16fbf8c7c9618fb6f712dc9f1ffa84a4b79010182a200583900e2110a7525e0859932a508f73bfcdccdffc39b61fa53ba0bd42f51683546b51bd87609c3f4cbf1c87794272de9088ba161b6e6ac15a98b5b011a05f5e100a200583900e2110a7525e0859932a508f73bfcdccdffc39b61fa53ba0bd42f51683546b51bd87609c3f4cbf1c87794272de9088ba161b6e6ac15a98b5b011a2f908380021a000f4240031a03cbfc5f081a03cbf8bfa10081825820aee7603774f340ac6c59ab628a5e98b169641aa1a4b4c74ad43347d383fb7732584060f569bdc3b5a4b89125066be820386b77c17c2a89983aa0a17454232177f5b78c4c7678e08e7a67193c92c6c43936b1f6415688311d9528b804743674981f0cf5f6"
  }
}


cardanoCli.submitTransaction(submitTransactionRequest).then(signTx => {
  console.log(signTx);
}).catch(error => {
  console.log(error)
})
```


[downloads-img]:https://img.shields.io/npm/dt/coti-cardano-cli
[downloads-url]:https://fillThisoneFromNpm.com
[npm-img]:https://img.shields.io/npm/v/coti-cardano-cli
[npm-url]:https://www.npmjs.com/package/coti-cardano-cli
[issues-img]:https://img.shields.io/github/issues/coti-io/coti-cardano-cli
[issues-url]:https://github.com/coti-io/coti-cardano-cli/issues



