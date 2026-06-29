'use client';

import { ReactNode } from 'react';
import { SiteSettingsProvider } from '@/src/contexts/SiteSettingsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

export default function Providers({ children, initialSettings }: { children: ReactNode, initialSettings?: any }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SiteSettingsProvider initialSettings={initialSettings}>
        {children}
      </SiteSettingsProvider>
    </I18nextProvider>
  );
}
