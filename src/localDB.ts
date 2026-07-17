export interface User {
  uid: string;
  email: string;
}

export const auth = {
  currentUser: null as User | null,
};

import { supabase } from './lib/supabase';
import { revalidateAll } from '@/app/actions/revalidate';

// Set up cross-tab synchronization for local events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'localDB_updated_event') {
      window.dispatchEvent(new Event('localDB_updated'));
    }
  });
}

// Removed unconditional Supabase Realtime subscription to prevent excessive Egress
// Client apps will now fetch once and cache the result.

export const db = {};

export const collection = (db: any, path: string) => {
  return { path };
};

export const doc = (...args: any[]) => {
  let path = '';
  let id = '';
  
  if (args.length === 2 && typeof args[0] === 'object' && args[0].path) {
    path = args[0].path;
    id = args[1] || Math.random().toString(36).substring(7);
  } else if (args.length >= 2 && typeof args[1] === 'string') {
    path = args[1];
    id = args[2] || Math.random().toString(36).substring(7);
  } else if (args.length === 1 && typeof args[0] === 'object') {
     path = args[0].path;
     id = Math.random().toString(36).substring(7);
  }
  
  return { path, id: id || Math.random().toString(36).substring(7) };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const HAS_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

const getMemData = (path: string) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('localDB_data_' + path);
    if (raw) return JSON.parse(raw);
  }
  return [];
};

const setMemData = (path: string, data: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('localDB_data_' + path, JSON.stringify(data));
  }
};

export const getDocs = async (collectionRef: any) => {
  const CACHE_KEY = 'supabase_cache_' + collectionRef.path;
  const CACHE_TIME_KEY = 'supabase_cache_time_' + collectionRef.path;
  const CACHE_TTL = 1000 * 60 * 60; // 1 hour

  let data: any[] = [];
  if (HAS_SUPABASE) {
    let shouldFetch = true;
    if (typeof window !== 'undefined') {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      // Skip cache if admin is logged in, to always see fresh data
      const isAdmin = localStorage.getItem('auth_user') !== null;
      // Also skip cache if data was invalidated after cache was written (admin saved from another tab)
      const invalidatedAt = localStorage.getItem('supabase_cache_invalidated_at');
      const cacheIsStale = invalidatedAt && cachedTime && parseInt(invalidatedAt) > parseInt(cachedTime);
      if (!isAdmin && !cacheIsStale && cachedTime && Date.now() - parseInt(cachedTime) < CACHE_TTL) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          data = JSON.parse(cachedData);
          shouldFetch = false;
        }
      }
    }

    if (shouldFetch) {
      try {
        const { data: errorData, error } = await supabase
          .from(collectionRef.path)
          .select('*');
        data = errorData || [];
        if (error && error.code !== '42P01' && !error.message.includes('Could not find the table') && !error.message.includes('relation') && !error.message.includes('does not exist')) {
          console.error(`Supabase Error fetch for table ${collectionRef.path}:`, error);
        } else if (!error && typeof window !== 'undefined') {
          try {
             localStorage.setItem(CACHE_KEY, JSON.stringify(data));
             localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          } catch(e) { /* ignore quota errors */ }
        }
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    data = getMemData(collectionRef.path);
  }

  const mergedData = data.filter(d => !d._deleted);

  return {
    docs: mergedData.map((item: any) => ({
      id: item.id,
      data: () => item
    }))
  };
};

