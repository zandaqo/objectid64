# ObjectId64

[![Actions Status](https://github.com/zandaqo/objectid64/workflows/ci/badge.svg)](https://github.com/zandaqo/objectid64/actions)
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)

The library offers the `Encoder` class to convert UUIDs, ObjectIds, numbers, and
bigints to and from Base64 with a configurable character set. By default, the
encoder uses the url-friendly alphabet of `base64url`(`A-Z a-z 0-9 - _`).

The `Encrypter` class can be used to further secure structured and sequential
ids from intelligence leaks by encrypting them into 128-bit (UUID-like) values
using built-in Web Crypto API.

Features:

- Encoder with a configurable alphabet for obfuscating ids.
- Shorter id strings when compared to canonical hex strings:
  - UUID results in 22 characters against canonical 36
  - ObjectId is 16 instead of 24 hex characters
- As fast as JavaScript gets. Encoding to/from binary even faster than canonical
  encoding to/from hex strings.
- Strong encryption using built-in Web Crypto API.

Read more in
[An Exercise in Shortening Ids](https://itnext.io/an-exercise-in-shortening-ids-902b723fdd91).

## Usage

### Installation

In Node.js

```bash
npm i objectid64
```

```javascript
import { Encoder, Encrypter } from "objectid64";
```

In Deno:

```javascript
import {
  Encoder,
  Encrypter,
} from "https://raw.githubusercontent.com/zandaqo/objectid64/3.2.0/mod.ts";
```

### Custom Encoder

Instantiate a new encoder with the desired alphabet. The alphabet is a string of
64 characters where the character position determines the resulting encoding. By
varying the position, we can create different encodings, for example, to
obfuscate numerical ids. If no alphabet is provided, the default `base64url`
will be used:

```javascript
const defaultEncoder = new Encoder();

const customEncoder = new Encoder(
  "KLMNOPQRSTUVWXYZabcdefghijklmnopqr23456stuvwxyzABCDEFGHIJ01789-_",
);
```

If you are not going to deal with hex strings of UUIDs or ObjectIds, set the
second parameter of the encoder constructor (`noLookup`) to `true` to avoid
generating lookup tables for hex conversions:

```javascript
const defaultEncoder = new Encoder(null, true);
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

The encoder supports direct encoding of binary UUIDs and ObjectIds to and from
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

`Encoder` also supports coversion between the canonical id hex strings and
Base64:

```javascript
const encoder = new Encoder();

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

### Id Encryption

While encoding with custom character sets can achieve certain obfurscation, it
is not a strong encryption. To secure structured ids from business intelligence
leaks where it really matters, one should use strong encryption algorithms.
Hence, `Encrypter` class provides an interface for encrypting ids into UUID-like
128-bit values using AES encryption offered by Web Crypto API.

```typescript
const encoder = new Encoder();
// generates 128-bit AES-CRT key to use in our encrypter
const key = await Encrypter.generateKey();
const encrypter = new Encrypter(key);
const objectId = new ObjectId();
encoder.fromBinObjectId(objectId.id);
//=> WBZTdmxdvBDwrOtV
const encrypted = await encrypter.fromObjectId(objectId.id);
encoder.fromBinUUID(encrypted);
//=> zSrTRzGRrRZOVR5_2gbDBd
const decrypted = await encrypter.toObjectId(encrypted);
encoder.fromBinObjectId(decrypted);
//=> WBZTdmxdvBDwrOtV
```

## Benchmark

```
> deno bench --unstable
benchmark                                time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------------------------- -----------------------------
[ObjectId Hex to Base64] ObjectId64    1.26 µs/iter     (1.19 µs … 1.67 µs)   1.28 µs   1.67 µs   1.67 µs
BigInt                                 5.95 µs/iter     (5.86 µs … 6.28 µs)   5.96 µs   6.28 µs   6.28 µs
base64-mongo-id                        2.72 µs/iter     (2.56 µs … 4.43 µs)   2.72 µs   4.43 µs   4.43 µs

summary
  [ObjectId Hex to Base64] ObjectId64
   2.15x faster than base64-mongo-id
   4.71x faster than BigInt

[UUID Hex to Base64] ObjectId64        2.51 µs/iter     (2.25 µs … 3.78 µs)   2.47 µs   3.78 µs   3.78 µs
uuid-base64                            8.67 µs/iter      (6.5 µs … 3.01 ms)      8 µs   23.8 µs   25.7 µs

summary
  [UUID Hex to Base64] ObjectId64
   3.45x faster than uuid-base64

[UUID Binary] ObjectId64               3.13 µs/iter      (2.1 µs … 4.23 ms)    2.6 µs    8.5 µs   13.6 µs
id128 ULID                             4.44 µs/iter     (3.1 µs … 17.98 ms)    3.9 µs     12 µs   20.3 µs
id128 UUID                             43.8 µs/iter      (4.6 µs … 4.16 ms)   54.9 µs    112 µs  141.6 µs

summary
  [UUID Binary] ObjectId64
   1.42x faster than id128 ULID
   14.01x faster than id128 UUID

[ObjectId Binary] ObjectId64           1.81 µs/iter     (1.39 µs … 4.99 µs)   1.87 µs   4.99 µs   4.99 µs
BSON                                    4.4 µs/iter       (3.6 µs … 5.1 ms)      4 µs   13.2 µs   19.2 µs

summary
  [ObjectId Binary] ObjectId64
   2.44x faster than BSON

[UUID Encode/Encrypt] Encode UUID      2.36 µs/iter      (2.12 µs … 4.4 µs)   2.16 µs    4.4 µs    4.4 µs
Encrypt UUID                         209.52 µs/iter    (150.3 µs … 3.59 ms)  209.4 µs  501.6 µs  700.1 µs

summary
  [UUID Encode/Encrypt] Encode UUID
   88.69x faster than Encrypt UUID

[Int Encode/Encrypt] Encode Int      318.29 ns/iter (281.78 ns … 736.37 ns) 296.57 ns 662.18 ns 736.37 ns
Encrypt Int                          198.17 µs/iter    (156.4 µs … 4.18 ms)  187.9 µs  436.3 µs  605.5 µs

summary
  [Int Encode/Encrypt] Encode Int
   622.62x faster than Encrypt Int
```

## License

MIT © [Maga D. Zandaqo](http://maga.name)
