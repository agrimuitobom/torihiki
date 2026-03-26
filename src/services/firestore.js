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
} from 'firebase/firestore';
import { db } from '../firebase';

const userCollection = (uid, name) =>
  collection(db, 'users', uid, name);

export const subscribeExchanges = (uid, callback) => {
  const q = query(userCollection(uid, 'exchanges'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const subscribeTemplates = (uid, callback) => {
  const q = query(userCollection(uid, 'templates'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const addExchange = (uid, data) => {
  const { id: _id, ...rest } = data;
  return addDoc(userCollection(uid, 'exchanges'), {
    ...rest,
    sortOrder: Date.now(),
    createdAt: serverTimestamp(),
  });
};

export const updateExchange = (uid, docId, data) => {
  const { id: _id, createdAt: _ca, ...rest } = data;
  return updateDoc(doc(db, 'users', uid, 'exchanges', docId), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
};

export const deleteExchangeDoc = (uid, docId) =>
  deleteDoc(doc(db, 'users', uid, 'exchanges', docId));

export const addTemplate = (uid, data) => {
  const { id: _id, ...rest } = data;
  return addDoc(userCollection(uid, 'templates'), {
    ...rest,
    sortOrder: Date.now(),
    createdAt: serverTimestamp(),
  });
};

export const reorderExchanges = async (uid, orderedItems) => {
  const batch = writeBatch(db);
  orderedItems.forEach((item, index) => {
    batch.update(doc(db, 'users', uid, 'exchanges', item.id), {
      sortOrder: index,
    });
  });
  return batch.commit();
};

export const reorderTemplates = async (uid, orderedItems) => {
  const batch = writeBatch(db);
  orderedItems.forEach((item, index) => {
    batch.update(doc(db, 'users', uid, 'templates', item.id), {
      sortOrder: index,
    });
  });
  return batch.commit();
};

export const updateTemplate = (uid, docId, data) => {
  const { id: _id, createdAt: _ca, ...rest } = data;
  return updateDoc(doc(db, 'users', uid, 'templates', docId), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTemplateDoc = (uid, docId) =>
  deleteDoc(doc(db, 'users', uid, 'templates', docId));

export const migrateFromLocalStorage = async (uid) => {
  const rawExchanges = localStorage.getItem('exchanges');
  const rawTemplates = localStorage.getItem('templates');
  let migrated = 0;

  if (rawExchanges) {
    const exchanges = JSON.parse(rawExchanges);
    for (const ex of exchanges) {
      await addExchange(uid, ex);
      migrated++;
    }
  }

  if (rawTemplates) {
    const templates = JSON.parse(rawTemplates);
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
