# ObjectId64

[![Actions Status](https://github.com/zandaqo/objectid64/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

Encodes UUID, MongoDB's ObjectId, numbers, and bigints to and from Base64 with a
configurable character set. By default the library uses the following
url-friendly alphabet:
`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.

Features:

- Configurable alphabet for obfuscating ids.
- Shorter id strings:
  - UUID from 36 characters to 22
  - ObjectId from 24 to 16
- As fast as JavaScript gets.

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
import { ObjectId64 } from "https://raw.githubusercontent.com/zandaqo/objectid64/3.0.3/mod.ts";
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

### With a custom alphabet:

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
//=> "BsU0cdf2qTo0CZ0LhXLwcF"
decoded = encoder.toUUID(encoded);
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
```

## Benchmark

```
> deno bench --unstable
benchmark            time (avg)             (min … max)       p75       p99      p995        
------------------------------------------------------- -----------------------------        
ObjectId64         1.43 µs/iter     (1.35 µs … 2.04 µs)   1.44 µs   2.04 µs   2.04 µs
BigInt             6.64 µs/iter     (4.7 µs … 15.65 ms)    5.6 µs   20.6 µs   26.3 µs
base64-mongo-id    3.36 µs/iter      (2.7 µs … 2.51 ms)    2.9 µs    9.8 µs   12.4 µs

summary
  ObjectId64
   2.35x faster than base64-mongo-id
   4.64x faster than BigInt

ObjectId64         3.45 µs/iter      (2.2 µs … 8.92 ms)    3.1 µs   10.1 µs   11.2 µs
uuid-base64       11.49 µs/iter      (8.6 µs … 4.05 ms)   10.7 µs   28.3 µs   33.5 µs

summary
  ObjectId64
   3.33x faster than uuid-base64

ObjectId64         4.13 µs/iter     (3.79 µs … 5.82 µs)   3.97 µs   5.82 µs   5.82 µs
nanoid             7.22 µs/iter      (3.8 µs … 6.47 ms)    5.3 µs   36.6 µs   40.5 µs

summary
  ObjectId64
   1.75x faster than nanoid
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
