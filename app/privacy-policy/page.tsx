import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import { PrivacyPolicyPage } from '@/src/page-components/SupportPages';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật - FURANO',
  description: 'Tìm hiểu về chính sách bảo mật thông tin của FURANO. Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/privacy-policy`,
  },
};

export default function Page() {
  return (
    <MainLayout>
      <PrivacyPolicyPage />
    </MainLayout>
  );
}
