import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('should set user and isAuthenticated correctly', () => {
    const user = { id: '1', username: 'testuser', authType: 'local' as const };
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('should clear user and set isAuthenticated to false on logout', () => {
    const user = { id: '1', username: 'testuser', authType: 'local' as const };
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
