import {
  bench,
  BenchmarkRunResult,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import {
  decode,
  encode,
} from "https://deno.land/std@0.95.0/encoding/base64.ts";
import mongoid from "https://jspm.dev/base64-mongo-id";
import { ObjectID64 } from "./index.ts";

function getIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

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

function bigIntTo64(hex: string) {
  let n = BigInt(`0x${hex}`);
  const d = new Array(16);
  for (let i = 15; i >= 0; i--) {
    d[i] = encoder.base[Number(n % 64n)];
    n = n / 64n;
  }
  return d.join();
}

function bigIntToHex(base64: string) {
  let n = 0n;
  for (let i = 0; i < base64.length; i++) {
    n = 64n * n + BigInt(encoder.base.indexOf(base64[i]));
  }
  return n.toString(16);
}

bench({
  name: "ObjectID64",
  runs: 100000,
  func(b): void {
    b.start();
    const encoded = encoder.encode(ids[getIndex(ids.length)]);
    const decoded = encoder.decode(encoded);
    b.stop();
  },
});

bench({
  name: "BigInt",
  runs: 100000,
  func(b): void {
    b.start();
    const encoded = bigIntTo64(ids[getIndex(ids.length)]);
    const decoded = bigIntToHex(encoded);
    b.stop();
  },
});

bench({
  name: "base64-mongo-id",
  runs: 100000,
  func(b): void {
    b.start();
    //@ts-ignore deno-lint
    const encoded = mongoid.toBase64(ids[getIndex(ids.length)]);
    //@ts-ignore deno-lint
    const decoded = mongoid.toHex(encoded);
    b.stop();
  },
});

runBenchmarks().then((result: BenchmarkRunResult) => {
  result.results.sort((a, b) => a.totalMs > b.totalMs ? 1 : -1);
  const fastest = result.results[0];
  console.log(`1. ${fastest.name} (${fastest.totalMs}ms) - 100%`);
  for (let i = 1; i < result.results.length; i += 1) {
    const benchmark = result.results[i];
    console.log(
      `${i + 1}. ${benchmark.name} (${benchmark.totalMs}ms) - ${
        (1 / (benchmark.totalMs / fastest.totalMs) * 100).toFixed(2)
      }%`,
    );
  }
}).catch((e) => {
  console.log(e);
});
