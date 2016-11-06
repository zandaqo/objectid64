function pad(hex) {
  return hex.length === 2 ? `0${hex}` : hex.length === 1 ? `00${hex}` : hex;
}

class ObjectID64 {
  constructor(base) {
    if (!base) {
      if (!ObjectID64.hexToBase) {
        [ObjectID64.hexToBase, ObjectID64.baseToHex] = this.constructor.fillDictionaries();
      }
      this.hexToBase = ObjectID64.hexToBase;
      this.baseToHex = ObjectID64.baseToHex;
    } else {
      [this.hexToBase, this.baseToHex] = this.constructor.fillDictionaries(base);
    }
  }

  encode(id) {
    return this.hexToBase[id.slice(0, 3)] + this.hexToBase[id.slice(3, 6)] +
      this.hexToBase[id.slice(6, 9)] + this.hexToBase[id.slice(9, 12)] +
      this.hexToBase[id.slice(12, 15)] + this.hexToBase[id.slice(15, 18)] +
      this.hexToBase[id.slice(18, 21)] + this.hexToBase[id.slice(21, 24)];
  }

  decode(id) {
    return this.baseToHex[id.slice(0, 2)] + this.baseToHex[id.slice(2, 4)] +
      this.baseToHex[id.slice(4, 6)] + this.baseToHex[id.slice(6, 8)] +
      this.baseToHex[id.slice(8, 10)] + this.baseToHex[id.slice(10, 12)] +
      this.baseToHex[id.slice(12, 14)] + this.baseToHex[id.slice(14, 16)];
  }

  static fillDictionaries(characters = this.base) {
    const hexToBase = {};
    const baseToHex = {};
    for (let i = 0; i < 4095; i += 1) {
      let hex = (i).toString(16);
      if (hex.length !== 3) hex = pad(hex);
      const base64 = characters[Math.floor(i / 64)] + characters[i % 64];
      hexToBase[hex] = base64;
      baseToHex[base64] = hex;
    }
    return [hexToBase, baseToHex];
  }
}

ObjectID64.hexToBase = undefined;
ObjectID64.baseToHex = undefined;
ObjectID64.base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

module.exports = base => new ObjectID64(base);
