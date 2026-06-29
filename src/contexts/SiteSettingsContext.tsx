'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, getDoc } from '../localDB';

const SiteSettingsContext = createContext<any>({});

export const SiteSettingsProvider = ({ children, initialSettings }: { children: React.ReactNode, initialSettings?: any }) => {
  const [settings, setSettings] = useState<any>(initialSettings || {});
  const [isLoading, setIsLoading] = useState(!initialSettings);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (isMounted && snap.exists()) {
          setSettings(snap.data());
        }
      } catch (err) {
        // Silent fail for optional settings
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, []);

  const value = {
    ...settings,
    isLoading,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
