# ObjectId64

[![Actions Status](https://github.com/zandaqo/objectid64/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

Encodes UUID, MongoDB's ObjectId, numbers, and bigints to and from Base64 with a
configurable character set. By default the library uses the url-friendly
alphabet of `base64url`(`A-Z a-z 0-9 - _`).

Features:

- Configurable alphabet for obfuscating ids.
- Shorter id strings when compared to canonical hex strings:
  - UUID from 36 characters to 22
  - ObjectId from 24 to 16
- As fast as JavaScript gets.

Read more in
[An Exercise in Shortening Ids](https://itnext.io/an-exercise-in-shortening-ids-902b723fdd91).

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
import { ObjectId64 } from "https://raw.githubusercontent.com/zandaqo/objectid64/3.1.1/mod.ts";
```

```javascript
const encoder = new ObjectId64();

const objectId = new ObjectId();
const hex = objectId.toHexString();
//=> '581653766c5dbc10f0aceb55'
// encode binary directly
let encoded = encoder.fromBinObjectId(objectId.id);
//=> 'WBZTdmxdvBDwrOtV'
// or encode hex string with same result
encoded = encoder.fromObjectId(hex);
//=> 'WBZTdmxdvBDwrOtV'
let decoded = encoder.toObjectId(encoded);
//=> '581653766c5dbc10f0aceb55'
// or back to binary
decoded = encoder.toBinObjectid(encoded);
// => Uint8Array [...]

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
[ObjectId Hex to Base64] ObjectId64    4.28 µs/iter      (3.7 µs … 1.06 ms)      4 µs    9.6 µs   19.7 µs
BigInt                                12.67 µs/iter    (11.2 µs … 792.5 µs)   11.8 µs   29.4 µs   31.8 µs
base64-mongo-id                        6.75 µs/iter      (5.9 µs … 2.19 ms)    6.3 µs   21.8 µs     23 µs

summary
  [ObjectId Hex to Base64] ObjectId64
   1.58x faster than base64-mongo-id
   2.96x faster than BigInt

[UUID Hex to Base64] ObjectId64        8.28 µs/iter      (4.9 µs … 3.31 ms)    7.7 µs   25.1 µs   28.1 µs
uuid-base64                            11.8 µs/iter        (9 µs … 3.68 ms)   10.9 µs   28.6 µs   32.1 µs

summary
  [UUID Hex to Base64] ObjectId64
   1.43x faster than uuid-base64

[UUID Binary] ObjectId64               3.72 µs/iter      (2.5 µs … 3.59 ms)    3.4 µs    9.4 µs   17.1 µs
id128 ULID                              5.5 µs/iter     (3.3 µs … 19.82 ms)    4.6 µs   20.3 µs   26.2 µs
id128 UUID                            44.13 µs/iter        (5 µs … 3.08 ms)   57.4 µs  108.3 µs  139.7 µs

summary
  [UUID Binary] ObjectId64
   1.48x faster than id128 ULID
   11.86x faster than id128 UUID

[ObjectId Binary] ObjectId64           2.64 µs/iter      (2.1 µs … 3.84 ms)    2.3 µs    7.6 µs     11 µs
BSON                                   4.65 µs/iter      (3.8 µs … 5.41 ms)    4.2 µs   13.6 µs   19.3 µs

summary
  [ObjectId Binary] ObjectId64
   1.77x faster than BSON
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
