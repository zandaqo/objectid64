# ObjectID64
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)
[![Travis branch](https://img.shields.io/travis/zandaqo/objectid64.svg?style=flat-square)](https://travis-ci.org/zandaqo/objectid64)

Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64. By default, uses the following character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`. The character set can changed by supplying a string of 64 characters upon importing the library, i.e. `require('objectid64')(base)`.
 
## Install
```
npm i objectid64 -S
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

### To use custom character set for base:
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
ObjectID64 x 273,622 ops/sec ±2.09% (82 runs sampled)
Buffer x 256,028 ops/sec ±8.13% (75 runs sampled)
base64-mongo-id x 234,712 ops/sec ±1.90% (80 runs sampled)
int-encoder x 4,163 ops/sec ±13.36% (84 runs sampled)
Fastest is ObjectID64
```

## License
MIT © [Maga D. Zandaqo](http://maga.name)
