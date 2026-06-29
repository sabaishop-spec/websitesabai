import type { Metadata } from 'next';
import MainLayout from '../../MainLayout';
import BlogDetailPage from '@/src/page-components/BlogDetailPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: post } = await supabase
    .from('blogPosts')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();

  if (!post || post.deletedAt || post.status !== 'published') {
    return {
      title: 'Bài viết không tồn tại',
    };
  }

  const title = post.seoTitle || post.title || 'Bài viết';
  const description = post.seoDescription || post.excerpt || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug || post.id}`;
  const images = post.coverImage ? [post.coverImage] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images,
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
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

  const { data: post } = await supabase
    .from('blogPosts')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();

  const validPost = post && !post.deletedAt && post.status === 'published' ? post : null;

  return (
    <MainLayout>
      <BlogDetailPage initialPost={validPost} />
    </MainLayout>
  );
}
