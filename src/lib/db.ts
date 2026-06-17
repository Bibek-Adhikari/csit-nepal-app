const DB_NAME = "bca-nepal-offline";
const DB_VERSION = 2;
const STORE_NAME = "pdfs";

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

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("semester", "semester");
        store.createIndex("subject", "subject");
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
