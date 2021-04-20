# ObjectID64
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)
[![Actions Status](https://github.com/zandaqo/objectid64/workflows/Build/badge.svg)](https://github.com/zandaqo/objectid64/actions)

Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64.
By default, uses the following url-friendly character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.
The character set can be changed by supplying a custom string to the constructor.

## Install
```
npm i objectid64
```

## Usage
```
import { ObjectID } from 'objectid64';

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
import { ObjectID } from 'objectid64';

const id = new ObjectID('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_');
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
ObjectID64 x 505,334 ops/sec ±9.90% (68 runs sampled)
Buffer x 438,701 ops/sec ±9.29% (80 runs sampled)
base64-mongo-id x 234,771 ops/sec ±8.72% (74 runs sampled)
BigInt x 56,877 ops/sec ±8.87% (67 runs sampled)
int-encoder x 6,468 ops/sec ±10.17% (63 runs sampled)
Fastest is ObjectID64
```

## License
MIT © [Maga D. Zandaqo](http://maga.name)
