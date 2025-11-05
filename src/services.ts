import type { User, Memo, CommitInfo, AppSettings } from './types';

/**
 * 認証結果
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * ローカル認証情報
 */
export interface LocalCredentials {
  username: string;
}

/**
 * 認証サービスのインターフェース
 */
export interface AuthService {
  loginWithGitHub(): Promise<AuthResult>;
  loginLocal(credentials: LocalCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

/**
 * メモ管理サービスのインターフェース
 */
export interface MemoService {
  createMemo(title: string, content: string): Promise<Memo>;
  updateMemo(id: string, content: string): Promise<Memo>;
  deleteMemo(id: string): Promise<void>;
  getMemo(id: string): Promise<Memo>;
  listMemos(): Promise<Memo[]>;
}

/**
 * Git差分結果
 */
export interface DiffResult {
  // TBD: Define diff result structure
}

/**
 * Git操作サービスのインターフェース
 */
export interface GitService {
  initRepository(): Promise<void>;
  commit(message: string, files: string[]): Promise<string>;
  getHistory(filePath?: string): Promise<CommitInfo[]>;
  getDiff(commitA: string, commitB: string, filePath?: string): Promise<DiffResult>;
  createBranch(name: string): Promise<void>;
  switchBranch(name: string): Promise<void>;
  mergeBranch(sourceBranch: string, targetBranch: string): Promise<void>;
  push(): Promise<void>;
  pull(): Promise<void>;
}

/**
 * 同期結果
 */
export interface SyncResult {
  success: boolean;
  details?: string;
}

/**
 * 同期サービスのインターフェース
 */
export interface SyncService {
  syncToGitHub(): Promise<SyncResult>;
  syncFromGitHub(): Promise<SyncResult>;
  enableAutoSync(interval: number): void;
  disableAutoSync(): void;
  getLastSyncTime(): Date | null;
}

/**
 * ストレージサービスのインターフェース
 */
export interface StorageService {
  saveMemo(memo: Memo): Promise<void>;
  loadMemo(id: string): Promise<Memo | null>;
  loadAllMemos(): Promise<Memo[]>;
  saveSettings(settings: AppSettings): Promise<void>;
  loadSettings(): Promise<AppSettings>;
  clearCache(): Promise<void>;
}
