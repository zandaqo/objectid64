const Benchmark = require('benchmark');
const base64 = require('base64-mongo-id');
const intEncoder = require('int-encoder');
const encoder = require('./index')();

const ids = ['581653766c5dbc10f0aceb55',
  '581653766c5dbc10f0aceb56',
  '581653766c5dbc10f0aceb57',
  '581653766c5dbc10f0aceb58',
  '581653766c5dbc10f0aceb59',
  '581653766c5dbc10f0aceb5a',
  '581653766c5dbc10f0aceb5b',
  '581653766c5dbc10f0aceb5c',
  '581653766c5dbc10f0aceb5d',
  '581653766c5dbc10f0aceb5e',
  '581653766c5dbc10f0aceb5f',
  '581653766c5dbc10f0aceb60',
  '581653766c5dbc10f0aceb61',
  '581653766c5dbc10f0aceb62',
  '581653766c5dbc10f0aceb63',
  '581653766c5dbc10f0aceb64',
  '581653766c5dbc10f0aceb65',
  '581653766c5dbc10f0aceb66',
  '581653766c5dbc10f0aceb67',
  '581653766c5dbc10f0aceb68',
  '581653766c5dbc10f0aceb69',
  '581653766c5dbc10f0aceb6a'];

const suite = new Benchmark.Suite();
suite.add('ObjectID64', () => {
  const id = ids[Math.floor(Math.random() * ids.length)];
  const encoded = encoder.encode(id);
  const decoded = encoder.decode(encoded);
})
  .add('Buffer', () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = new Buffer(id, 'hex').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    const decoded = new Buffer(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('hex');
  })
  .add('base64-mongo-id', () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = base64.toBase64(id);
    const decoded = base64.toHex(encoded);
  })
  .add('int-encoder', () => {
    const id = ids[Math.floor(Math.random() * ids.length)];
    const encoded = intEncoder.encode(id, 16);
    const decoded = intEncoder.decode(encoded, 16);
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', (event) => {
    console.log(`Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
  })
  .run();
