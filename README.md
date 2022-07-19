# Coti cardano-cli 

> A package to run cardano-cli commands from nodejs, if you hold a blockfrost API-KEY you could add 
> while  creating a cardano-cli instance and get the data directly from there without running a cardano
> node.

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

# Install binaries
1) Download the binaries from the cardano website (version 1.35.0)
 https://hydra.iohk.io/build/16934881  
2) Copy the cardano-cli to the bin dir, if it not exists create a bin dir in /bin
3) run the following command on the cardano-cli file ``` chmod +x cardano-cli ```

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
      "txHash": "<txHash>",
      "utxoIndex": 1 // txIndex
    }
  ],
  "txsOut": [
    {
      "address": "<address>",
      "amount": 100000000 // amount
    },

    {
      "address": "<address>",
      "amount": 798000000 // amount
    }
  ],
  "hereAfter": 63700063, // current slot number + x
  "fee": 1000000 // minmum transaction fee
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
    "cborHex": "<cborHex>"
  },
  "paymentKeys": [
    {
      "type": "PaymentExtendedSigningKeyShelley_ed25519_bip32",
      "description": "",
      "cborHex": "<cborHex>"
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
    "cborHex": "<cborHex>"
  }
}


cardanoCli.submitTransaction(submitTransactionRequest).then(signTx => {
  console.log(signTx);
}).catch(error => {
  console.log(error)
})
```


[downloads-img]:https://img.shields.io/npm/dt/coti-cardano-cli
[downloads-url]:https://npmtrends.com/coti-cardano-cli
[npm-img]:https://img.shields.io/npm/v/coti-cardano-cli
[npm-url]:https://www.npmjs.com/package/coti-cardano-cli
[issues-img]:https://img.shields.io/github/issues/coti-io/coti-cardano-cli
[issues-url]:https://github.com/coti-io/coti-cardano-cli/issues



