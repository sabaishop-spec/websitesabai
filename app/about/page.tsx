import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import AboutPage from '@/src/page-components/AboutPage';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi - FURANO',
  description: 'Tìm hiểu về FURANO - Chuyên gia chăm sóc răng niềng hàng đầu với sứ mệnh mang lại nụ cười tự tin và khỏe mạnh.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/about`,
  },
  openGraph: {
    title: 'Về Chúng Tôi - FURANO',
    description: 'Tìm hiểu về FURANO - Chuyên gia chăm sóc răng niềng hàng đầu với sứ mệnh mang lại nụ cười tự tin và khỏe mạnh.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/about`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function Page() {
  return (
    <MainLayout>
      <AboutPage />
    </MainLayout>
  );
}
