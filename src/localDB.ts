import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs as firebaseGetDocs, 
  getDoc as firebaseGetDoc,
  doc, 
  setDoc as firebaseSetDoc, 
  deleteDoc as firebaseDeleteDoc,
  writeBatch as firebaseWriteBatch,
  onSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  collection,
  doc,
  sendPasswordResetEmail,
  onAuthStateChanged,
  onSnapshot
};

export type { User };

// Ensure we create user if not exists during admin sign in, to ease the process without console
export const signInWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  try {
    const cred = await firebaseSignIn(authObj, email, password);
    return cred;
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
       const cred = await firebaseCreateUser(authObj, email, password);
       return cred;
    }
    throw err;
  }
};

export const signOut = async (authObj: any) => {
  return firebaseSignOut(authObj);
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  return firebaseCreateUser(authObj, email, password);
};

export const getDocs = async (collectionRef: any) => {
  return firebaseGetDocs(collectionRef);
};

export const getDoc = async (docRef: any) => {
  return firebaseGetDoc(docRef);
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  const result = await firebaseSetDoc(docRef, data, options);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('localDB_updated'));
  }
  return result;
};

export const deleteDoc = async (docRef: any) => {
  const result = await firebaseDeleteDoc(docRef);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('localDB_updated'));
  }
  return result;
};

export const writeBatch = (dbRef: any) => {
  const batch = firebaseWriteBatch(dbRef);
  const originalCommit = batch.commit.bind(batch);
  batch.commit = async () => {
    const result = await originalCommit();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('localDB_updated'));
    }
    return result;
  };
  return batch;
};
