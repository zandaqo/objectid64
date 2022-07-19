import mongoid from "https://jspm.dev/base64-mongo-id";
import { default as base64 } from "https://jspm.dev/uuid-base64";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { ObjectId64 } from "./mod.ts";

function getIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
const { bench } = Deno;
const encoder = new ObjectId64();

const objectIds = [
  "581653766c5dbc10f0aceb55",
  "581653766c5dbc10f0aceb56",
  "581653766c5dbc10f0aceb57",
  "581653766c5dbc10f0aceb58",
  "581653766c5dbc10f0aceb59",
  "581653766c5dbc10f0aceb5a",
  "581653766c5dbc10f0aceb5b",
  "581653766c5dbc10f0aceb5c",
  "581653766c5dbc10f0aceb5d",
  "581653766c5dbc10f0aceb5e",
  "581653766c5dbc10f0aceb5f",
  "581653766c5dbc10f0aceb60",
  "581653766c5dbc10f0aceb61",
  "581653766c5dbc10f0aceb62",
  "581653766c5dbc10f0aceb63",
  "581653766c5dbc10f0aceb64",
  "581653766c5dbc10f0aceb65",
  "581653766c5dbc10f0aceb66",
  "581653766c5dbc10f0aceb67",
  "581653766c5dbc10f0aceb68",
  "581653766c5dbc10f0aceb69",
  "581653766c5dbc10f0aceb6a",
];

const uuids = new Array(100).fill(1).map(() => crypto.randomUUID());

bench(
  "ObjectId64",
  { group: "ObjectId", baseline: true },
  () => {
    const id = objectIds[getIndex(objectIds.length)];
    const encoded = encoder.fromObjectId(id);
    assertEquals(id, encoder.toObjectId(encoded));
  },
);

bench("BigInt", { group: "ObjectId" }, () => {
  const id = objectIds[getIndex(objectIds.length)];
  const encoded = encoder.fromBigInt(BigInt(`0x${id}`));
  assertEquals(id, encoder.toBigInt(encoded).toString(16));
});

bench("base64-mongo-id", { group: "ObjectId" }, () => {
  const id = objectIds[getIndex(objectIds.length)];
  //@ts-ignore deno-lint
  const encoded = mongoid.toBase64(id);
  //@ts-ignore deno-lint
  assertEquals(id, mongoid.toHex(encoded));
});

bench(
  "ObjectId64",
  { group: "UUID", baseline: true },
  () => {
    const id = uuids[getIndex(uuids.length)];
    const encoded = encoder.fromUUID(id);
    assertEquals(id, encoder.toUUID(encoded));
  },
);
bench(
  "uuid-base64",
  { group: "UUID" },
  () => {
    const id = uuids[getIndex(uuids.length)];
    //@ts-ignore deno-lint
    const encoded = base64.encode(id);
    //@ts-ignore deno-lint
    assertEquals(id, base64.decode(encoded));
  },
);