export const getDoc = async (docRef: any) => {
  let data = null;
  if (HAS_SUPABASE) {
    try {
        const { data: resData, error } = await supabase
           .from(docRef.path)
           .select('*')
           .eq('id', docRef.id)
           .single();
        if (!error && resData) {
            data = resData;
        }
    } catch (e) {}
  } else {
    const localDocs = getMemData(docRef.path);
    data = localDocs.find((d: any) => d.id === docRef.id) || null;
  }

  return {
    id: docRef.id,
    exists: () => !!data && !data._deleted,
    data: () => data
  };
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  if (!HAS_SUPABASE) {
      let list = getMemData(docRef.path);
      const existing = list.findIndex((item:any) => item.id === docRef.id);
      const payload = { ...data, id: docRef.id };
      if (existing !== -1) {
          list[existing] = { ...list[existing], ...payload };
      } else {
          list.push(payload);
      }
      setMemData(docRef.path, list);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
      return;
  }
  
  let payload = { ...data, id: docRef.id };

  const { error } = await supabase
    .from(docRef.path)
    .upsert(payload);
    
  if (error) {
     console.error(`Supabase upsert failed for ${docRef.path}:`, error);
     const err = new Error(error.message);
     (err as any).details = error.details;
     (err as any).hint = error.hint;
     (err as any).code = error.code;
     throw err;
  }
  
  if (typeof window !== 'undefined') {
    const now = Date.now().toString();
    localStorage.removeItem('supabase_cache_' + docRef.path);
    localStorage.removeItem('supabase_cache_time_' + docRef.path);
    // Broadcast invalidation timestamp so all tabs know cache is stale
    localStorage.setItem('supabase_cache_invalidated_at', now);
    window.dispatchEvent(new Event('localDB_updated'));
    localStorage.setItem('localDB_updated_event', now);
  }
  
  // Xóa cache của Next.js khi upload ảnh / lưu thay đổi để CDN + server cập nhật data mới.
  try {
    await revalidateAll();
  } catch (e) {
    console.error("Revalidation failed:", e);
  }
};

export const deleteDoc = async (docRef: any) => {
  if (!HAS_SUPABASE) {
      let list = getMemData(docRef.path);
      const existing = list.findIndex((item:any) => item.id === docRef.id);
      if (existing !== -1) {
          list[existing]._deleted = true;
          setMemData(docRef.path, list);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
      return;
  }

  const { error } = await supabase
    .from(docRef.path)
    .delete()
    .eq('id', docRef.id);
    
  if (error) {
    console.error(`Supabase delete failed for ${docRef.path}:`, error);
    throw new Error(`Lỗi Supabase (xóa): ${error.message}`);
  }
  
  if (typeof window !== 'undefined') {
    const now = Date.now().toString();
    localStorage.removeItem('supabase_cache_' + docRef.path);
    localStorage.removeItem('supabase_cache_time_' + docRef.path);
    localStorage.setItem('supabase_cache_invalidated_at', now);
    window.dispatchEvent(new Event('localDB_updated'));
    localStorage.setItem('localDB_updated_event', now);
  }
  
  try {
    await revalidateAll();
  } catch (e) {
    console.error("Revalidation failed:", e);
  }
};

export const signInWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  if (email === 'sonnt.credit@gmail.com' && password === '12345678') {
    const user = { uid: '1', email };
    auth.currentUser = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
    fireAuthStateChanged(user);
    return { user };
  }
  throw new Error("Invalid credentials");
};

export const signOut = async (authObj: any) => {
  auth.currentUser = null;
  localStorage.removeItem('auth_user');
  fireAuthStateChanged(null);
};

let authStateListeners: any[] = [];
export const onAuthStateChanged = (authObj: any, callback: any) => {
  authStateListeners.push(callback);
  const stored = localStorage.getItem('auth_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      auth.currentUser = user;
      callback(user);
    } catch(e) {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== callback);
  };
};

const fireAuthStateChanged = (user: any) => {
  authStateListeners.forEach(l => l(user));
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  return { user: { uid: Math.random().toString(36).substring(7), email } };
};

export const sendPasswordResetEmail = async (authObj: any, email: string) => {
  return true;
};

export const writeBatch = (db: any) => {
  const operations: any[] = [];
  return {
    set: (docRef: any, data: any, options: any) => {
      operations.push(() => setDoc(docRef, data, options));
    },
    delete: (docRef: any) => {
      operations.push(() => deleteDoc(docRef));
    },
    commit: async () => {
      for (const op of operations) {
        await op();
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localDB_updated'));
        localStorage.setItem('localDB_updated_event', Date.now().toString());
      }
    }
  };
};
