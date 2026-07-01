import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
  let { data: post, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('Error fetching blog post metadata:', error);
  }

  if (!post) {
    const { blogPosts: staticPosts } = await import('@/src/data/blogPosts');
    post = staticPosts.find(p => p.id === id) as any;
  }

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    };
  }

  const title = post.seoTitle || post.title || 'Bài viết';
  const description = post.seoDescription || post.excerpt || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog/${post.slug || post.id}`;
  const images = post.image ? [post.image] : [];

  return {
    title,
    description,
    keywords: 'nha khoa, chăm sóc răng miệng, furano, chỉnh nha, răng niềng',
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
      authors: ['FURANO'],
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
  let { data: post, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('Error fetching blog post:', error);
  }

  if (!post) {
    const { blogPosts: staticPosts } = await import('@/src/data/blogPosts');
    post = staticPosts.find(p => p.id === id) as any;
  }

  const validPost = post ? post : null;
  if (!validPost) {
    notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn'}/blog/${validPost?.slug || validPost?.id}`;

  const jsonLd = validPost ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: validPost.seoTitle || validPost.title,
    description: validPost.seoDescription || validPost.excerpt,
    image: validPost.image ? [validPost.image] : [],
    datePublished: validPost.date ? (() => { try { return new Date(validPost.date.includes('/') ? validPost.date.split('/').reverse().join('-') : validPost.date).toISOString() } catch (e) { return undefined } })() : undefined,
    dateModified: validPost.date ? (() => { try { return new Date(validPost.date.includes('/') ? validPost.date.split('/').reverse().join('-') : validPost.date).toISOString() } catch(e) { return undefined } })() : undefined,
    author: {
      '@type': 'Organization',
      name: 'FURANO',
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
