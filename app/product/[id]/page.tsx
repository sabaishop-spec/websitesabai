import type { Metadata } from 'next';
import MainLayout from '../../MainLayout';
import ProductDetailPage from '@/src/page-components/ProductDetailPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();

  if (!product || product.deletedAt || product.status !== 'published') {
    return {
      title: 'Sản phẩm không tồn tại',
    };
  }

  const title = product.seoTitle || product.name || 'Sản phẩm';
  const description = product.seoDescription || product.description || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug || product.id}`;
  const images = product.images && product.images.length > 0 ? product.images : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <MainLayout>
      <ProductDetailPage params={resolvedParams} />
    </MainLayout>
  );
}
