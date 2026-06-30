import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import FAQPage from '@/src/page-components/FAQPage';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp - FURANO',
  description: 'Giải đáp các thắc mắc thường gặp về chăm sóc răng miệng, niềng răng, và thông tin mua hàng từ FURANO.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/faq`,
  },
  openGraph: {
    title: 'Câu Hỏi Thường Gặp - FURANO',
    description: 'Giải đáp các thắc mắc thường gặp về chăm sóc răng miệng, niềng răng, và thông tin mua hàng từ FURANO.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/faq`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function Page() {
  return (
    <MainLayout>
      <FAQPage />
    </MainLayout>
  );
}
