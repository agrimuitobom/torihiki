import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Exchange, Template } from '../types';

const userCollection = (uid: string, name: string) =>
  collection(db, 'users', uid, name);

export const subscribeExchanges = (uid: string, callback: (items: Exchange[]) => void): Unsubscribe => {
  const q = query(userCollection(uid, 'exchanges'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Exchange));
    callback(items);
  });
};

export const subscribeTemplates = (uid: string, callback: (items: Template[]) => void): Unsubscribe => {
  const q = query(userCollection(uid, 'templates'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Template));
    callback(items);
  });
};

export const addExchange = (uid: string, data: Partial<Exchange>) => {
  const { id: _id, ...rest } = data;
  return addDoc(userCollection(uid, 'exchanges'), {
    ...rest,
    sortOrder: Date.now(),
    createdAt: serverTimestamp(),
  });
};

export const updateExchange = (uid: string, docId: string | number, data: Partial<Exchange>) => {
  const { id: _id, createdAt: _ca, ...rest } = data;
  return updateDoc(doc(db, 'users', uid, 'exchanges', String(docId)), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
};

export const deleteExchangeDoc = (uid: string, docId: string | number) =>
  deleteDoc(doc(db, 'users', uid, 'exchanges', String(docId)));

export const addTemplate = (uid: string, data: Partial<Template>) => {
  const { id: _id, ...rest } = data;
  return addDoc(userCollection(uid, 'templates'), {
    ...rest,
    sortOrder: Date.now(),
    createdAt: serverTimestamp(),
  });
};

export const reorderExchanges = async (uid: string, orderedItems: { id: string | number }[]) => {
  const batch = writeBatch(db);
  orderedItems.forEach((item, index) => {
    batch.update(doc(db, 'users', uid, 'exchanges', String(item.id)), {
      sortOrder: index,
    });
  });
  return batch.commit();
};

export const reorderTemplates = async (uid: string, orderedItems: { id: string | number }[]) => {
  const batch = writeBatch(db);
  orderedItems.forEach((item, index) => {
    batch.update(doc(db, 'users', uid, 'templates', String(item.id)), {
      sortOrder: index,
    });
  });
  return batch.commit();
};

export const updateTemplate = (uid: string, docId: string | number, data: Partial<Template>) => {
  const { id: _id, createdAt: _ca, ...rest } = data;
  return updateDoc(doc(db, 'users', uid, 'templates', String(docId)), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTemplateDoc = (uid: string, docId: string | number) =>
  deleteDoc(doc(db, 'users', uid, 'templates', String(docId)));

export const bulkUpdateExchanges = async (
  uid: string,
  ids: (string | number)[],
  patch: Partial<Exchange>,
) => {
  const { id: _id, createdAt: _ca, ...rest } = patch;
  const batch = writeBatch(db);
  ids.forEach((docId) => {
    batch.update(doc(db, 'users', uid, 'exchanges', String(docId)), {
      ...rest,
      updatedAt: serverTimestamp(),
    });
  });
  return batch.commit();
};

export const bulkDeleteExchanges = async (uid: string, ids: (string | number)[]) => {
  const batch = writeBatch(db);
  ids.forEach((docId) => {
    batch.delete(doc(db, 'users', uid, 'exchanges', String(docId)));
  });
  return batch.commit();
};

export const migrateFromLocalStorage = async (uid: string): Promise<number> => {
  const rawExchanges = localStorage.getItem('exchanges');
  const rawTemplates = localStorage.getItem('templates');
  let migrated = 0;

  if (rawExchanges) {
    const exchanges: Exchange[] = JSON.parse(rawExchanges);
    for (const ex of exchanges) {
      await addExchange(uid, ex);
      migrated++;
    }
  }

  if (rawTemplates) {
    const templates: Template[] = JSON.parse(rawTemplates);
    for (const tpl of templates) {
      await addTemplate(uid, tpl);
      migrated++;
    }
  }

  if (migrated > 0) {
    localStorage.removeItem('exchanges');
    localStorage.removeItem('templates');
  }

  return migrated;
};
