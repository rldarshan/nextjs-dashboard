import { openDB, IDBPDatabase } from 'idb'
import FormState from './page'

let db: IDBPDatabase | null = null;

export async function initDB() {
  db = await openDB('FormDataDB', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('formData')) {
        database.createObjectStore('formData', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function saveFormData(data: any) {
  if (!db) await initDB();
  const tx = db!.transaction('formData', 'readwrite');
  const store = tx.objectStore('formData');
  await store.put(data);
  await tx.done;
}

export const addDataToDB = async (data: Record<string, any>) => {
  // const db = await initDB();
  await db?.put('formData', data);
};

export async function getAllFormData() {
  if (!db) await initDB();
  const tx = db!.transaction('formData', 'readonly');
  const store = tx.objectStore('formData');
  const data = await store.getAll();
  await tx.done;
  return data;
}

// export async function getFileData(id:number) {
//   const tx = db!.transaction('formData', 'readonly');
//   const store = tx.objectStore('formData');
//   const data = await store.get(id);
//   await tx.done;
//   return data.file;
// }

export function getDB(){
  return db
}

export async function deleteFormData(ids: number[]) {
  if (!db) await initDB();
  const tx = db!.transaction('formData', 'readwrite');
  const store = tx.objectStore('formData');
  for (const id of ids) {
    await store.delete(id);
  }
  await tx.done;
}
