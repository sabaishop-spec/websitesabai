import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import BlogPage from '@/src/page-components/BlogPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog Kiến Thức Chỉnh Nha',
  description: 'Khám phá các bài viết, chia sẻ kiến thức về chỉnh nha, chăm sóc răng niềng từ chuyên gia nha khoa FURANO.',
  keywords: 'blog nha khoa, kiến thức chỉnh nha, chăm sóc răng niềng, furano, răng miệng',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog`,
  },
  openGraph: {
    title: 'Blog Kiến Thức Chỉnh Nha - FURANO',
    description: 'Khám phá các bài viết, chia sẻ kiến thức về chỉnh nha, chăm sóc răng niềng từ chuyên gia nha khoa FURANO.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function Page() {
  const { data: posts } = await supabase
    .from('blogPosts')
    .select('id, title, title_en, slug, category, image, date, excerpt, excerpt_en, seoDescription, createdAt, status')
    .or('status.eq.published,status.is.null')
    .is('deletedAt', null)
    .order('createdAt', { ascending: false, nullsFirst: false });

  const { data: categories } = await supabase.from('blogCategories').select('name');

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Kiến Thức Chỉnh Nha - FURANO',
    description: 'Khám phá các bài viết, chia sẻ kiến thức về chỉnh nha, chăm sóc răng niềng từ chuyên gia nha khoa FURANO.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/logo.png`
      }
    }
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPage 
        initialPosts={posts || []} 
        initialCategories={categories?.map(c => c.name) || []} 
      />
    </MainLayout>
  );
}
