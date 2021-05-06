# ObjectID64
[![npm](https://img.shields.io/npm/v/objectid64.svg?style=flat-square)](https://www.npmjs.com/package/objectid64)
[![Actions Status](https://github.com/zandaqo/objectid64/workflows/test/badge.svg)](https://github.com/zandaqo/objectid64/actions)

Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64.
By default, uses the following url-friendly character set: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.
The character set can be changed by supplying a custom string to the constructor.

## Usage
With Node.js

```bash
npm i objectid64
```

```javascript
import { ObjectID } from 'objectid64';
```

With Deno:
```javascript
import { ObjectID } from "https://raw.githubusercontent.com/zandaqo/objectid64/2.0/index.ts"
```


```javascript
const id = new ObjectID();
// 581653766c5dbc10f0aceb55
const encoded = ObjectID64.encode(id.toString());
// 'WBZTdmxdvBDwrOtV'
const decoded = ObjectID64.decode(encoded);
// '581653766c5dbc10f0aceb55'
const original = new ObjectID(decoded);
```

### With a custom character set:
```javascript
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
> deno run --no-check benchmark.ts
...
1. ObjectID64 (230ms) - 100%
2. base64-mongo-id (402ms) - 57.21%
3. BigInt (1058ms) - 21.74%
```

## License
MIT © [Maga D. Zandaqo](http://maga.name)
