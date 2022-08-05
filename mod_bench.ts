import mongoid from "https://jspm.dev/base64-mongo-id";
import { default as base64 } from "https://jspm.dev/uuid-base64";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { ObjectId64 } from "./mod.ts";
import { ObjectId } from "https://cdn.skypack.dev/bson?dts";
import id128 from "https://cdn.skypack.dev/id128?dts";

function getIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
const { bench } = Deno;
const encoder = new ObjectId64();

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
    const encoded = encoder.fromObjectId(id);
    assertEquals(id, encoder.toObjectId(encoded));
  },
);

bench("BigInt", { group: "ObjectId Hex to Base64" }, () => {
  const id = objectIds[getIndex(objectIds.length)][1];
  const encoded = encoder.fromBigInt(BigInt(`0x${id}`));
  assertEquals(id, encoder.toBigInt(encoded).toString(16));
});

bench("base64-mongo-id", { group: "ObjectId Hex to Base64" }, () => {
  const id = objectIds[getIndex(objectIds.length)][1];
  //@ts-ignore deno-lint
  const encoded = mongoid.toBase64(id);
  //@ts-ignore deno-lint
  assertEquals(id, mongoid.toHex(encoded));
});

bench(
  "[UUID Hex to Base64] ObjectId64",
  { group: "UUID Hex to Base64", baseline: true },
  () => {
    const id = uuidsHex[getIndex(uuidsHex.length)];
    const encoded = encoder.fromUUID(id);
    assertEquals(id, encoder.toUUID(encoded));
  },
);
bench(
  "uuid-base64",
  { group: "UUID Hex to Base64" },
  () => {
    const id = uuidsHex[getIndex(uuidsHex.length)];
    //@ts-ignore deno-lint
    const encoded = base64.encode(id);
    //@ts-ignore deno-lint
    assertEquals(id, base64.decode(encoded));
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
