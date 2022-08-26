# ObjectId64

[![Actions Status](https://github.com/zandaqo/objectid64/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

Encodes UUID, MongoDB's ObjectId, numbers, and bigints to and from Base64 with a
configurable character set. By default the library uses the url-friendly
alphabet of `base64url`(`A-Z a-z 0-9 - _`).

Features:

- Configurable alphabet for obfuscating ids.
- Shorter id strings when compared to canonical hex strings:
  - UUID results in 22 characters against canonical 36
  - ObjectId is 16 instead of 24 hex characters
- As fast as JavaScript gets. Encoding to/from binary even faster than canonical
  encoding to/from hex strings.

Read more in
[An Exercise in Shortening Ids](https://itnext.io/an-exercise-in-shortening-ids-902b723fdd91).

## Usage

### Installation

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

### Custom Encoder

Instantiate a new encoder with the desired alphabet. The alphabet is a string of
64 characters where the character position determines the resulting encoding. By
varying the position, we can create different encodings, for example, to
obfuscate numerical ids. If no alphabet is provided, the default `base64url`
will be used:

```javascript
const defaultEncoder = new ObjectId64();

const customEncoder = new ObjectId64(
  "KLMNOPQRSTUVWXYZabcdefghijklmnopqr23456stuvwxyzABCDEFGHIJ01789-_",
);
```

If you are not going to deal with hex strings of UUID or ObjectId, set the
second parameter of the encoder constructor (`noLookup`) to `true` to avoid
generating lookup tables for hex conversions:

```javascript
const defaultEncoder = new ObjectId64(null, true);
```

### Obfuscating Sequential Ids

By using different alphabets, we can encode numerical ids into different Base64
strings:

```javascript
defaultEncoder.fromInt(86576);
//=> "VIw"
defaultEncoder.toInt("VIw");
//=> 86576

customEncoder.fromInt(86576);
//=> "fSB"
customEncoder.toInt("fSB");
//=> 86576
```

For sequential ids represented by 64-bit integers, we can use JavaScript's
`bigints`:

```javascript
customEncoder.fromBigInt(2989452080569002368n);
//=> "M58vyahh26K"
customEncoder.toBigInt("M58vyahh26K");
//=> 2989452080569002368n

customEncoder.fromBigInt(2989452080569002368n);
//=> "M58vyahh26K"
customEncoder.toBigInt("M58vyahh26K");
//=> 2989452080569002368n
```

### Binary UUIDS and ObjectIds

The encoder supports direct encoding of binary UUID and ObjectId to and from
Base64, and does so almost twice as fast as other implementations encoding into
canonical hex strings.

```javascript
const objectId = new ObjectId("581653766c5dbc10f0aceb55");
objectId.id;
//=> Uint8Array [88 ... 85]
defaultEncoder.fromBinObjectId(objectId.id);
//=> "WBZTdmxdvBDwrOtV"
defaultEncoder.toBinObjectId("WBZTdmxdvBDwrOtV");
//=> Uint8Array [88 ... 85]

const uuid = new Uint8Array([0x6d, ..., 0x9f]);
defaultEncoder.fromBinUUID(uuid);
//=> "ygtwdVymRMenB4rdSkqHDS"
defaultEncoder.toBinUUID("ygtwdVymRMenB4rdSkqHDS");
//=> new Uint8Array([0x6d, ..., 0x9f])
```

### Hex UUIDs and ObjectIds

And finally, `objectid64` supports coversion between the canonical id hex
strings and Base64:

```javascript
const encoder = new ObjectId64();

const objectId = new ObjectId();
const hex = objectId.toHexString();
//=> '581653766c5dbc10f0aceb55'
let encoded = encoder.fromObjectId(hex);
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

## Benchmark

```
> deno bench --unstable
benchmark                                time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------------------------- -----------------------------
[ObjectId Hex to Base64] ObjectId64    1.27 µs/iter     (1.22 µs … 1.66 µs)   1.29 µs   1.66 µs   1.66 µs
BigInt                                 7.37 µs/iter     (6.4 µs … 342.4 µs)    6.7 µs   21.4 µs     24 µs
base64-mongo-id                        2.86 µs/iter     (2.76 µs … 4.37 µs)   2.83 µs   4.37 µs   4.37 µs

summary
  [ObjectId Hex to Base64] ObjectId64
   2.24x faster than base64-mongo-id
   5.78x faster than BigInt

[UUID Hex to Base64] ObjectId64        2.58 µs/iter     (2.41 µs … 3.03 µs)   2.64 µs   3.03 µs   3.03 µs
uuid-base64                            8.93 µs/iter      (6.8 µs … 2.15 ms)    8.5 µs   25.4 µs     27 µs

summary
  [UUID Hex to Base64] ObjectId64
   3.46x faster than uuid-base64

[UUID Binary] ObjectId64                3.1 µs/iter      (2.2 µs … 1.85 ms)    2.8 µs   11.3 µs   13.3 µs
id128 ULID                             4.58 µs/iter     (3.4 µs … 18.06 ms)    4.1 µs   14.1 µs   21.1 µs
id128 UUID                            48.93 µs/iter     (5.3 µs … 608.5 µs)   62.6 µs    125 µs    149 µs

summary
  [UUID Binary] ObjectId64
   1.48x faster than id128 ULID
   15.78x faster than id128 UUID

[ObjectId Binary] ObjectId64           1.56 µs/iter     (1.46 µs … 2.69 µs)    1.5 µs   2.69 µs   2.69 µs
BSON                                   4.62 µs/iter      (3.9 µs … 1.57 ms)    4.2 µs   13.1 µs   20.7 µs

summary
  [ObjectId Binary] ObjectId64
   2.95x faster than BSON
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
