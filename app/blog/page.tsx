import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import BlogPage from '@/src/page-components/BlogPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

export const metadata: Metadata = {
  title: 'Kiến Thức Niềng Răng & Chăm Sóc Răng Miệng Khi Niềng - FURANO Blog',
  description:
    'Tổng hợp kiến thức chuyên sâu về niềng răng, hướng dẫn chọn kem đánh răng cho người niềng răng, chế độ ăn, vệ sinh răng miệng khi niềng từ chuyên gia FURANO.',
  keywords:
    'niềng răng, kiến thức niềng răng, kem đánh răng cho người niềng răng, chăm sóc răng niềng, vệ sinh răng miệng khi niềng, bàn chải kẽ, invisalign, mắc cài, furano, blog nha khoa',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Kiến Thức Niềng Răng & Chăm Sóc Răng Miệng Khi Niềng - FURANO Blog',
    description:
      'Tổng hợp kiến thức chuyên sâu về niềng răng, hướng dẫn chọn kem đánh răng cho người niềng răng từ chuyên gia FURANO.',
    url: `${baseUrl}/blog`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
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

  let fetchedPosts = posts || [];
  let fetchedCategories = categories?.map(c => c.name) || [];

  if (fetchedPosts.length === 0) {
    const { blogPosts: staticPosts } = await import('@/src/data/blogPosts');
    fetchedPosts = staticPosts as any[];
  }

  if (fetchedCategories.length === 0) {
    fetchedCategories = Array.from(new Set(fetchedPosts.map((p: any) => p.category)));
  }

  const url = `${baseUrl}/blog`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kiến Thức Niềng Răng & Chăm Sóc Răng Miệng - FURANO Blog',
    description:
      'Tổng hợp kiến thức chuyên sâu về niềng răng, hướng dẫn chọn kem đánh răng cho người niềng răng từ chuyên gia FURANO.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Góc Kiến Thức Niềng Răng',
        item: `${baseUrl}/blog`,
      },
    ],
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPage
        initialPosts={fetchedPosts}
        initialCategories={fetchedCategories}
      />
    </MainLayout>
  );
}
