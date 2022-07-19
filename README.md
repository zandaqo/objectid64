# ObjectID64

[![Actions Status](https://github.com/zandaqo/objectid64/actions/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

Encodes and decodes UUID, MongoDB's ObjectId, numbers, and bigints to and from
base64. The character set is configurable, by default the library uses the
following url-friendly character set:
`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.

Features:

- Shortens id strings:
  - UUID from 36 characters to 22
  - ObjectId from 24 to 16
  - numbers as strings up to 4 times fewer characters
- As fast as JavaScript gets.
- Configurable character set.

## Usage

In Node.js

```bash
npm i objectid64
```

```javascript
import { ObjectId64 } from "objectid64";
```

In Deno:

```javascript
import { ObjectId64 } from "https://raw.githubusercontent.com/zandaqo/objectid64/3.0.0/mod.ts";
```

```javascript
const encoder = new ObjectId64();

const objectId = new ObjectId().toHexString();
//=> '581653766c5dbc10f0aceb55'
let encoded = encoder.fromObjectId(objectId);
//=> 'WBZTdmxdvBDwrOtV'
let decoded = encoder.toObjectId(encoded);
//=> '581653766c5dbc10f0aceb55'

const uuid = crypto.randomUUID();
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
encoded = encoder.fromUUID(uuid);
//=> "bSu0CDF2QtO0cz0lHxlWCf"
decoded = encoder.toUUID(encoded);
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
```

### With a custom character set:

```javascript
const encoder = new ObjectId64(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
);

const objectId = new ObjectId().toHexString();
//=> '581653766c5dbc10f0aceb55'
let encoded = encoder.fromObjectId(objectId);
//=> 'wbztDMXDVbdWRoTv'
let decoded = encoder.toObjectId(encoded);
//=> '581653766c5dbc10f0aceb55'

const uuid = crypto.randomUUID();
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
encoded = encoder.fromUUID(uuid);
//=> "bSu0CDF2QtO0cz0lHxlWCf"
decoded = encoder.toUUID(encoded);
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
```

## Benchmark

```
> deno bench --unstable
PS D:\objectid64> deno bench --unstable
benchmark            time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------- -----------------------------
ObjectId64         1.71 µs/iter     (1.58 µs … 2.65 µs)   1.71 µs   2.65 µs   2.65 µs
BigInt             9.46 µs/iter     (6.4 µs … 12.06 ms)    7.9 µs   27.8 µs     34 µs
base64-mongo-id    5.92 µs/iter     (4.52 µs … 6.81 µs)   5.96 µs   6.81 µs   6.81 µs

summary
  ObjectId64
   3.46x faster than base64-mongo-id
   5.54x faster than BigInt

ObjectId64         9.08 µs/iter      (5.2 µs … 9.49 ms)    7.7 µs   25.1 µs   35.4 µs
uuid-base64       11.31 µs/iter       (8.6 µs … 4.4 ms)   10.2 µs   29.1 µs   34.4 µs

summary
  ObjectId64
   1.25x faster than uuid-base64
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
