import mongoid from "https://jspm.dev/base64-mongo-id";
import { default as base64 } from "https://jspm.dev/uuid-base64";
import { ObjectId } from "https://cdn.skypack.dev/bson?dts";
import id128 from "https://cdn.skypack.dev/id128?dts";
import { Encoder, Encrypter } from "../mod.ts";

function getIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
const { bench } = Deno;
const encoder = new Encoder();

const key = await Encrypter.generateKey();
const encrypter = new Encrypter(key);

const objectIds: Array<[ObjectId, string]> = new Array(100).fill(1).map(() => {
  const id = new ObjectId();
  return [id, id.toHexString()];
});

const uuids = new Array(100).fill(1).map(() =>
  crypto.getRandomValues(new Uint8Array(16))
);
const uuidsHex = new Array(100).fill(1).map(() => crypto.randomUUID());

bench(
  "[ObjectId Hex to Base64] ObjectId64",
  { group: "ObjectId Hex to Base64", baseline: true },
  () => {
    const id = objectIds[getIndex(objectIds.length)][1];
    const _encoded = encoder.fromObjectId(id);
  },
);

bench("BigInt", { group: "ObjectId Hex to Base64" }, () => {
  const id = objectIds[getIndex(objectIds.length)][1];
  const _encoded = encoder.fromBigInt(BigInt(`0x${id}`));
});

bench("base64-mongo-id", { group: "ObjectId Hex to Base64" }, () => {
  const id = objectIds[getIndex(objectIds.length)][1];
  //@ts-ignore deno-lint
  const _encoded = mongoid.toBase64(id);
});

bench(
  "[UUID Hex to Base64] ObjectId64",
  { group: "UUID Hex to Base64", baseline: true },
  () => {
    const id = uuidsHex[getIndex(uuidsHex.length)];
    const _encoded = encoder.fromUUID(id);
  },
);
bench(
  "uuid-base64",
  { group: "UUID Hex to Base64" },
  () => {
    const id = uuidsHex[getIndex(uuidsHex.length)];
    //@ts-ignore deno-lint
    const _encoded = base64.encode(id);
  },
);

bench(
  "[UUID Binary] ObjectId64",
  { group: "UUID Binary", baseline: true },
  () => {
    const id = uuids[getIndex(100)];
    const encoded = encoder.fromBinUUID(id);
    const _decoded = encoder.toBinUUID(encoded);
  },
);

bench(
  "id128 ULID",
  { group: "UUID Binary" },
  () => {
    const id = uuids[getIndex(100)];
    const encoded = id128.Ulid.construct(id).toCanonical();
    const _decoded = id128.Ulid.fromCanonical(encoded).bytes;
  },
);

bench(
  "id128 UUID",
  { group: "UUID Binary" },
  () => {
    const id = uuids[getIndex(100)];
    const encoded = id128.Uuid.construct(id).toCanonical();
    const _decoded = id128.Uuid.fromCanonical(encoded).bytes;
  },
);

bench(
  "[ObjectId Binary] ObjectId64",
  { group: "ObjectId Binary", baseline: true },
  () => {
    const id = objectIds[getIndex(100)][0].id;
    const encoded = encoder.fromBinObjectId(id);
    const _decoded = encoder.toBinObjectId(encoded);
  },
);

bench(
  "BSON",
  { group: "ObjectId Binary" },
  () => {
    const id = objectIds[getIndex(100)][0];
    const encoded = id.toHexString();
    const _decoded = ObjectId.createFromHexString(encoded);
  },
);

bench(
  "[UUID Encode/Encrypt] Encode UUID",
  { group: "UUID Encode/Encrypt", baseline: true },
  () => {
    const id = uuids[getIndex(100)];
    const encoded = encoder.fromBinUUID(id);
    const _decoded = encoder.toBinUUID(encoded);
  },
);

bench(
  "Encrypt UUID",
  { group: "UUID Encode/Encrypt" },
  async () => {
    const id = uuids[getIndex(100)];
    const encrypted = await encrypter.fromUUID(id);
    const _decoded = await encrypter.toUUID(encrypted);
  },
);

bench(
  "[Int Encode/Encrypt] Encode Int",
  { group: "Int Encode/Encrypt", baseline: true },
  () => {
    const id = getIndex(1000000);
    const encoded = encoder.fromInt(id);
    const _decoded = encoder.toInt(encoded);
  },
);

bench(
  "Encrypt Int",
  { group: "Int Encode/Encrypt" },
  async () => {
    const id = getIndex(1000000);
    const encrypted = await encrypter.fromInt(id);
    const _decoded = await encrypter.toInt(encrypted);
  },
);
