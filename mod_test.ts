import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { ObjectId64 } from "./mod.ts";

const { test } = Deno;
const defaultEncoder = new ObjectId64();

const objectIds: Array<[string, string, bigint]> = [
  [
    "581653766c5dbc10f0aceb55",
    "WBZTdmxdvBDwrOtV",
    27261671373252370877777767253n,
  ],
  [
    "581653766c5dbc10f0acefff",
    "WBZTdmxdvBDwrO__",
    27261671373252370877777768447n,
  ],
  [
    "581653766c5dbc10f0ace000",
    "WBZTdmxdvBDwrOAA",
    27261671373252370877777764352n,
  ],
];

const uuids = [
  [
    "6d2bb408-3176-42d3-b473-3d251f19569f",
    "bSu0CDF2QtO0cz0lHxlWCf",
  ],
  [
    "ca0b7075-5ca6-44c7-a707-8add4a4a87d2",
    "ygtwdVymRMenB4rdSkqHDS",
  ],
  [
    "b4fc0f24-19fc-40f5-a0e9-f70ddeec78e1",
    "tPwPJBn8QPWg6fcN3ux4Dh",
  ],
  [
    "76955caf-eff1-4eb5-84e0-689737909150",
    "dpVcr-_xTrWE4GiXN5CRBQ",
  ],
  [
    "0abb80ef-d7a2-4095-b35a-af8f67b09555",
    "CruA79eiQJWzWq-PZ7CVBV",
  ],
];

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
  assertEquals(
    defaultEncoder.hexToBase.get("000"),
    "AA",
  );
});

test("[ObjectID64.constructor] creates an encoder with a custom base", () => {
  const encoder = new ObjectId64(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
  );
  assertEquals(
    encoder.hexToBase.get("000"),
    "aa",
  );
});

test("[ObjectID64#fromObjectId] encodes an ObjectId hex string into base64", () => {
  for (const id of objectIds) {
    assertEquals(
      defaultEncoder.fromObjectId(id[0]),
      id[1],
    );
  }
});

test("[ObjectID64#toObjectId] decodes a base64 string into an ObjectId hex string", () => {
  for (const id of objectIds) {
    assertEquals(
      defaultEncoder.toObjectId(id[1]),
      id[0],
    );
  }
});

test("[ObjectID64#fromUUID] encodes a UUID string into base64", () => {
  for (const id of uuids) {
    assertEquals(
      defaultEncoder.fromUUID(id[0]),
      id[1],
    );
  }
});

test("[ObjectID64#toUUID] decodes a base64 string into a UUID string", () => {
  for (const id of uuids) {
    assertEquals(
      defaultEncoder.toUUID(id[1]),
      id[0],
    );
  }
});

test("[ObjectID64#fromBigInt] encodes a bigint into base64", () => {
  for (const id of objectIds) {
    assertEquals(
      defaultEncoder.fromBigInt(id[2]),
      id[1],
    );
  }
});

test("[ObjectID64#toBigInt] decodes a base64 string into a bigint", () => {
  for (const id of objectIds) {
    assertEquals(
      defaultEncoder.toBigInt(id[1]),
      id[2],
    );
  }
});

test("[ObjectID64#fromInt] encodes an integer into base64", () => {
  for (const id of ints) {
    assertEquals(
      defaultEncoder.fromInt(id[0]),
      id[1],
    );
  }
});

test("[ObjectID64#toInt] decodes a base64 string into an integer", () => {
  for (const id of ints) {
    assertEquals(
      defaultEncoder.toInt(id[1]),
      id[0],
    );
  }
});
