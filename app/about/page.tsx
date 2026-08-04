import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import AboutPage from '@/src/page-components/AboutPage';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

export const metadata: Metadata = {
  title: 'Về FURANO - Chuyên Gia Kem Đánh Răng & Chăm Sóc Răng Cho Người Niềng',
  description:
    'Tìm hiểu về FURANO - thương hiệu chuyên kem đánh răng cho người niềng răng hàng đầu Việt Nam. Sứ mệnh mang lại nụ cười tự tin và khỏe mạnh cho cộng đồng niềng răng.',
  keywords:
    'furano, về furano, furano.vn, thương hiệu furano, kem đánh răng cho người niềng răng, chăm sóc răng niềng, chuyên gia niềng răng',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'Về FURANO - Chuyên Gia Kem Đánh Răng & Chăm Sóc Răng Cho Người Niềng',
    description:
      'Tìm hiểu về FURANO - thương hiệu chuyên kem đánh răng cho người niềng răng hàng đầu Việt Nam.',
    url: `${baseUrl}/about`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
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
        name: 'Về FURANO',
        item: `${baseUrl}/about`,
      },
    ],
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutPage />
    </MainLayout>
  );
}
