/**
 * Encrypts and decrypts numerical ids, UUIDs, and ObjectIds
 * to and from 128-bit id values akin to UUID.
 */
export class Encrypter {
  static params: AesCtrParams = {
    name: "AES-CTR",
    counter: globalThis.crypto.getRandomValues(new Uint8Array(16)),
    length: 128,
  };

  #key: CryptoKey;

  /**
   * @param key a key to use for encryption, can be generated using `Ecrypter.generateKey`
   */
  constructor(key: CryptoKey) {
    this.#key = key;
  }

  /**
   * Returns a "raw" binary version of the encryption key used by the Encrypter.
   *
   * @returns a "raw" version of the encryption key
   */
  async exportKey() {
    return await globalThis.crypto.subtle.exportKey("raw", this.#key);
  }

  async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const encrypted = await globalThis.crypto.subtle.encrypt(
      Encrypter.params,
      this.#key,
      data,
    );
    return new Uint8Array(encrypted);
  }

  async decrypt(data: ArrayBufferView): Promise<ArrayBuffer> {
    return await globalThis.crypto.subtle.decrypt(
      Encrypter.params,
      this.#key,
      data,
    );
  }

  /**
   * Encrypts a 32-bit integer id into a 128-bit encrypted id.
   *
   * @param integer the id to encrypt
   * @param view an existing typedarray to use for encryption
   * @returns the encrypted 128-bit id
   */
  async fromInt(
    integer: number,
    view = new Uint8Array(16),
  ): Promise<Uint8Array> {
    const data = globalThis.crypto.getRandomValues(view);
    new DataView(data.buffer).setInt32(0, integer, true);
    return await this.encrypt(data);
  }

  /**
   * Decrypts a 128-bit id into a 32-bit integer id.
   *
   * @param id the 128-bit encrypted id
   * @returns the decrypted 32-bit integer id
   */
  async toInt(id: ArrayBufferView): Promise<number> {
    const decrypted = await this.decrypt(id);
    return new DataView(decrypted).getInt32(0, true);
  }

  /**
   * Encrypts a 64-bit bigint id into a 128-bit encrypted id.
   *
   * @param integer the id to encrypt
   * @param view an existing typedarray to use for encryption
   * @returns the encrypted 128-bit id
   */
  async fromBigInt(
    integer: bigint,
    view = new Uint8Array(16),
  ): Promise<Uint8Array> {
    const data = globalThis.crypto.getRandomValues(view);
    new DataView(data.buffer).setBigInt64(0, integer, true);
    return await this.encrypt(data);
  }

  /**
   * Decrypts a 128-bit id into a 64-bit bigint id.
   *
   * @param id the 128-bit encrypted id
   * @returns the decrypted 64-bit integer id
   */
  async toBigInt(id: ArrayBufferView): Promise<bigint> {
    const decrypted = await this.decrypt(id);
    return new DataView(decrypted).getBigInt64(0, true);
  }

  /**
   * Encrypts an Object id into a 128-bit encrypted id.
   *
   * @param id the id to encrypt
   * @param view an existing typedarray to use for encryption
   * @returns the encrypted 128-bit id
   */
  async fromObjectId(
    id: Uint8Array,
    view = new Uint8Array(16),
  ): Promise<Uint8Array> {
    const data = globalThis.crypto.getRandomValues(view);
    data.set(id);
    return await this.encrypt(data);
  }

  /**
   * Decrypts a 128-bit id into an ObjectId.
   *
   * @param id the 128-bit encrypted id
   * @returns the decrypted ObjectId
   */
  async toObjectId(id: ArrayBufferView): Promise<Uint8Array> {
    const decrypted = await this.decrypt(id);
    return new Uint8Array(decrypted.slice(0, 12));
  }

  /**
   * Encrypts a UUID into a 128-bit encrypted id.
   *
   * @param id the id to encrypt
   * @returns the encrypted 128-bit id
   */
  async fromUUID(id: Uint8Array): Promise<Uint8Array> {
    return await this.encrypt(id);
  }

  /**
   * Decrypts a 128-bit id into a UUID.
   *
   * @param id the 128-bit encrypted id
   * @returns the decrypted UUID
   */
  async toUUID(id: ArrayBufferView): Promise<Uint8Array> {
    return new Uint8Array(await this.decrypt(id));
  }

  /**
   * Generates a 128-bit ecryption key for AES encryption of ids.
   *
   * @returns an encryption key
   */
  static async generateKey(): Promise<CryptoKey> {
    return await globalThis.crypto.subtle.generateKey(
      {
        name: "AES-CTR",
        length: 128,
      },
      true,
      ["decrypt", "encrypt"],
    );
  }

  /**
   * Converts a "raw" binary version of an encryption key into a CryptoKey.
   *
   * @param key "raw" version of the encryption key
   * @returns the encryption key
   */
  static async importKey(key: ArrayBuffer) {
    return await globalThis.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CTR" },
      true,
      ["encrypt", "decrypt"],
    );
  }
}
