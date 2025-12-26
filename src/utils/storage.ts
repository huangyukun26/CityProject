import { openDB } from "idb";

const DB_NAME = "city-veg-db";
const STORE_NAME = "kv";

const isIdbSupported = "indexedDB" in window;

const dbPromise = isIdbSupported
  ? openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }
    })
  : null;

export const storage = {
  async get<T>(key: string, fallback?: T): Promise<T | undefined> {
    if (dbPromise) {
      const db = await dbPromise;
      const value = (await db.get(STORE_NAME, key)) as T | undefined;
      if (value !== undefined) {
        return value;
      }
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw) as T;
      }
      return fallback;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  },
  async set<T>(key: string, value: T): Promise<void> {
    if (dbPromise) {
      const db = await dbPromise;
      await db.put(STORE_NAME, value, key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    if (dbPromise) {
      const db = await dbPromise;
      await db.delete(STORE_NAME, key);
      return;
    }
    localStorage.removeItem(key);
  }
};
