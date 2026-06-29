import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import ProductsPage from '@/src/page-components/ProductsPage';

export const metadata: Metadata = {
  title: 'Sản Phẩm',
  description: 'Khám phá các sản phẩm chăm sóc răng miệng chuyên biệt từ FURANO.',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}
