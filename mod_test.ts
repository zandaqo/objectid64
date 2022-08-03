import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { ObjectId64 } from "./mod.ts";

const { test } = Deno;
const defaultEncoder = new ObjectId64();

const objectIds: Array<[string, string, bigint, Uint8Array]> = [
  [
    "581653766c5dbc10f0aceb55",
    "WBZTdmxdvBDwrOtV",
    27261671373252370877777767253n,
    new Uint8Array([
      88,
      22,
      83,
      118,
      108,
      93,
      188,
      16,
      240,
      172,
      235,
      85,
    ]),
  ],
  [
    "581653766c5dbc10f0acefff",
    "WBZTdmxdvBDwrO__",
    27261671373252370877777768447n,
    new Uint8Array([
      88,
      22,
      83,
      118,
      108,
      93,
      188,
      16,
      240,
      172,
      239,
      255,
    ]),
  ],
  [
    "581653766c5dbc10f0ace000",
    "WBZTdmxdvBDwrOAA",
    27261671373252370877777764352n,
    new Uint8Array([
      88,
      22,
      83,
      118,
      108,
      93,
      188,
      16,
      240,
      172,
      224,
      0,
    ]),
  ],
];

const uuids = [
  [
    "6d2bb408-3176-42d3-b473-3d251f19569f",
    "bSu0CDF2QtO0cz0lHxlWCf",
    new Uint8Array([
      0x6d,
      0x2b,
      0xb4,
      0x08,
      0x31,
      0x76,
      0x42,
      0xd3,
      0xb4,
      0x73,
      0x3d,
      0x25,
      0x1f,
      0x19,
      0x56,
      0x9f,
    ]),
  ],
  [
    "ca0b7075-5ca6-44c7-a707-8add4a4a87d2",
    "ygtwdVymRMenB4rdSkqHDS",
    new Uint8Array([
      0xca,
      0x0b,
      0x70,
      0x75,
      0x5c,
      0xa6,
      0x44,
      0xc7,
      0xa7,
      0x07,
      0x8a,
      0xdd,
      0x4a,
      0x4a,
      0x87,
      0xd2,
    ]),
  ],
  [
    "b4fc0f24-19fc-40f5-a0e9-f70ddeec78e1",
    "tPwPJBn8QPWg6fcN3ux4Dh",
    new Uint8Array([
      0xb4,
      0xfc,
      0x0f,
      0x24,
      0x19,
      0xfc,
      0x40,
      0xf5,
      0xa0,
      0xe9,
      0xf7,
      0x0d,
      0xde,
      0xec,
      0x78,
      0xe1,
    ]),
  ],
  [
    "76955caf-eff1-4eb5-84e0-689737909150",
    "dpVcr-_xTrWE4GiXN5CRBQ",
    new Uint8Array([
      0x76,
      0x95,
      0x5c,
      0xaf,
      0xef,
      0xf1,
      0x4e,
      0xb5,
      0x84,
      0xe0,
      0x68,
      0x97,
      0x37,
      0x90,
      0x91,
      0x50,
    ]),
  ],
  [
    "0abb80ef-d7a2-4095-b35a-af8f67b09555",
    "CruA79eiQJWzWq-PZ7CVBV",
    new Uint8Array([
      0x0a,
      0xbb,
      0x80,
      0xef,
      0xd7,
      0xa2,
      0x40,
      0x95,
      0xb3,
      0x5a,
      0xaf,
      0x8f,
      0x67,
      0xb0,
      0x95,
      0x55,
    ]),
  ],
] as const;

const ints: Array<[number, string]> = [
  [6083061, "XNH1"],
  [402, "GS"],
  [2104809, "IB3p"],
  [325, "FF"],
  [257, "EB"],
];

test("[ObjectID64.constructor] creates encoder with the default base", () => {
  assertEquals(defaultEncoder.hexToBase !== undefined, true);
  assertEquals(defaultEncoder.baseToHex !== undefined, true);
  assertEquals(defaultEncoder.hexToBase.get("000"), "AA");
});

test("[ObjectID64.constructor] creates an encoder with a custom base", () => {
  const encoder = new ObjectId64(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
  );
  assertEquals(encoder.hexToBase.get("000"), "aa");
});

test("[ObjectID64.constructor] creates an encoder without lookup tables", () => {
  const encoder = new ObjectId64(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
    true,
  );
  assertEquals(encoder.hexToBase.size, 0);
});

test("[ObjectID64#fromObjectId] encodes an ObjectId hex string into base64", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.fromObjectId(id[0]), id[1]);
  }
});

test("[ObjectID64#fromBinObjectId] encodes an ObjectId into base64", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.fromBinObjectId(id[3]), id[1]);
  }
});

test("[ObjectID64#toObjectId] decodes a base64 string into an ObjectId hex string", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.toObjectId(id[1]), id[0]);
  }
});

test("[ObjectID64#toBinObjectId] decodes a base64 string into an ObjectId", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.toBinObjectId(id[1]), id[3]);
  }
});

test("[ObjectID64#fromUUID] encodes a UUID string into base64", () => {
  for (const id of uuids) {
    assertEquals(defaultEncoder.fromUUID(id[0]), id[1]);
  }
});

test("[ObjectID64#fromBinUUID] encodes a UUID into base64", () => {
  for (const id of uuids) {
    assertEquals(defaultEncoder.fromBinUUID(id[2]), id[1]);
  }
});

test("[ObjectID64#toUUID] decodes a base64 string into a UUID string", () => {
  for (const id of uuids) {
    assertEquals(defaultEncoder.toUUID(id[1]), id[0]);
  }
});

test("[ObjectID64#toBinUUID] decodes a base64 string into a UUID", () => {
  for (const id of uuids) {
    assertEquals(defaultEncoder.toBinUUID(id[1]), id[2]);
  }
});

test("[ObjectID64#fromBigInt] encodes a bigint into base64", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.fromBigInt(id[2]), id[1]);
  }
});

test("[ObjectID64#toBigInt] decodes a base64 string into a bigint", () => {
  for (const id of objectIds) {
    assertEquals(defaultEncoder.toBigInt(id[1]), id[2]);
  }
});

test("[ObjectID64#fromInt] encodes an integer into base64", () => {
  for (const id of ints) {
    assertEquals(defaultEncoder.fromInt(id[0]), id[1]);
  }
});

test("[ObjectID64#toInt] decodes a base64 string into an integer", () => {
  for (const id of ints) {
    assertEquals(defaultEncoder.toInt(id[1]), id[0]);
  }
});
