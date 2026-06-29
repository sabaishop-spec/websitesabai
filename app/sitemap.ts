import { MetadataRoute } from 'next';
import { supabase } from '@/src/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furanocare.com';

  const defaultPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Fetch blog posts
  const { data: posts } = await supabase
    .from('blogPosts')
    .select('id, slug, date')
    .or('status.eq.published,status.is.null')
    .is('deletedAt', null);

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug || post.id}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, slug')
    .or('status.eq.published,status.is.null')
    .is('deletedAt', null);

  const productUrls = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.slug || product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...defaultPages, ...postUrls, ...productUrls];
}
