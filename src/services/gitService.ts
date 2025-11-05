import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { createGitFs } from './gitFs';

const gitFs = createGitFs();
import type { GitService, DiffResult } from '../services';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';

const dir = '/'; // Root directory in our virtual file system

export const gitService: GitService = {
  async initRepository() {
    try {
      await git.init({ fs: gitFs, dir });
      console.log('Repository initialized');
    } catch (e) {
      // Already initialized
    }
  },

  async commit(message, files) {
    const user = useAuthStore.getState().user;
    // First, add all files to the staging area
    for (const filepath of files) {
      console.log('gitFs in browser:', gitFs);
      await git.add({ fs: gitFs, dir, filepath });
    }
    // Then, commit
    const sha = await git.commit({
      fs: gitFs,
      dir,
      message,
      author: {
        name: user?.username || 'user',
        email: user?.email || 'user@example.com',
      },
    });
    return sha;
  },

  async getHistory(filePath) {
    const commits = await git.log({ fs: gitFs, dir, filepath: filePath });
    return commits.map((c) => ({
      hash: c.oid,
      message: c.commit.message,
      author: c.commit.author.name,
      date: new Date(c.commit.author.timestamp * 1000),
      files: [], // This would require more complex logic to determine per commit
    }));
  },

  async getDiff(commitA, commitB, filePath) {
    // Implementation for diffing is complex and will be added later.
    console.log(commitA, commitB, filePath);
    return Promise.resolve({} as DiffResult);
  },

  async createBranch(name) {
    await git.branch({ fs: gitFs, dir, ref: name });
  },

  async switchBranch(name) {
    await git.checkout({ fs: gitFs, dir, ref: name });
  },

  async mergeBranch(sourceBranch, targetBranch) {
    const user = useAuthStore.getState().user;
    await git.merge({
      fs: gitFs,
      dir,
      ours: targetBranch,
      theirs: sourceBranch,
      author: {
        name: user?.username || 'user',
        email: user?.email || 'user@example.com',
      },
    });
  },

  async push() {
    const { getDecryptedToken, user } = useAuthStore.getState();
    if (user?.authType !== 'github') {
      throw new Error('GitHub authentication is required to push.');
    }
    const token = await getDecryptedToken();
    if (!token) {
      throw new Error('Authentication token is not available.');
    }
    const { githubRepo } = useSettingsStore.getState().settings;
    if (!githubRepo) {
      throw new Error('GitHub repository URL is not configured.');
    }

    const remotes = await git.listRemotes({ fs: gitFs, dir });
    if (!remotes.some(r => r.remote === 'origin')) {
      await git.addRemote({ fs: gitFs, dir, remote: 'origin', url: githubRepo });
    }

    await git.push({
      fs: gitFs,
      http,
      dir,
      remote: 'origin',
      onAuth: () => ({ username: token }),
      corsProxy: 'https://cors.isomorphic-git.org',
    });
  },

  async pull() {
    const { getDecryptedToken, user } = useAuthStore.getState();
    if (user?.authType !== 'github') {
      throw new Error('GitHub authentication is required to pull.');
    }
    const token = await getDecryptedToken();
    if (!token) {
      throw new Error('Authentication token is not available.');
    }
    const { githubRepo } = useSettingsStore.getState().settings;
    if (!githubRepo) {
      throw new Error('GitHub repository URL is not configured.');
    }

    const remotes = await git.listRemotes({ fs: gitFs, dir });
    if (!remotes.some(r => r.remote === 'origin')) {
      await git.addRemote({ fs: gitFs, dir, remote: 'origin', url: githubRepo });
    }

    await git.pull({
      fs: gitFs,
      http,
      dir,
      remote: 'origin',
      author: {
        name: user?.username || 'user',
        email: user?.email || 'user@example.com',
      },
      onAuth: () => ({ username: token }),
      corsProxy: 'https://cors.isomorphic-git.org',
    });
  },
};
