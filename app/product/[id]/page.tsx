import type { Metadata } from 'next';
import MainLayout from '../../MainLayout';
import ProductDetailPage from '@/src/page-components/ProductDetailPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let query = supabase.from('products').select('*');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq('slug', id);
  }
  const { data: product } = await query.single();

  if (!product || product.deletedAt || product.status !== 'published') {
    return {
      title: 'Sản phẩm không tồn tại',
    };
  }

  const title = product.seoTitle || product.name || 'Sản phẩm';
  const description = product.seoDescription || product.description || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/product/${product.slug || product.id}`;
  const images = product.images && product.images.length > 0 ? product.images : [];

  return {
    title,
    description,
    keywords: product.seoKeywords || product.tags?.join(', ') || 'nha khoa, chăm sóc răng miệng, furano, chỉnh nha, sản phẩm nha khoa',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images,
      siteName: 'FURANO',
      locale: 'vi_VN',
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
  const id = resolvedParams.id;

  let query = supabase.from('products').select('*');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq('slug', id);
  }
  const { data: product } = await query.single();

  const validProduct = product && !product.deletedAt && product.status === 'published' ? product : null;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/product/${validProduct?.slug || validProduct?.id}`;

  const jsonLd = validProduct ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: validProduct.name,
    image: validProduct.images && validProduct.images.length > 0 ? validProduct.images : [],
    description: validProduct.seoDescription || validProduct.description,
    brand: {
      '@type': 'Brand',
      name: 'FURANO'
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'VND',
      price: validProduct.price || 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'FURANO'
      }
    }
  } : null;

  return (
    <MainLayout>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailPage params={resolvedParams} />
    </MainLayout>
  );
}
