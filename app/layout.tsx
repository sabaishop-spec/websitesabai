import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Providers from './providers';
import { supabase } from '@/src/lib/supabase';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'FURANO - Chuyên gia chăm sóc răng niềng';
  let description = 'FURANO - Chuyên gia chăm sóc răng niềng';
  let icon = '/favicon.svg';
  let keywords = 'furano, nha khoa, răng niềng, chăm sóc răng miệng, chỉnh nha';

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
    keywords,
    icons: {
      icon,
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: title,
      locale: 'vi_VN',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      // Geo Tags for Vietnam
      'geo.region': 'VN',
      'geo.placename': 'Vietnam',
      'geo.position': '14.058324;108.277199',
      'ICBM': '14.058324, 108.277199',
    }
  };
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  let initialSettings = {};
  let localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FURANO',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/logo.png`,
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}`,
    telephone: '',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 14.058324,
      longitude: 108.277199
    }
  };

  try {
    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'general')
      .single();
    if (data) {
      initialSettings = data;
      
      if (data.phone) {
        localBusinessSchema.telephone = data.phone;
      }
      if (data.address) {
        localBusinessSchema.address = {
          '@type': 'PostalAddress',
          streetAddress: data.address,
          addressCountry: 'VN'
        } as any;
      }
      if (data.logoUrl) {
        localBusinessSchema.image = data.logoUrl;
      }
    }
  } catch (err) {
    console.error("Error fetching global settings for layout", err);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Script
          id="json-ld-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers initialSettings={initialSettings}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
