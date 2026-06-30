import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import { ReturnPolicyPage } from '@/src/page-components/SupportPages';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả - FURANO',
  description: 'Tìm hiểu về chính sách đổi trả hàng hóa của FURANO. Đảm bảo quyền lợi mua sắm tốt nhất cho khách hàng.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/return-policy`,
  },
};

export default function Page() {
  return (
    <MainLayout>
      <ReturnPolicyPage />
    </MainLayout>
  );
}
