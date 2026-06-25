import MainLayout from '../../MainLayout';
import BlogDetailPage from '@/src/page-components/BlogDetailPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

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
