import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import { ShippingPolicyPage } from '@/src/page-components/SupportPages';

export const metadata: Metadata = {
  title: 'Chính Sách Vận Chuyển - FURANO',
  description: 'Tìm hiểu về chính sách vận chuyển và giao hàng của FURANO. Giao hàng nhanh chóng và tiện lợi.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/shipping-policy`,
  },
};

export default function Page() {
  return (
    <MainLayout>
      <ShippingPolicyPage />
    </MainLayout>
  );
}
