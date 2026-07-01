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
  let { data: product, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('Error fetching product metadata:', error);
  }

  if (!product) {
    const { categories: staticCats } = await import('@/src/data/products');
    product = staticCats.flatMap(cat => cat.products || []).find((p: any) => p.id === id) as any;
  }

  if (!product || (product.status && product.status !== 'published') || product.deletedAt) {
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
  let { data: product, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
  }

  if (!product) {
    const { categories: staticCats } = await import('@/src/data/products');
    product = staticCats.flatMap(cat => cat.products || []).find((p: any) => p.id === id) as any;
  }

  const validProduct = product && (!product.deletedAt) && (!product.status || product.status === 'published') ? product : null;

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
