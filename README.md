Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64. By default, uses the following character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`. The character set can changed by supplying a string of 64 characters upon importing the library, i.e. `require('objectid64')(base)`.
 
# Install
```
npm i objectid64
```

# Examples
## Basic usage:
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

## Using a custom character set for base:
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

# Benchmark
```
>node benchmark.js
ObjectID64 x 436,048 ops/sec ±1.08% (85 runs sampled)
Buffer x 349,820 ops/sec ±1.49% (88 runs sampled)
base64-mongo-id x 246,457 ops/sec ±1.48% (88 runs sampled)
int-encoder x 3,619 ops/sec ±9.23% (87 runs sampled)
Fastest is ObjectID64
```
