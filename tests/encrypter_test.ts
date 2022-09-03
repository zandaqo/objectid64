import { assertEquals } from "./test_deps.ts";
import { Encrypter } from "../encrypter.ts";

const { test } = Deno;
const key = await Encrypter.generateKey();
const defaultEncrypter = new Encrypter(key);

const objectIds = [
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
];

const uuids = [
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
];

test("[Encrypter#fromInt] encrypts an integer into 128 bit id", async () => {
  for (let i = 0; i < 100; i++) {
    const int = (Math.random() * 1000) | 0;
    const id = await defaultEncrypter.fromInt(int);
    assertEquals(id.length, 16);
    assertEquals(id instanceof Uint8Array, true);
  }
});

test("[Encrypter#toInt] decrypts an integer from 128 bit id", async () => {
  for (let i = 0; i < 100; i++) {
    const int = (Math.random() * 1000) | 0;
    const id = await defaultEncrypter.fromInt(int);
    const result = await defaultEncrypter.toInt(id);
    assertEquals(int, result);
  }
});

test("[Encrypter#fromBigInt] encrypts a 64 bit bigint into 128 bit id", async () => {
  for (let i = 0; i < 100; i++) {
    const int = BigInt(Math.random() * 10000000 | 0);
    const id = await defaultEncrypter.fromBigInt(int);
    assertEquals(id.length, 16);
    assertEquals(id instanceof Uint8Array, true);
  }
});

test("[Encrypter#toBigInt] decrypts a 64 bit bigint from 128 bit id", async () => {
  for (let i = 0; i < 100; i++) {
    const int = BigInt(Math.random() * 10000000 | 0);
    const id = await defaultEncrypter.fromBigInt(int);
    const result = await defaultEncrypter.toBigInt(id);
    assertEquals(int, result);
  }
});

test("[Encrypter#fromObjectId] encrypts an ObjectId into 128 bit id", async () => {
  for (const id of objectIds) {
    const encrypted = await defaultEncrypter.fromObjectId(id);
    assertEquals(encrypted.length, 16);
    assertEquals(encrypted instanceof Uint8Array, true);
  }
});

test("[Encrypter#toObjectId] decrypts an ObjectId from 128 bit id", async () => {
  for (const id of objectIds) {
    const encrypted = await defaultEncrypter.fromObjectId(id);
    const decrypted = await defaultEncrypter.toObjectId(encrypted);
    assertEquals(id, decrypted);
  }
});

test("[Encrypter#fromUUID] encrypts a UUID", async () => {
  for (const id of uuids) {
    const encrypted = await defaultEncrypter.fromUUID(id);
    assertEquals(encrypted.length, 16);
    assertEquals(encrypted instanceof Uint8Array, true);
  }
});

test("[Encrypter#toUUID] decrypts a UUID", async () => {
  for (const id of uuids) {
    const encrypted = await defaultEncrypter.fromUUID(id);
    const decrypted = await defaultEncrypter.toUUID(encrypted);
    assertEquals(id, decrypted);
  }
});

test("[Encrypter.importKey] creates an encryption key from a raw key", async () => {
  const raw = await defaultEncrypter.exportKey();
  const key = await Encrypter.importKey(raw);
  assertEquals(key instanceof CryptoKey, true);
  assertEquals(raw, await globalThis.crypto.subtle.exportKey("raw", key));
});
