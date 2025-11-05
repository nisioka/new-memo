import { describe, it, expect, vi, afterEach } from 'vitest';
import { authService } from '../../services/authService';
import { useAuthStore } from '../authStore';

global.fetch = vi.fn();

describe('Authentication Flow', () => {
  afterEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().setUser(null);
  });

  it('should login with GitHub and store user info', async () => {
    const mockToken = 'fake-github-token';
    const mockGithubUser = {
      id: 123,
      login: 'testuser',
      email: 'test@example.com',
      avatar_url: 'https://example.com/avatar.png',
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGithubUser),
    });

    const result = await authService.loginWithGitHub(mockToken);

    expect(result.success).toBe(true);
    expect(result.user?.username).toBe('testuser');

    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user?.username).toBe('testuser');
  });

  it('should handle GitHub login failure', async () => {
    const mockToken = 'invalid-token';

    (fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Bad credentials' }),
    });

    const result = await authService.loginWithGitHub(mockToken);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Bad credentials');

    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(false);
  });

  it('should logout correctly', async () => {
    // First, login a user
    useAuthStore.getState().setUser({ id: '1', username: 'test', authType: 'local' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await authService.logout();

    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
  });
});
