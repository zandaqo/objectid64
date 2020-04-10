# ObjectID64
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)
[![Actions Status](https://github.com/zandaqo/objectid64/workflows/Build/badge.svg)](https://github.com/zandaqo/objectid64/actions)

Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64.
By default, uses the following character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.
The character set can be changed by supplying a string of 64 characters upon importing the library, i.e. `require('objectid64')(base)`.
 
## Install
```
npm i objectid64
```

## Usage
```
const ObjectID = require('mongodb').ObjectID;
const ObjectID64 = require('objectid64')();

const id = new ObjectID();
// 581653766c5dbc10f0aceb55
const encoded = ObjectID64.encode(id.toString());
// 'WBZTdmxdvBDwrOtV'
const decoded = ObjectID64.decode(encoded);
// '581653766c5dbc10f0aceb55'
const original = new ObjectID(decoded);
```

### With a custom character set:
```
const ObjectID = require('mongodb').ObjectID;
const ObjectID64 = require('objectid64')('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_');

const id = new ObjectID();
// 581653766c5dbc10f0aceb55
const encoded = ObjectID64.encode(id.toString());
// 'wbztDMXDVbdWRoTv'
const decoded = ObjectID64.decode(encoded);
// '581653766c5dbc10f0aceb55'
const original = new ObjectID(decoded);
```

## Benchmark
```
>node benchmark.js
ObjectID64 x 340,105 ops/sec ±1.18% (85 runs sampled)
Buffer x 232,186 ops/sec ±1.54% (86 runs sampled)
base64-mongo-id x 176,578 ops/sec ±1.01% (87 runs sampled)
BigInt x 42,474 ops/sec ±1.30% (87 runs sampled)
int-encoder x 4,042 ops/sec ±1.38% (83 runs sampled)
Fastest is ObjectID64
```

## License
MIT © [Maga D. Zandaqo](http://maga.name)
