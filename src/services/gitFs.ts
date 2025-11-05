import FS from '@isomorphic-git/lightning-fs';

export function createGitFs() {
  return new FS('git-memo-fs');
}
