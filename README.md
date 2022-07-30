# ObjectId64

[![Actions Status](https://github.com/zandaqo/objectid64/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

Encodes UUID, MongoDB's ObjectId, numbers, and bigints to and from base64 with a
configurable character set. By default the library uses the following
url-friendly character set:
`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.

Features:

- Shorter id strings:
  - UUID from 36 characters to 22
  - ObjectId from 24 to 16
  - numbers as strings up to 1/4 in character size
- Configurable character set for masking ids.
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
import { ObjectId64 } from "https://raw.githubusercontent.com/zandaqo/objectid64/3.0.2/mod.ts";
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
//=> "BsU0cdf2qTo0CZ0LhXLwcF"
decoded = encoder.toUUID(encoded);
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
```

## Benchmark

```
> deno bench --unstable
benchmark            time (avg)             (min … max)       p75       p99      p995        
------------------------------------------------------- -----------------------------        
ObjectId64         3.39 µs/iter     (3.21 µs … 4.49 µs)    3.4 µs   4.49 µs   4.49 µs
BigInt            13.04 µs/iter    (11.1 µs … 514.5 µs)   11.7 µs   31.4 µs   35.7 µs
base64-mongo-id    6.99 µs/iter     (6.2 µs … 514.6 µs)    6.5 µs   21.4 µs   22.8 µs

summary
  ObjectId64
   2.06x faster than base64-mongo-id
   3.84x faster than BigInt

ObjectId64         7.79 µs/iter      (4.9 µs … 2.58 ms)    7.2 µs   23.8 µs   27.8 µs
uuid-base64       11.78 µs/iter        (9 µs … 3.29 ms)     11 µs   27.9 µs   31.9 µs

summary
  ObjectId64
   1.51x faster than uuid-base64
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
