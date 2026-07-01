import type { Metadata } from 'next';
import MainLayout from '../../MainLayout';
import BlogDetailPage from '@/src/page-components/BlogDetailPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let query = supabase.from('blogPosts').select('*');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq('slug', id);
  }
  const { data: post } = await query.single();

  if (!post || post.deletedAt || post.status !== 'published') {
    return {
      title: 'Bài viết không tồn tại',
    };
  }

  const title = post.seoTitle || post.title || 'Bài viết';
  const description = post.seoDescription || post.excerpt || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog/${post.slug || post.id}`;
  const images = post.coverImage ? [post.coverImage] : [];

  return {
    title,
    description,
    keywords: post.seoKeywords || post.tags?.join(', ') || 'nha khoa, chăm sóc răng miệng, furano, chỉnh nha, răng niềng',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images,
      siteName: 'FURANO',
      locale: 'vi_VN',
      publishedTime: post.date ? (() => { try { return new Date(post.date.includes('/') ? post.date.split('/').reverse().join('-') : post.date).toISOString() } catch (e) { return undefined } })() : undefined,
      authors: [post.author || 'FURANO'],
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

  let query = supabase.from('blogPosts').select('*');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq('slug', id);
  }
  const { data: post } = await query.single();

  const validPost = post && !post.deletedAt && post.status === 'published' ? post : null;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog/${validPost?.slug || validPost?.id}`;

  const jsonLd = validPost ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: validPost.seoTitle || validPost.title,
    description: validPost.seoDescription || validPost.excerpt,
    image: validPost.coverImage ? [validPost.coverImage] : [],
    datePublished: validPost.date ? (() => { try { return new Date(validPost.date.includes('/') ? validPost.date.split('/').reverse().join('-') : validPost.date).toISOString() } catch (e) { return undefined } })() : undefined,
    dateModified: validPost.updatedAt ? (() => { try { return new Date(validPost.updatedAt).toISOString() } catch(e) { return undefined } })() : (validPost.date ? (() => { try { return new Date(validPost.date.includes('/') ? validPost.date.split('/').reverse().join('-') : validPost.date).toISOString() } catch(e) { return undefined } })() : undefined),
    author: {
      '@type': 'Organization',
      name: validPost.author || 'FURANO',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'
    },
    publisher: {
      '@type': 'Organization',
      name: 'FURANO',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
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
      <BlogDetailPage initialPost={validPost} />
    </MainLayout>
  );
}
