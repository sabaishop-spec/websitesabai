import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import { ShoppingGuidePage } from '@/src/page-components/SupportPages';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Mua Hàng - FURANO',
  description: 'Hướng dẫn chi tiết các bước mua sắm và thanh toán tại website của FURANO.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/shopping-guide`,
  },
};

export default function Page() {
  return (
    <MainLayout>
      <ShoppingGuidePage />
    </MainLayout>
  );
}
