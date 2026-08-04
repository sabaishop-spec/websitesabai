import type { Metadata } from 'next';
import MainLayout from './MainLayout';
import Home from '@/src/page-components/Home';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

export const metadata: Metadata = {
  title: 'FURANO - Kem Đánh Răng & Sản Phẩm Chăm Sóc Răng Cho Người Niềng Răng',
  description:
    'FURANO chuyên cung cấp kem đánh răng cho người niềng răng, bàn chải kẽ, nước súc miệng và sản phẩm chăm sóc răng niềng chuyên biệt. Giải pháp toàn diện giúp bảo vệ răng miệng trong suốt quá trình niềng răng.',
  keywords:
    'furano, kem đánh răng cho người niềng răng, niềng răng, kem đánh răng niềng răng, chăm sóc răng niềng, bàn chải kẽ, nước súc miệng niềng răng, sáp nha khoa, chỉnh nha, sản phẩm niềng răng, furano.vn',
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'FURANO - Kem Đánh Răng & Sản Phẩm Chăm Sóc Răng Cho Người Niềng Răng',
    description:
      'FURANO chuyên cung cấp kem đánh răng cho người niềng răng, bàn chải kẽ, nước súc miệng và sản phẩm chăm sóc răng niềng chuyên biệt.',
    url: baseUrl,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FURANO - Kem Đánh Răng & Sản Phẩm Chăm Sóc Răng Cho Người Niềng Răng',
    description:
      'Chuyên gia chăm sóc răng niềng hàng đầu Việt Nam. Kem đánh răng, bàn chải kẽ, nước súc miệng chuyên biệt cho người niềng răng.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FURANO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'FURANO - Chuyên gia cung cấp kem đánh răng cho người niềng răng và sản phẩm chăm sóc răng niềng chuyên biệt tại Việt Nam.',
    sameAs: ['https://www.facebook.com/SabaiCare79'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FURANO',
    url: baseUrl,
    description:
      'FURANO - Kem đánh răng cho người niềng răng, bàn chải kẽ, nước súc miệng và sản phẩm chăm sóc răng niềng chuyên biệt.',
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <Home />
    </MainLayout>
  );
}
