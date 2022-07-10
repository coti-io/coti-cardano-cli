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
npm install @coti/cardano-cli
```

## Usage

```ts
import { CardanoCli } from '@coti/cardano-cli';
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
```


[downloads-img]:https://img.shields.io/npm/dt/coti-cardano-cli
[downloads-url]:https://fillThisoneFromNpm.com
[npm-img]:https://img.shields.io/npm/v/coti-cardano-cli
[npm-url]:https://www.npmjs.com/package/coti-cardano-cli
[issues-img]:https://img.shields.io/github/issues/coti-io/coti-cardano-cli
[issues-url]:https://github.com/coti-io/coti-cardano-cli/issues



