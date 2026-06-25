import MainLayout from '../MainLayout';
import BlogPage from '@/src/page-components/BlogPage';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data: posts } = await supabase
    .from('blogPosts')
    .select('id, title, title_en, slug, category, category_en, image, date, date_en, excerpt, excerpt_en, seoDescription, seoDescription_en, createdAt, status')
    .or('status.eq.published,status.is.null')
    .is('deletedAt', null)
    .order('createdAt', { ascending: false, nullsFirst: false });

  const { data: categories } = await supabase.from('blogCategories').select('name');

  return (
    <MainLayout>
      <BlogPage 
        initialPosts={posts || []} 
        initialCategories={categories?.map(c => c.name) || []} 
      />
    </MainLayout>
  );
}
