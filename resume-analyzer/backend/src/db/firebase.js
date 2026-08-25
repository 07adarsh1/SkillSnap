import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { config } from '../config/index.js';

class MockCursor {
  constructor(data) {
    this.data = data;
  }

  sort(key, direction) {
    const reverse = direction === -1;
    this.data.sort((a, b) => {
      const valA = a[key] || '';
      const valB = b[key] || '';
      if (valA < valB) return reverse ? 1 : -1;
      if (valA > valB) return reverse ? -1 : 1;
      return 0;
    });
    return this;
  }

  async toList(length) {
    return length ? this.data.slice(0, length) : this.data;
  }
}

function matchesQuery(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, value] of Object.entries(query)) {
    if (key === '$or') {
      if (!Array.isArray(value)) return false;
      return value.some((cond) => matchesQuery(doc, cond));
    }
    if (doc[key] !== value) return false;
  }
  return true;
}

class MockCollection {
  constructor() {
    this.data = [];
  }

  async insertOne(document) {
    this.data.push({ ...document });
    return true;
  }

  async findOne(query) {
    return this.data.find((doc) => matchesQuery(doc, query)) || null;
  }

  async updateOne(query, update) {
    const doc = await this.findOne(query);
    if (doc && update && update.$set) {
      Object.assign(doc, update.$set);
    }
    return true;
  }

  find(query) {
    const results = this.data.filter((doc) => matchesQuery(doc, query));
    return new MockCursor(results);
  }

  async deleteOne(query) {
    const idx = this.data.findIndex((doc) => matchesQuery(doc, query));
    if (idx !== -1) {
      this.data.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
}

class MockDatabase {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection());
    }
    return this.collections.get(name);
  }
}

class FirestoreCollectionWrapper {
  constructor(collectionRef) {
    this.collectionRef = collectionRef;
  }

  async insertOne(document) {
    const docId = String(document.id || document._id || Date.now());
    const payload = { ...document, id: docId };
    await this.collectionRef.doc(docId).set(payload);
    return true;
  }

  async findOne(query) {
    const snapshot = await this.collectionRef.get();
    for (const doc of snapshot.docs) {
      const data = doc.data() || {};
      if (matchesQuery(data, query)) {
        return data;
      }
    }
    return null;
  }

  async updateOne(query, update) {
    const target = await this.findOne(query);
    if (!target || !target.id) return false;

    const updates = update?.$set || update || {};
    await this.collectionRef.doc(String(target.id)).update(updates);
    return true;
  }

  find(query) {
    return {
      sort: (key, direction) => {
        return {
          toList: async (length) => {
            const snapshot = await this.collectionRef.get();
            let results = [];
            for (const doc of snapshot.docs) {
              const data = doc.data() || {};
              if (matchesQuery(data, query)) {
                results.push(data);
              }
            }
            const reverse = direction === -1;
            results.sort((a, b) => {
              const valA = a[key] || '';
              const valB = b[key] || '';
              if (valA < valB) return reverse ? 1 : -1;
              if (valA > valB) return reverse ? -1 : 1;
              return 0;
            });
            return length ? results.slice(0, length) : results;
          }
        };
      },
      toList: async (length) => {
        const snapshot = await this.collectionRef.get();
        const results = [];
        for (const doc of snapshot.docs) {
          const data = doc.data() || {};
          if (matchesQuery(data, query)) {
            results.push(data);
          }
        }
        return length ? results.slice(0, length) : results;
      }
    };
  }

  async deleteOne(query) {
    const target = await this.findOne(query);
    if (target && target.id) {
      await this.collectionRef.doc(String(target.id)).delete();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
}

class FirestoreDatabaseWrapper {
  constructor(firestore) {
    this.firestore = firestore;
  }

  collection(name) {
    return new FirestoreCollectionWrapper(this.firestore.collection(name));
  }
}

class DatabaseService {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      if (!admin.apps.length) {
        if (config.FIREBASE_CREDENTIALS_JSON) {
          const cred = JSON.parse(config.FIREBASE_CREDENTIALS_JSON);
          admin.initializeApp({
            credential: admin.credential.cert(cred),
            projectId: config.FIREBASE_PROJECT_ID,
          });
        } else if (config.FIREBASE_CREDENTIALS_PATH && existsSync(config.FIREBASE_CREDENTIALS_PATH)) {
          const fileContent = readFileSync(config.FIREBASE_CREDENTIALS_PATH, 'utf-8');
          const cred = JSON.parse(fileContent);
          admin.initializeApp({
            credential: admin.credential.cert(cred),
            projectId: config.FIREBASE_PROJECT_ID,
          });
        } else {
          admin.initializeApp({
            projectId: config.FIREBASE_PROJECT_ID,
          });
        }
      }

      const firestore = admin.firestore();
      this.db = new FirestoreDatabaseWrapper(firestore);
      console.log('Successfully connected to Firebase Firestore!');
    } catch (err) {
      console.warn(`Unable to connect to Firebase Firestore: ${err.message}`);
      console.warn('WARNING: Falling back to In-Memory Mock Database for development.');
      this.db = new MockDatabase();
    }
  }

  getDb() {
    if (!this.db) {
      this.db = new MockDatabase();
    }
    return this.db;
  }
}

export const dbService = new DatabaseService();
export const getDatabase = () => dbService.getDb();
