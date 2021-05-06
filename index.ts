const defaultBase =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64.
 */
export class ObjectID64 {
  /**
   * The the default set of characters for base64
   */
  base: string;
  /**
   * The lookup table for converting base64 to hex
   */
  baseToHex: Record<string, string>;
  /**
   * The lookup table for converting hex to base64
   */
  hexToBase: Record<string, string>;

  /**
   * @param base the set of characters to be used as a base for conversions
   */
  constructor(base: string = defaultBase) {
    this.base = base;
    this.baseToHex = {};
    this.hexToBase = {};
    for (let i = 0; i < 4096; i += 1) {
      const hex = i.toString(16).padStart(3, "0");
      const base64 = base[Math.floor(i / 64)] + base[i % 64];
      this.hexToBase[hex] = base64;
      this.baseToHex[base64] = hex;
    }
  }

  /**
   * Encodes given hex string into base64.
   *
   * @param id the hex string to encode
   * @returns encoded base64 string
   */
  encode(id: string): string {
    const { hexToBase } = this;
    return (
      hexToBase[id.slice(0, 3)] +
      hexToBase[id.slice(3, 6)] +
      hexToBase[id.slice(6, 9)] +
      hexToBase[id.slice(9, 12)] +
      hexToBase[id.slice(12, 15)] +
      hexToBase[id.slice(15, 18)] +
      hexToBase[id.slice(18, 21)] +
      hexToBase[id.slice(21, 24)]
    );
  }

  /**
   * Decodes given base64 string into a hex string.
   *
   * @param id the base64 string to decode
   * @returns decoded hex string
   */
  decode(id: string): string {
    const { baseToHex } = this;
    return (
      baseToHex[id.slice(0, 2)] +
      baseToHex[id.slice(2, 4)] +
      baseToHex[id.slice(4, 6)] +
      baseToHex[id.slice(6, 8)] +
      baseToHex[id.slice(8, 10)] +
      baseToHex[id.slice(10, 12)] +
      baseToHex[id.slice(12, 14)] +
      baseToHex[id.slice(14, 16)]
    );
  }
}
