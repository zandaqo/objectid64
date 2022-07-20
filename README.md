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
//=> "BsU0cdf2qTo0CZ0LhXLwcF"
decoded = encoder.toUUID(encoded);
//=> "6d2bb408-3176-42d3-b473-3d251f19569f"
```

## Benchmark

```
> deno bench --unstable
benchmark            time (avg)             (min … max)       p75       p99      p995        
------------------------------------------------------- -----------------------------        
ObjectId64         1.63 µs/iter     (1.53 µs … 2.57 µs)   1.62 µs   2.57 µs   2.57 µs        
BigInt             7.48 µs/iter     (6.4 µs … 480.9 µs)      7 µs   17.2 µs   21.6 µs        
base64-mongo-id    4.56 µs/iter     (2.6 µs … 675.9 µs)    6.2 µs   10.3 µs   13.7 µs        

summary
  ObjectId64
   2.8x faster than base64-mongo-id
   4.6x faster than BigInt

ObjectId64         8.05 µs/iter     (5.2 µs … 994.8 µs)    7.4 µs   24.2 µs   27.6 µs        
uuid-base64       11.64 µs/iter     (9.4 µs … 515.3 µs)   11.2 µs   28.5 µs   30.3 µs        

summary
  ObjectId64
   1.45x faster than uuid-base64
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
