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
  baseToHex = new Map<string, string>();

  /**
   * The lookup table for converting hex to base64
   */
  hexToBase = new Map<string, string>();

  static initialize(
    base: string,
    baseToHex: Map<string, string>,
    hexToBase: Map<string, string>,
  ): void {
    for (let i = 0; i < 4096; i += 1) {
      const hex = i.toString(16).padStart(3, "0");
      const base64 = base[i >> 6] + base[i & 63];
      hexToBase.set(hex, base64);
      baseToHex.set(base64, hex);
    }
  }

  /**
   * @param base the set of characters to be used as a base for conversions
   * @param noLookup whether to skip creation of the lookup table for hex encoding
   */
  constructor(base: string = defaultBase, noLookup?: boolean) {
    this.base = base;
    if (!noLookup) {
      (this.constructor as typeof ObjectId64).initialize(
        this.base,
        this.baseToHex,
        this.hexToBase,
      );
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
      hexToBase.get(objectId.slice(0, 3))! +
      hexToBase.get(objectId.slice(3, 6)) +
      hexToBase.get(objectId.slice(6, 9)) +
      hexToBase.get(objectId.slice(9, 12)) +
      hexToBase.get(objectId.slice(12, 15)) +
      hexToBase.get(objectId.slice(15, 18)) +
      hexToBase.get(objectId.slice(18, 21)) +
      hexToBase.get(objectId.slice(21, 24))
    );
  }

  /**
   * Encodes a given ObjectId into a base64 string.
   *
   * @param id the ObjectId
   * @returns encoded base64 string
   */
  fromBinObjectId(id: Uint8Array): string {
    const { base } = this;
    return (
      base[id[0] >> 2] +
      base[((id[0] & 0x03) << 4) | (id[1] >> 4)] +
      base[((id[1] & 0x0f) << 2) | (id[2] >> 6)] +
      base[id[2] & 0x3f] +
      base[id[3] >> 2] +
      base[((id[3] & 0x03) << 4) | (id[4] >> 4)] +
      base[((id[4] & 0x0f) << 2) | (id[5] >> 6)] +
      base[id[5] & 0x3f] +
      base[id[6] >> 2] +
      base[((id[6] & 0x03) << 4) | (id[7] >> 4)] +
      base[((id[7] & 0x0f) << 2) | (id[8] >> 6)] +
      base[id[8] & 0x3f] +
      base[id[9] >> 2] +
      base[((id[9] & 0x03) << 4) | (id[10] >> 4)] +
      base[((id[10] & 0x0f) << 2) | (id[11] >> 6)] +
      base[id[11] & 0x3f]
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
      baseToHex.get(id.slice(0, 2))! +
      baseToHex.get(id.slice(2, 4)) +
      baseToHex.get(id.slice(4, 6)) +
      baseToHex.get(id.slice(6, 8)) +
      baseToHex.get(id.slice(8, 10)) +
      baseToHex.get(id.slice(10, 12)) +
      baseToHex.get(id.slice(12, 14)) +
      baseToHex.get(id.slice(14, 16))
    );
  }

  /**
   * Decodes a given base64 string into an ObjectId.
   *
   * @param id the base64 string to decode
   * @returns decoded ObjectId
   */
  toBinObjectId(id: string, binary = new Uint8Array(12)): Uint8Array {
    const { base } = this;
    let code = 0;
    binary[0] = (base.indexOf(id[0]) << 2) |
      (code = base.indexOf(id[1]), code >> 4);
    binary[1] = (code << 4) | (code = base.indexOf(id[2]), code >> 2);
    binary[2] = (code << 6) | base.indexOf(id[3]);
    binary[3] = (base.indexOf(id[4]) << 2) |
      (code = base.indexOf(id[5]), code >> 4);
    binary[4] = (code << 4) | (code = base.indexOf(id[6]), code >> 2);
    binary[5] = (code << 6) | base.indexOf(id[7]);
    binary[6] = (base.indexOf(id[8]) << 2) |
      (code = base.indexOf(id[9]), code >> 4);
    binary[7] = (code << 4) | (code = base.indexOf(id[10]), code >> 2);
    binary[8] = (code << 6) | base.indexOf(id[11]);
    binary[9] = (base.indexOf(id[12]) << 2) |
      (code = base.indexOf(id[13]), code >> 4);
    binary[10] = (code << 4) |
      (code = base.indexOf(id[14]), code >> 2);
    binary[11] = (code << 6) | base.indexOf(id[15]);
    return binary;
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
      hexToBase.get(uuid.slice(0, 3))! +
      hexToBase.get(uuid.slice(3, 6)) +
      hexToBase.get(uuid.slice(6, 8) + uuid.slice(9, 10)) +
      hexToBase.get(uuid.slice(10, 13)) +
      hexToBase.get(uuid.slice(14, 17)) +
      hexToBase.get(uuid.slice(17, 18) + uuid.slice(19, 21)) +
      hexToBase.get(uuid.slice(21, 23) + uuid.slice(24, 25)) +
      hexToBase.get(uuid.slice(25, 28)) +
      hexToBase.get(uuid.slice(28, 31)) +
      hexToBase.get(uuid.slice(31, 34)) +
      hexToBase.get("0" + uuid.slice(34, 36))
    );
  }

  /**
   * Encodes a given UUID into a base64 string.
   *
   * @param id the UUID
   * @returns encoded base64 string
   */
  fromBinUUID(id: Uint8Array): string {
    const { base } = this;
    return (
      this.fromBinObjectId(id) +
      base[id[12] >> 2] +
      base[((id[12] & 0x03) << 4) | (id[13] >> 4)] +
      base[((id[13] & 0x0f) << 2) | (id[14] >> 6)] +
      base[id[14] & 0x3f] +
      base[id[15] >> 6] +
      base[id[15] & 0x3f]
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
      baseToHex.get(id.slice(0, 2))! +
      baseToHex.get(id.slice(2, 4)) +
      (slice = baseToHex.get(id.slice(4, 6))!,
        slice.slice(0, 2) + "-" + slice.slice(2)) +
      baseToHex.get(id.slice(6, 8)) +
      "-" +
      baseToHex.get(id.slice(8, 10)) +
      (slice = baseToHex.get(id.slice(10, 12))!,
        slice.slice(0, 1) + "-" + slice.slice(1)) +
      (slice = baseToHex.get(id.slice(12, 14))!,
        slice.slice(0, 2) + "-" + slice.slice(2)) +
      baseToHex.get(id.slice(14, 16)) +
      baseToHex.get(id.slice(16, 18)) +
      baseToHex.get(id.slice(18, 20)) +
      baseToHex.get(id.slice(20, 22))!.slice(1)
    );
  }

  /**
   * Decodes a given base64 string into a UUID.
   *
   * @param id the base64 string to decode
   * @returns decoded UUID
   */
  toBinUUID(id: string, binary = new Uint8Array(16)): Uint8Array {
    const { base } = this;
    let code = 0;
    this.toBinObjectId(id, binary);
    binary[12] = (base.indexOf(id[16]) << 2) |
      (code = base.indexOf(id[17]), code >> 4);
    binary[13] = (code << 4) |
      (code = base.indexOf(id[18]), code >> 2);
    binary[14] = (code << 6) | base.indexOf(id[19]);
    binary[15] = base.indexOf(id[20]) << 6 | base.indexOf(id[21]);
    return binary;
  }

  /**
   * Encodes a positive number into a base64 string.
   *
   * @param integer the number to encode
   * @returns encoded base64 string
   */
  fromInt(integer: number): string {
    let encoded = "";
    for (let n = integer; n > 0; n >>= 6) {
      encoded = this.base[n & 63] + encoded;
    }
    return encoded;
  }

  /**
   * Decodes a given base64 string into a number.
   *
   * @param id the base64 string to decode
   * @returns decoded number
   */
  toInt(id: string): number {
    let n = 0;
    for (let i = 0; i < id.length; i++) {
      n = (n << 6) + this.base.indexOf(id[i]);
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
    let encoded = "";
    for (let n = integer; n > 0n; n >>= 6n) {
      encoded = this.base[Number(n & 63n)] + encoded;
    }
    return encoded;
  }

  /**
   * Decodes a given base64 string into a bigint.
   *
   * @param id the base64 string to decode
   * @returns decoded bigint
   */
  toBigInt(id: string): bigint {
    let n = 0n;
    for (let i = 0; i < id.length; i++) {
      n = (n << 6n) + BigInt(this.base.indexOf(id[i]));
    }
    return n;
  }
}
