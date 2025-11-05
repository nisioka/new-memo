import { create } from 'zustand';
import type { User } from '../types';
import { cryptoService } from '../services/cryptoService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  encryptionKey: CryptoKey | null;
  encryptedToken: { iv: Uint8Array; encryptedData: ArrayBuffer } | null;
  setUser: (user: User | null) => void;
  setEncryptionKey: (key: CryptoKey | null) => void;
  setEncryptedToken: (token: { iv: Uint8Array; encryptedData: ArrayBuffer } | null) => void;
  getDecryptedToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  encryptionKey: null,
  encryptedToken: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setEncryptionKey: (key) => set({ encryptionKey: key }),

  setEncryptedToken: (token) => set({ encryptedToken: token }),

  getDecryptedToken: async () => {
    const { encryptedToken, encryptionKey } = get();
    if (encryptedToken && encryptionKey) {
      try {
        return await cryptoService.decrypt(encryptedToken.encryptedData, encryptionKey, encryptedToken.iv);
      } catch (error) {
        console.error('Failed to decrypt token:', error);
        return null;
      }
    }
    return null;
  },
}));
