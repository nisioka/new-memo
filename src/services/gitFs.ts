import { openDB, IDBPDatabase } from 'idb';

// This is a simplified fs implementation for isomorphic-git using IndexedDB.
// It stores file contents in one object store and metadata (like modification time) in another.

const DB_NAME = 'GitFSDB';
const DB_VERSION = 1;
const FILE_CONTENT_STORE = 'file_content';
const FILE_META_STORE = 'file_meta';

interface GitFSDB {
  [FILE_CONTENT_STORE]: {
    key: string;
    value: Uint8Array;
  };
  [FILE_META_STORE]: {
    key: string;
    value: any; // For stats like mtime, mode, etc.
  };
}

let db: IDBPDatabase<GitFSDB>;

async function getDB(): Promise<IDBPDatabase<GitFSDB>> {
  if (!db) {
    db = await openDB<GitFSDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        database.createObjectStore(FILE_CONTENT_STORE);
        database.createObjectStore(FILE_META_STORE);
      },
    });
  }
  return db;
}

// Helper to convert path to a valid key
const toKey = (path: string) => path.replace(/\//g, '_');

export const gitFs = {
  promises: {
    async writeFile(filepath: string, data: Uint8Array | string): Promise<void> {
      const db = await getDB();
      const tx = db.transaction([FILE_CONTENT_STORE, FILE_META_STORE], 'readwrite');
      const content = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      await tx.objectStore(FILE_CONTENT_STORE).put(content, toKey(filepath));
      // Update metadata
      const stats = { mtimeMs: Date.now(), mode: 0o100644, size: content.byteLength };
      await tx.objectStore(FILE_META_STORE).put(stats, toKey(filepath));
      await tx.done;
    },

    async readFile(filepath: string): Promise<Uint8Array> {
      const db = await getDB();
      const data = await db.get(FILE_CONTENT_STORE, toKey(filepath));
      if (!data) {
        throw new Error(`ENOENT: no such file or directory, open '${filepath}'`);
      }
      return data;
    },

    async unlink(filepath: string): Promise<void> {
      const db = await getDB();
      const tx = db.transaction([FILE_CONTENT_STORE, FILE_META_STORE], 'readwrite');
      await tx.objectStore(FILE_CONTENT_STORE).delete(toKey(filepath));
      await tx.objectStore(FILE_META_STORE).delete(toKey(filepath));
      await tx.done;
    },

    async stat(filepath: string): Promise<any> {
      const db = await getDB();
      const stats = await db.get(FILE_META_STORE, toKey(filepath));
      if (!stats) {
        throw new Error(`ENOENT: no such file or directory, stat '${filepath}'`);
      }
      return stats;
    },

    async readdir(filepath: string): Promise<string[]> {
        const db = await getDB();
        const allKeys = await db.getAllKeys(FILE_CONTENT_STORE);
        // This is a simplified implementation. It doesn't handle directories properly
        // and just returns all file paths.
        return allKeys.map(key => key.toString().replace(/_/g, '/'));
    },
    
    // mkdir, rmdir are no-ops for this simple key-value store fs
    async mkdir(filepath: string): Promise<void> {
        return Promise.resolve();
    },

    async rmdir(filepath: string): Promise<void> {
        return Promise.resolve();
    },
  },
};
