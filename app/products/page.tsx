import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import ProductsPage from '@/src/page-components/ProductsPage';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

export const metadata: Metadata = {
  title:
    'Kem Đánh Răng Cho Người Niềng Răng & Sản Phẩm Chăm Sóc Răng Niềng - FURANO',
  description:
    'Mua kem đánh răng cho người niềng răng chính hãng FURANO. Bao gồm bàn chải kẽ, nước súc miệng, sáp nha khoa chuyên dụng. Sản phẩm được bác sĩ nha khoa khuyên dùng, bảo vệ răng miệng tối ưu khi niềng răng.',
  keywords:
    'kem đánh răng cho người niềng răng, kem đánh răng niềng răng, bàn chải kẽ, bàn chải kẽ niềng răng, nước súc miệng niềng răng, sáp nha khoa, furano, sản phẩm niềng răng, chăm sóc răng niềng, fluocaril',
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title:
      'Kem Đánh Răng Cho Người Niềng Răng & Sản Phẩm Chăm Sóc Răng Niềng - FURANO',
    description:
      'Mua kem đánh răng cho người niềng răng chính hãng FURANO. Bao gồm bàn chải kẽ, nước súc miệng, sáp nha khoa chuyên dụng.',
    url: `${baseUrl}/products`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const url = `${baseUrl}/products`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kem Đánh Răng Cho Người Niềng Răng & Sản Phẩm Chăm Sóc Răng Niềng',
    description:
      'Mua kem đánh răng cho người niềng răng chính hãng FURANO. Bao gồm bàn chải kẽ, nước súc miệng, sáp nha khoa chuyên dụng.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Kem Đánh Răng FURANO 7 Benefits cho người niềng răng',
          url: `${baseUrl}/products`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Bàn Chải Kẽ chuyên dụng cho người niềng răng',
          url: `${baseUrl}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Nước Súc Miệng Cherry Fresh cho răng niềng',
          url: `${baseUrl}/products`,
        },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản Phẩm Niềng Răng',
        item: `${baseUrl}/products`,
      },
    ],
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductsPage />
    </MainLayout>
  );
}
