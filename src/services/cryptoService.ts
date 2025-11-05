/**
 * Web Crypto API を使用した暗号化・復号化サービス
 */
export const cryptoService = {
  async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  },

  async encrypt(data: string, key: CryptoKey): Promise<{ iv: Uint8Array; encryptedData: ArrayBuffer }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    return { iv, encryptedData };
  },

  async decrypt(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  },
};
