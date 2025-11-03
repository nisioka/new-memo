/**
 * メモのデータモデル
 */
export interface Memo {
  id: string;
  title: string;
  content: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  lastCommit?: string;
}

/**
 * コミット情報のデータモデル
 */
export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  date: Date;
  files: string[];
}

/**
 * ユーザーのデータモデル
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  accessToken?: string;
  authType: 'github' | 'local';
}

/**
 * アプリケーション設定のデータモデル
 */
export interface AppSettings {
  autoSaveInterval: number; // minutes
  commitMessageTemplate: string;
  defaultBranch: string;
  githubRepo?: string;
  offlineMode: boolean;
  theme: 'light' | 'dark' | 'auto';
}
