import git from 'isomorphic-git';
import { gitFs } from './gitFs';
import type { GitService, DiffResult } from '../services';


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
    // First, add all files to the staging area
    for (const filepath of files) {
      await git.add({ fs: gitFs, dir, filepath });
    }
    // Then, commit
    const sha = await git.commit({
      fs: gitFs,
      dir,
      message,
      author: {
        name: 'user', // Placeholder
        email: 'user@example.com', // Placeholder
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
    await git.merge({
      fs: gitFs,
      dir,
      ours: targetBranch,
      theirs: sourceBranch,
      author: {
        name: 'user', // Placeholder
        email: 'user@example.com', // Placeholder
      },
    });
  },

  async push() {
    // Push requires authentication and remote setup, will be implemented later.
    return Promise.resolve();
  },

  async pull() {
    // Pull requires authentication and remote setup, will be implemented later.
    return Promise.resolve();
  },
};
