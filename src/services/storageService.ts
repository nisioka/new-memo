import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Memo, AppSettings } from '../types';
import type { StorageService } from '../services';

const DB_NAME = 'GitMemoDB';
const DB_VERSION = 1;
const MEMO_STORE = 'memos';
const SETTINGS_STORE = 'settings';

interface MemoDB extends DBSchema {
  [MEMO_STORE]: {
    key: string;
    value: Memo;
  };
  [SETTINGS_STORE]: {
    key: string;
    value: AppSettings;
  };
}

let db: IDBPDatabase<MemoDB>;

async function getDB(): Promise<IDBPDatabase<MemoDB>> {
  if (!db) {
    db = await openDB<MemoDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        database.createObjectStore(MEMO_STORE, { keyPath: 'id' });
        database.createObjectStore(SETTINGS_STORE);
      },
    });
  }
  return db;
}

export const storageService: StorageService = {
  async saveMemo(memo) {
    const db = await getDB();
    await db.put(MEMO_STORE, memo);
  },

  async loadMemo(id) {
    const db = await getDB();
    return (await db.get(MEMO_STORE, id)) || null;
  },

  async loadAllMemos() {
    const db = await getDB();
    return await db.getAll(MEMO_STORE);
  },

  async saveSettings(settings) {
    const db = await getDB();
    // There is only one settings object, so we use a fixed key.
    await db.put(SETTINGS_STORE, settings, 'default');
  },

  async loadSettings() {
    const db = await getDB();
    const settings = await db.get(SETTINGS_STORE, 'default');
    // Returning a default object if no settings are found
    return settings || {} as AppSettings;
  },

  async clearCache() {
    const db = await getDB();
    await db.clear(MEMO_STORE);
    await db.clear(SETTINGS_STORE);
  },
};
