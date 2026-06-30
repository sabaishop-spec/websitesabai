import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import { OrderTrackingPage } from '@/src/page-components/SupportPages';

export const metadata: Metadata = {
  title: 'Tra Cứu Đơn Hàng - FURANO',
  description: 'Tra cứu thông tin và tình trạng đơn hàng của bạn tại FURANO.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/order-tracking`,
  },
};

export default function Page() {
  return (
    <MainLayout>
      <OrderTrackingPage />
    </MainLayout>
  );
}
