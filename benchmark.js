import Benchmark from "benchmark";
import base64 from "base64-mongo-id";
import intEncoder from "int-encoder";
import { ObjectID64 } from "./index.js";

const encoder = new ObjectID64();

const ids = [
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

function bigIntTo64(hex) {
  let n = BigInt(`0x${hex}`);
  const d = new Array(16);
  for (let i = 15; i >= 0; i--) {
    d[i] = encoder.base[n % 64n];
    n = n / 64n;
  }
  return d.join();
}

function bigIntToHex(base64) {
  let n = 0n;
  for (let i = 0; i < base64.length; i++) {
    n = 64n * n + BigInt(encoder.base.indexOf(base64[i]));
  }
  return n.toString(16);
}

const suite = new Benchmark.Suite();
suite
  .add("ObjectID64", () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = encoder.encode(id);
    const decoded = encoder.decode(encoded);
  })
  .add("Buffer", () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = Buffer.from(id, "hex").toString("base64url");
    const decoded = Buffer.from(encoded, "base64url").toString("hex");
  })
  .add("base64-mongo-id", () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = base64.toBase64(id);
    const decoded = base64.toHex(encoded);
  })
  .add("BigInt", () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = bigIntTo64(id);
    const decoded = bigIntToHex(encoded);
  })
  .add("int-encoder", () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = intEncoder.encode(id, 16);
    const decoded = intEncoder.decode(encoded, 16);
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", (event) => {
    console.log(
      `Fastest is ${event.currentTarget.filter("fastest").map("name")}`,
    );
  })
  .run();
