/**
 * Encodes and decodes hex strings of MongoDB's ObjectIDs to and from base64.
 */
class ObjectID64 {
  /**
   * @param {string} [base] the set of characters to be used as a base for conversions
   */
  constructor(base) {
    if (!base) {
      if (!ObjectID64.hexToBase) {
        [
          ObjectID64.hexToBase,
          ObjectID64.baseToHex,
        ] = this.constructor.fillDictionaries();
      }
      this.hexToBase = ObjectID64.hexToBase;
      this.baseToHex = ObjectID64.baseToHex;
    } else {
      [this.hexToBase, this.baseToHex] = this.constructor.fillDictionaries(
        base
      );
    }
  }

  /**
   * Encodes given hex string into base64.
   *
   * @param {string} id the hex string to encode
   * @returns {string} encoded base64 string
   */
  encode(id) {
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
   * @param {string} id the base64 string to decode
   * @returns {string} decoded hex string
   */
  decode(id) {
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
   * Prepares lookup tables for the given base.
   *
   * @param {string} characters the set of characters to use as a base for base64
   * @returns {Array} lookup tables for converting base64 to hex and vice versa
   */
  static fillDictionaries(characters = this.base) {
    const hexToBase = {};
    const baseToHex = {};
    for (let i = 0; i < 4096; i += 1) {
      const hex = i.toString(16).padStart(3, "0");
      const base64 = characters[Math.floor(i / 64)] + characters[i % 64];
      hexToBase[hex] = base64;
      baseToHex[base64] = hex;
    }
    return [hexToBase, baseToHex];
  }
}

/**
 * The lookup table for converting hex to base64
 * @private
 * @type {Object<string, string>}
 */
ObjectID64.hexToBase = undefined;

/**
 * The lookup table for converting base64 to hex
 * @private
 * @type {Object<string, string>}
 */
ObjectID64.baseToHex = undefined;

/**
 * The the default set of characters for base64
 * @private
 * @type {string}
 */
ObjectID64.base =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

module.exports = (base) => new ObjectID64(base);
