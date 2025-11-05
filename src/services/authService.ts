import type { AuthService, AuthResult, LocalCredentials } from '../services';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types';
import { cryptoService } from './cryptoService';
import { storageService } from './storageService';

export const authService: AuthService = {
  async initAuth(): Promise<void> {
    const key = await storageService.loadCryptoKey();
    const token = await storageService.loadEncryptedToken();

    if (key && token) {
      useAuthStore.getState().setEncryptionKey(key);
      useAuthStore.getState().setEncryptedToken(token);

      const decryptedToken = await useAuthStore.getState().getDecryptedToken();
      if (decryptedToken) {
        // Verify token and fetch user
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `token ${decryptedToken}`,
            },
          });

          if (response.ok) {
            const githubUser = await response.json();
            const user: User = {
              id: githubUser.id.toString(),
              username: githubUser.login,
              email: githubUser.email,
              avatarUrl: githubUser.avatar_url,
              authType: 'github',
            };
            useAuthStore.getState().setUser(user);
          } else {
            // Token is no longer valid, clear it
            await this.logout();
          }
        } catch (error) {
          console.error('Failed to verify token on startup', error);
        }
      }
    }
  },

  async loginWithGitHub(token: string): Promise<AuthResult> {
    if (!token) {
      return { success: false, error: 'GitHub token is required' };
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: `GitHub API error: ${errorData.message || 'Failed to fetch user'}` };
      }

      const githubUser = await response.json();

      let key = useAuthStore.getState().encryptionKey;
      if (!key) {
        key = await cryptoService.generateKey();
        await storageService.saveCryptoKey(key);
        useAuthStore.getState().setEncryptionKey(key);
      }

      const encryptedToken = await cryptoService.encrypt(token, key);
      await storageService.saveEncryptedToken(encryptedToken);
      useAuthStore.getState().setEncryptedToken(encryptedToken);

      const user: User = {
        id: githubUser.id.toString(),
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        authType: 'github',
      };

      useAuthStore.getState().setUser(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: errorMessage };
    }
  },

  async loginLocal(credentials: LocalCredentials): Promise<AuthResult> {
    if (!credentials.username) {
      return { success: false, error: 'Username is required' };
    }
    const user: User = {
      id: `local_${Date.now()}`,
      username: credentials.username,
      authType: 'local',
    };
    useAuthStore.getState().setUser(user);
    return { success: true, user };
  },

  async logout(): Promise<void> {
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setEncryptionKey(null);
    useAuthStore.getState().setEncryptedToken(null);
    await storageService.clearCryptoData();
  },

  getCurrentUser(): User | null {
    return useAuthStore.getState().user;
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },
};
