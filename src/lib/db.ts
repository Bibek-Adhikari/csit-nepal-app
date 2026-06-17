const DB_NAME = "bca-nepal-offline";
const DB_VERSION = 3;
const STORE_NAME = "pdfs";
const SYNC_STORE = "sync-queue";

export interface StoredPDF {
  id: string;
  title: string;
  url: string;
  semester: string;
  subject: string;
  unit: string;
  blob: Blob;
  savedAt: number;
  bookmarked: boolean;
}

export interface SyncItem {
  id: string;
  type: "bookmark" | "progress";
  data: Record<string, unknown>;
  createdAt: number;
  synced: boolean;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("semester", "semester");
        store.createIndex("subject", "subject");
        store.createIndex("bookmarked", "bookmarked");
      }
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const syncStore = db.createObjectStore(SYNC_STORE, { keyPath: "id" });
        syncStore.createIndex("type", "type");
        syncStore.createIndex("synced", "synced");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePDF(
  id: string,
  title: string,
  url: string,
  semester: string,
  subject: string,
  unit: string,
  blob: Blob
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      store.put({
        id,
        title,
        url,
        semester,
        subject,
        unit,
        blob,
        savedAt: Date.now(),
        bookmarked: existing ? existing.bookmarked : false,
      });
    };
    getReq.onerror = () => {
      store.put({ id, title, url, semester, subject, unit, blob, savedAt: Date.now(), bookmarked: false });
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateBookmark(id: string, bookmarked: boolean): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => {
      const data = req.result;
      if (data) {
        data.bookmarked = bookmarked;
        tx.objectStore(STORE_NAME).put(data);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePDF(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPDF(id: string): Promise<StoredPDF | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result || undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPDFs(): Promise<StoredPDF[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getBookmarkedPDFs(): Promise<StoredPDF[]> {
  const all = await getAllPDFs();
  return all.filter((p) => p.bookmarked).sort((a, b) => b.savedAt - a.savedAt);
}

export async function isPDFStored(id: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).count(id);
    req.onsuccess = () => resolve(req.result > 0);
    req.onerror = () => reject(req.error);
  });
}

export async function getStorageUsage(): Promise<{ used: number; quota: number }> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    return { used: usage || 0, quota: quota || 0 };
  }
  return { used: 0, quota: 0 };
}

export async function requestPersistentStorage(): Promise<boolean> {
  if ("storage" in navigator && "persist" in navigator.storage) {
    return navigator.storage.persist();
  }
  return false;
}

export async function addSyncItem(type: "bookmark" | "progress", data: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, "readwrite");
    tx.objectStore(SYNC_STORE).put({
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      data,
      createdAt: Date.now(),
      synced: false,
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingSyncItems(): Promise<SyncItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, "readonly");
    const req = tx.objectStore(SYNC_STORE).getAll();
    req.onsuccess = () => {
      const items = (req.result || []) as SyncItem[];
      resolve(items.filter((item) => !item.synced));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function markSynced(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, "readwrite");
    const req = tx.objectStore(SYNC_STORE).get(id);
    req.onsuccess = () => {
      const data = req.result;
      if (data) {
        data.synced = true;
        tx.objectStore(SYNC_STORE).put(data);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearOldSyncItems(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  const db = await openDB();
  const cutoff = Date.now() - maxAge;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, "readwrite");
    const store = tx.objectStore(SYNC_STORE);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const item = cursor.value as SyncItem;
        if (item.synced || item.createdAt < cutoff) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
