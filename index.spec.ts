import { ObjectID64 } from './index';

const defaultEncoder = new ObjectID64();

describe('ObjectID64', () => {
  describe('constructor', () => {
    it('creates encoder with the default base', () => {
      expect(defaultEncoder.hexToBase).toBeDefined();
      expect(defaultEncoder.baseToHex).toBeDefined();
      expect(defaultEncoder.hexToBase['000']).toBe('AA');
    });

    it('creates an encoder with a custom base', () => {
      const base =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
      const encoder = new ObjectID64(base);
      expect(encoder.hexToBase).toBeDefined();
      expect(encoder.baseToHex).toBeDefined();
      expect(encoder.hexToBase['000']).toBe('aa');
    });
  });

  describe('encode', () => {
    it('encodes given hex string into base64', () => {
      expect(defaultEncoder.encode('581653766c5dbc10f0aceb55')).toBe(
        'WBZTdmxdvBDwrOtV',
      );
      expect(defaultEncoder.encode('581653766c5dbc10f0acefff')).toBe(
        'WBZTdmxdvBDwrO__',
      );
      expect(defaultEncoder.encode('581653766c5dbc10f0ace000')).toBe(
        'WBZTdmxdvBDwrOAA',
      );
    });
  });

  describe('decode', () => {
    it('decodes given base64 string into a hex string', () => {
      expect(defaultEncoder.decode('WBZTdmxdvBDwrOtV')).toBe(
        '581653766c5dbc10f0aceb55',
      );
    });
  });
});
