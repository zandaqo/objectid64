import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { ObjectID64 } from "./index.ts";

const defaultEncoder = new ObjectID64();

Deno.test("[ObjectID64.constructor] creates encoder with the default base", () => {
  assertEquals(defaultEncoder.hexToBase !== undefined, true);
  assertEquals(defaultEncoder.baseToHex !== undefined, true);
  assertEquals(
    defaultEncoder.hexToBase["000"],
    "AA",
  );
});

Deno.test("[ObjectID64.constructor] creates an encoder with a custom base", () => {
  const encoder = new ObjectID64(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
  );
  assertEquals(
    encoder.hexToBase["000"],
    "aa",
  );
});

Deno.test("[ObjectID64#encode] encodes given hex string into base64", () => {
  const ids = [
    ["581653766c5dbc10f0aceb55", "WBZTdmxdvBDwrOtV"],
    ["581653766c5dbc10f0acefff", "WBZTdmxdvBDwrO__"],
    ["581653766c5dbc10f0ace000", "WBZTdmxdvBDwrOAA"],
  ];
  for (const id of ids) {
    assertEquals(
      defaultEncoder.encode(id[0]),
      id[1],
    );
  }
});

Deno.test("[ObjectID64#decode] decodes given base64 string into a hex string", () => {
  const ids = [
    ["581653766c5dbc10f0aceb55", "WBZTdmxdvBDwrOtV"],
    ["581653766c5dbc10f0acefff", "WBZTdmxdvBDwrO__"],
    ["581653766c5dbc10f0ace000", "WBZTdmxdvBDwrOAA"],
  ];
  for (const id of ids) {
    assertEquals(
      defaultEncoder.decode(id[1]),
      id[0],
    );
  }
});
