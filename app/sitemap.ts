import { MetadataRoute } from 'next';
import { supabase } from '@/src/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Safely parse date strings (handling DD/MM/YYYY, Vietnamese 'Thg', and standard formats)
// falling back to the current date if parsing fails.
function parseDateSafely(dateStr: any): Date {
  if (!dateStr) return new Date();
  
  // Try direct parsing first
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  // Try custom parsing
  try {
    if (typeof dateStr === 'string') {
      // Handle DD/MM/YYYY
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          const test = new Date(`${year}-${month}-${day}`);
          if (!isNaN(test.getTime())) return test;
        }
      }
      
      // Handle "DD Thg MM, YYYY" (e.g. "05 Thg 6, 2026")
      const match = dateStr.match(/(\d+)\s+Thg\s+(\d+),\s+(\d+)/i);
      if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        const test = new Date(`${year}-${month}-${day}`);
        if (!isNaN(test.getTime())) return test;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }

  return new Date(); // Safe fallback
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shopping-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch blog posts safely
  let posts: any[] = [];
  try {
    const { data, error } = await supabase
      .from('blogPosts')
      .select('id, slug, date, image')
      .or('status.eq.published,status.is.null')
      .is('deletedAt', null);
      
    if (!error && data) {
      posts = data;
    } else if (error) {
      console.warn('Sitemap: Supabase query error for blog posts:', error.message);
    }
  } catch (err: any) {
    console.error('Sitemap: Exception fetching blog posts:', err.message || err);
  }

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const imagesList = post.image ? [post.image] : [];
    return {
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: parseDateSafely(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: imagesList,
    };
  });

  // Fallback to static posts if DB query yielded no results
  if (postUrls.length === 0) {
    try {
      const { blogPosts: staticPosts } = await import('@/src/data/blogPosts');
      const staticPostUrls: MetadataRoute.Sitemap = staticPosts.map((post) => {
        const imagesList = post.image ? [post.image] : [];
        return {
          url: `${baseUrl}/blog/${post.id}`,
          lastModified: parseDateSafely(post.date),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          images: imagesList,
        };
      });
      postUrls.push(...staticPostUrls);
    } catch (e: any) {
      console.error('Sitemap: Failed to load static posts fallback:', e.message || e);
    }
  }

  // Fetch products safely
  let dbProducts: any[] = [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, images')
      .or('status.eq.published,status.is.null')
      .is('deletedAt', null);
      
    if (!error && data) {
      dbProducts = data;
    } else if (error) {
      console.warn('Sitemap: Supabase query error for products:', error.message);
    }
  } catch (err: any) {
    console.error('Sitemap: Exception fetching products:', err.message || err);
  }

  const productUrls: MetadataRoute.Sitemap = dbProducts.map((product) => {
    let imagesList: string[] = [];
    if (product.images && Array.isArray(product.images)) {
      imagesList = product.images.filter((img: any) => typeof img === 'string' && img.startsWith('http'));
    }
    return {
      url: `${baseUrl}/product/${product.slug || product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: imagesList,
    };
  });

  // Fallback to static products if DB query yielded no results
  if (productUrls.length === 0) {
    try {
      const { categories: staticCats } = await import('@/src/data/products');
      const staticProducts = staticCats.flatMap(cat => cat.products || []);
      const staticProductUrls: MetadataRoute.Sitemap = staticProducts.map((prod) => {
        const imagesList = [prod.image, ...(prod.variants?.map(v => v.image) || [])].filter(Boolean) as string[];
        return {
          url: `${baseUrl}/product/${prod.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
          images: imagesList,
        };
      });
      productUrls.push(...staticProductUrls);
    } catch (e: any) {
      console.error('Sitemap: Failed to load static products fallback:', e.message || e);
    }
  }

  return [...staticPages, ...productUrls, ...postUrls];
}
