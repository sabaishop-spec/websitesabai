import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Providers from './providers';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'FURANO - Chuyên gia chăm sóc răng niềng';
  let description = 'FURANO - Chuyên gia chăm sóc răng niềng';
  let icon = '/favicon.svg';

  try {
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'general')
      .single();

    if (data) {
      if (data.seoTitle) title = data.seoTitle;
      else if (data.siteName) title = data.siteName;
      
      if (data.seoDescription) description = data.seoDescription;
      else if (data.siteDescription) description = data.siteDescription;

      if (data.faviconUrl) icon = data.faviconUrl;
    }
  } catch (err) {
    console.error("Error fetching global metadata", err);
  }

  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    icons: {
      icon,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  let initialSettings = {};
  try {
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'general')
      .single();
    if (data) {
      initialSettings = data;
    }
  } catch (err) {
    console.error("Error fetching global settings for layout", err);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers initialSettings={initialSettings}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
