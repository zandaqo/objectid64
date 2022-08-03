import mongoid from "https://jspm.dev/base64-mongo-id";
import { default as base64 } from "https://jspm.dev/uuid-base64";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { customAlphabet } from "https://jspm.dev/nanoid";
import { ObjectId64 } from "./mod.ts";
import { ObjectId } from "https://cdn.skypack.dev/bson?dts";

function getIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
const { bench } = Deno;
const encoder = new ObjectId64();
const nanoid = customAlphabet(encoder.base, 21);

const objectIds: Array<[ObjectId, string]> = new Array(100).fill(1).map(() => {
  const id = new ObjectId();
  return [id, id.toHexString()];
});

const uuids = new Array(100).fill(1).map(() => crypto.randomUUID());

bench(
  "ObjectId64",
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
  "ObjectId64",
  { group: "UUID Hex to Base64", baseline: true },
  () => {
    const id = uuids[getIndex(uuids.length)];
    const encoded = encoder.fromUUID(id);
    assertEquals(id, encoder.toUUID(encoded));
  },
);
bench(
  "uuid-base64",
  { group: "UUID Hex to Base64" },
  () => {
    const id = uuids[getIndex(uuids.length)];
    //@ts-ignore deno-lint
    const encoded = base64.encode(id);
    //@ts-ignore deno-lint
    assertEquals(id, base64.decode(encoded));
  },
);

bench(
  "ObjectId64",
  { group: "UUID Generate", baseline: true },
  () => {
    const id = crypto.getRandomValues(new Uint8Array(16));
    const _encoded = encoder.fromBinUUID(id);
  },
);

bench(
  "ObjectId64 From Hex",
  { group: "UUID Generate" },
  () => {
    const id = crypto.randomUUID();
    const _encoded = encoder.fromUUID(id);
  },
);

bench(
  "nanoid",
  { group: "UUID Generate" },
  () => {
    const _encoded = nanoid();
  },
);
