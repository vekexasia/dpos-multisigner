# dpos-multisigner
[![npm](https://img.shields.io/npm/l/dpos-multisigner.svg?style=flat-square)](https://www.npmjs.com/package/dpos-multisigner)

**dpos-multisigner** Is a toolkit to ease multisign transaction offline co-signing.

The tool is written in TypeScript but is then transpiled to ES5. 

## Requirements
 - node.js - v4 or newer
 
## Coins supported

This tool currently supports the following crypto currencies: 

 - LISK
 - RISE
 - SHIFT
 - RISE
 
## Installation

### Consuming as library

Install using `npm i dpos-multisigner` and include it in your source code.

```js
var dposMultisigner = require('dpos-multisigner');

dposMultisigner(
	'http://nodeaddress:1235', // without trailing slash
	'12345678234L', // Multisig address
	async () => 'secret'
)
  .then(() => console.log('Yeah'))
  .catch(e => console.error(e));

```


### Consuming as command line interface

#### By trusting npm version (easy but may be insecure)

Install using `npm i -g dpos-multisigner`. Then use it from your terminal like shown below:

```bash
$ dpos-multisigner co-sign --node http://testnet.lisk.io:7000 --msigaddress 3015669565792622155L
```

#### By cloning this repo (more complicated but more secure)

```bash
git clone https://github.com/vekexasia/dpos-multisigner
cd dpos-multisigner
npm i
npm run build
chmod +x dist/multisign.js
```

Consume it like:

```bash
$ ./dist/multisign.js co-sign --node http://testnet.lisk.io:7000 --msigaddress 3015669565792622155L
```

## About

This little node project was developed by Andrea <vekexasia> Baccega as a request from `corsaro`.

