import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import git from 'isomorphic-git';
import { gitService } from '../gitService';
import { createGitFs } from '../gitFs';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { openDB } from 'idb';

let gitFs: ReturnType<typeof createGitFs>;

vi.mock('isomorphic-git/http/web', () => ({
  default: vi.fn(),
}));

describe('Git Operations', () => {
  beforeEach(async () => {
    gitFs = createGitFs(); // Create a fresh gitFs instance for each test
    // Clear the IndexedDB databases before each test
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) {
        await indexedDB.deleteDatabase(db.name);
      }
    }

    // Manually clear the Lightning FS
    try {
      const entries = await gitFs.promises.readdir('/');
      for (const entry of entries) {
        if (entry === '.git') continue; // Don't delete the .git directory itself
        const fullPath = `/${entry}`;
        const stats = await gitFs.promises.stat(fullPath);
        if (stats.isDirectory()) {
          await gitFs.promises.rmdir(fullPath, { recursive: true }); // Use rmdir with recursive for directories
        } else {
          await gitFs.promises.unlink(fullPath);
        }
      }
    } catch (error) {
      // Ignore if directory does not exist or is empty
    }
    await gitFs.promises.mkdir('/', { recursive: true }).catch(() => {}); // Ensure root exists
    await gitService.initRepository();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should commit a file and get history', async () => {
    const filePath = './test.md';
    const content = 'Hello, World!';
    await gitFs.promises.mkdir('/', { recursive: true }).catch(() => {}); // Ensure root exists again
    console.log('Root directory contents before writeFile:', await gitFs.promises.readdir('/'));
    await gitFs.promises.writeFile(filePath, content);

    const commitMessage = 'feat: add test file';
    const sha = await gitService.commit(commitMessage, [filePath]);

    expect(sha).toBeDefined();

    const history = await gitService.getHistory(filePath);
    expect(history.length).toBe(1);
    expect(history[0].message.trim()).toBe(commitMessage);
  });

  it('should throw an error when pushing without auth', async () => {
    await expect(gitService.push()).rejects.toThrow('GitHub authentication is required to push.');
  });

  it('should throw an error when pushing without repo url', async () => {
    useAuthStore.getState().setUser({ id: '1', username: 'test', authType: 'github' });
    useAuthStore.getState().getDecryptedToken = vi.fn().mockResolvedValue('fake-token');
    await expect(gitService.push()).rejects.toThrow('GitHub repository URL is not configured.');
  });
});
