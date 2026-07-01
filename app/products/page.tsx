import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import ProductsPage from '@/src/page-components/ProductsPage';

export const metadata: Metadata = {
  title: 'Sản Phẩm Chăm Sóc Răng Miệng Chuyên Biệt - FURANO',
  description: 'Khám phá các sản phẩm chăm sóc răng miệng chuyên biệt từ chuyên gia nha khoa FURANO.',
  keywords: 'sản phẩm nha khoa, bàn chải kẽ, sáp nha khoa, chăm sóc răng niềng, furano',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/products`,
  },
  openGraph: {
    title: 'Sản Phẩm Chăm Sóc Răng Miệng Chuyên Biệt - FURANO',
    description: 'Khám phá các sản phẩm chăm sóc răng miệng chuyên biệt từ chuyên gia nha khoa FURANO.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/products`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/products`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sản Phẩm Chăm Sóc Răng Miệng Chuyên Biệt - FURANO',
    description: 'Khám phá các sản phẩm chăm sóc răng miệng chuyên biệt từ chuyên gia nha khoa FURANO.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/logo.png`
      }
    }
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsPage />
    </MainLayout>
  );
}
