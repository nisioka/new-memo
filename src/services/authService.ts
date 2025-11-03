import { AuthService, AuthResult, LocalCredentials } from '../services';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';

export const authService: AuthService = {
  async loginWithGitHub(): Promise<AuthResult> {
    // To be implemented later
    console.log('Login with GitHub');
    return { success: false, error: 'Not implemented' };
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
  },

  getCurrentUser(): User | null {
    return useAuthStore.getState().user;
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },
};
