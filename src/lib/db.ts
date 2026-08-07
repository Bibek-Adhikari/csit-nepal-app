const DB_NAME = "bca-nepal-offline";
const DB_VERSION = 5;
const STORE_NAME = "pdfs";
const SYNC_STORE = "sync-queue";
const SHARED_STORE = "shared-images";
const PENDING_SHARES_STORE = "pending-shares";

const REQUIRED_STORES = [STORE_NAME, SYNC_STORE, SHARED_STORE, PENDING_SHARES_STORE];

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

function createStores(db: IDBDatabase) {
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
  if (!db.objectStoreNames.contains(SHARED_STORE)) {
    const sharedStore = db.createObjectStore(SHARED_STORE, { keyPath: "id" });
    sharedStore.createIndex("semester", "semester");
    sharedStore.createIndex("subject", "subject");
    sharedStore.createIndex("savedAt", "savedAt");
  }
  if (!db.objectStoreNames.contains(PENDING_SHARES_STORE)) {
    db.createObjectStore(PENDING_SHARES_STORE, { keyPath: "id" });
  }
}

function hasAllStores(db: IDBDatabase): boolean {
  return REQUIRED_STORES.every((s) => db.objectStoreNames.contains(s));
}

function deleteDatabase(): Promise<void> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

async function openDB(): Promise<IDBDatabase> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => createStores(req.result);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("DB open blocked"));
  });

  if (!hasAllStores(db)) {
    db.close();
    await deleteDatabase();
    return new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => createStores(req.result);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  return db;
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
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => {
      const data = req.result;
      if (data) {
        data.bookmarked = bookmarked;
        store.put(data);
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

// ─── Shared Images (Web Share Target) ─────────────────────

export interface SharedImage {
  id: string;
  name: string;
  blob: Blob;
  semester: string;
  subject: string;
  savedAt: number;
}

export interface PendingShare {
  id: string;
  name: string;
  blob: Blob;
  type: string;
  size: number;
  sharedAt: number;
}

export async function savePendingShares(shares: PendingShare[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_SHARES_STORE, "readwrite");
    const store = tx.objectStore(PENDING_SHARES_STORE);
    store.clear();
    let i = 0;
    function putNext() {
      if (i >= shares.length) return;
      const req = store.put(shares[i]);
      req.onsuccess = () => { i++; putNext(); };
      req.onerror = () => reject(req.error);
    }
    putNext();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    setTimeout(() => reject(new Error("savePendingShares timeout")), 8000);
  });
}

export async function getPendingShares(): Promise<PendingShare[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_SHARES_STORE, "readonly");
    const req = tx.objectStore(PENDING_SHARES_STORE).getAll();
    req.onsuccess = () => resolve((req.result || []) as PendingShare[]);
    req.onerror = () => reject(req.error);
  });
}

export async function clearPendingShares(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_SHARES_STORE, "readwrite");
    tx.objectStore(PENDING_SHARES_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveSharedImages(images: SharedImage[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARED_STORE, "readwrite");
    const store = tx.objectStore(SHARED_STORE);
    let i = 0;
    function putNext() {
      if (i >= images.length) return;
      const req = store.put(images[i]);
      req.onsuccess = () => { i++; putNext(); };
      req.onerror = () => reject(req.error);
    }
    putNext();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    setTimeout(() => reject(new Error("saveSharedImages timeout")), 8000);
  });
}

export async function getSharedImages(): Promise<SharedImage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARED_STORE, "readonly");
    const req = tx.objectStore(SHARED_STORE).getAll();
    req.onsuccess = () => resolve((req.result || []) as SharedImage[]);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteSharedImage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARED_STORE, "readwrite");
    tx.objectStore(SHARED_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
