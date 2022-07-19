const defaultBase =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Encodes and decodes hex strings of MongoDB's ObjectIDs, UUIDs,
 * as well as simple numbers and bigints to and from base64.
 */
export class ObjectId64 {
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
      const base64 = base[i >> 6] + base[i % 64];
      this.hexToBase[hex] = base64;
      this.baseToHex[base64] = hex;
    }
  }

  /**
   * Encodes a given ObjectId hex string into a base64 string.
   *
   * @param objectId the ObjectId hex string to encode
   * @returns encoded base64 string
   */
  fromObjectId(objectId: string): string {
    const { hexToBase } = this;
    return (
      hexToBase[objectId.slice(0, 3)] +
      hexToBase[objectId.slice(3, 6)] +
      hexToBase[objectId.slice(6, 9)] +
      hexToBase[objectId.slice(9, 12)] +
      hexToBase[objectId.slice(12, 15)] +
      hexToBase[objectId.slice(15, 18)] +
      hexToBase[objectId.slice(18, 21)] +
      hexToBase[objectId.slice(21, 24)]
    );
  }

  /**
   * Decodes a given base64 string into an ObjectId hex string.
   *
   * @param id the base64 string to decode
   * @returns decoded ObjectId hex string
   */
  toObjectId(id: string): string {
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

  /**
   * Encodes a given UUID hex string into a base64 string.
   *
   * @param uuid the UUID hex string to encode
   * @returns encoded base64 string
   */
  fromUUID(uuid: string): string {
    const { hexToBase } = this;
    return (
      hexToBase[uuid.slice(0, 3)] +
      hexToBase[uuid.slice(3, 6)] +
      hexToBase[uuid.slice(6, 8) + uuid.slice(9, 10)] +
      hexToBase[uuid.slice(10, 13)] +
      hexToBase[uuid.slice(14, 17)] +
      hexToBase[uuid.slice(17, 18) + uuid.slice(19, 21)] +
      hexToBase[uuid.slice(21, 23) + uuid.slice(24, 25)] +
      hexToBase[uuid.slice(25, 28)] +
      hexToBase[uuid.slice(28, 31)] +
      hexToBase[uuid.slice(31, 34)] +
      hexToBase["0" + uuid.slice(34, 36)]
    );
  }

  /**
   * Decodes a given base64 string into a UUID hex string.
   *
   * @param id the base64 string to decode
   * @returns decoded UUID hex string
   */
  toUUID(id: string): string {
    const { baseToHex } = this;
    let slice = "";
    return (
      baseToHex[id.slice(0, 2)] +
      baseToHex[id.slice(2, 4)] +
      (slice = baseToHex[id.slice(4, 6)],
        slice.slice(0, 2) + "-" + slice.slice(2)) +
      baseToHex[id.slice(6, 8)] +
      "-" +
      baseToHex[id.slice(8, 10)] +
      (slice = baseToHex[id.slice(10, 12)],
        slice.slice(0, 1) + "-" + slice.slice(1)) +
      (slice = baseToHex[id.slice(12, 14)],
        slice.slice(0, 2) + "-" + slice.slice(2)) +
      baseToHex[id.slice(14, 16)] +
      baseToHex[id.slice(16, 18)] +
      baseToHex[id.slice(18, 20)] +
      baseToHex[id.slice(20, 22)].slice(1)
    );
  }

  /**
   * Encodes a positive number into a base64 string.
   *
   * @param integer the number to encode
   * @returns encoded base64 string
   */
  fromInt(integer: number): string {
    const { base } = this;
    let n = integer;
    const d = [];
    while (n > 0) {
      d.unshift(base[n % 64]);
      n = n >> 6;
    }
    return d.join("");
  }

  /**
   * Decodes a given base64 string into a number.
   *
   * @param id the base64 string to decode
   * @returns decoded number
   */
  toInt(id: string): number {
    const { base } = this;
    let n = 0;
    for (let i = 0; i < id.length; i++) {
      n = (n << 6) + base.indexOf(id[i]);
    }
    return n;
  }

  /**
   * Encodes a positive bigint into a base64 string.
   *
   * @param integer the bigint to encode
   * @returns encoded base64 string
   */
  fromBigInt(integer: bigint): string {
    const { base } = this;
    let n = integer;
    const d = [];
    while (n > 0n) {
      d.unshift(base[Number(n % 64n)]);
      n = n >> 6n;
    }
    return d.join("");
  }

  /**
   * Decodes a given base64 string into a bigint.
   *
   * @param id the base64 string to decode
   * @returns decoded bigint
   */
  toBigInt(id: string): bigint {
    const { base } = this;
    let n = 0n;
    for (let i = 0; i < id.length; i++) {
      n = (n << 6n) + BigInt(base.indexOf(id[i]));
    }
    return n;
  }
}
