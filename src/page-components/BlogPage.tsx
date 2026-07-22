'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

function BlogPageContent({ initialPosts, initialCategories }: { initialPosts: any[], initialCategories: string[] }) {
  const { t, i18n } = useTranslation();
  const settings = useSiteSettings();
  const searchParams = useSearchParams();
  const initialCategoryQuery = searchParams?.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryQuery || null);
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredPosts = selectedCategory
    ? initialPosts.filter(p => p.category === selectedCategory)
    : initialPosts;

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setVisibleCount(12);
    if (typeof window !== 'undefined') {
      const url = cat ? `/blog?category=${encodeURIComponent(cat)}` : '/blog';
      window.history.pushState({}, '', url);
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, filteredPosts.length));
  };
  
  const getLocalized = (post: any, field: string) => {
    if (i18n.language === 'en' && post[`${field}_en`]) {
      return post[`${field}_en`];
    }
    return post[field];
  };

  return (
    <main className="pt-24 pb-24 min-h-screen bg-brand-50 relative">
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-80 left-0 -translate-x-1/4 w-[500px] h-[500px] bg-brand-300/30 rounded-full blur-3xl opacity-50" />
      </div>
      
      {settings?.blogCoverImage && (
        <div className="w-full relative overflow-hidden mb-12 flex justify-center bg-brand-950 mx-auto z-10">
           <img src={settings.blogCoverImage} alt={t("Blog")} className="w-full h-auto max-h-[50vh] object-contain" />
           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
             <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">{selectedCategory || t("Blog")}</h1>
           </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!settings?.blogCoverImage && (
          <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-950 mb-4 relative z-10">{selectedCategory || <>{t("Cẩm Nang")} <span className="font-serif italic text-[#3DCAA0]">{t("Chăm sóc nụ cười")}</span></>}</h1>
            <p className="text-lg text-gray-600">
              {t("Kiến thức chuyên sâu và hướng dẫn chi tiết giúp bạn tự tin hơn trong suốt quá trình niềng răng.")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-10 items-center">
             <button onClick={() => handleCategoryChange(null)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${!selectedCategory ? 'bg-brand-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>Tất cả</button>
             {initialCategories.map((cat: string) => (
                 <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${selectedCategory === cat ? 'bg-brand-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                    {cat}
                 </button>
             ))}
        </div>

        {filteredPosts.length === 0 ? (
           <div className="text-center py-20 text-gray-500">Không có bài viết nào trong chuyên mục này.</div>
        ) : (
           <>
            {/* Featured Post + Recent Posts Layout */}
            {filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                {/* Featured Post - Large */}
                <Link href={`/blog/${filteredPosts[0].slug || filteredPosts[0].id}`} className="lg:col-span-7 block group cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      <img 
                        src={filteredPosts[0].image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200'} 
                        alt={getLocalized(filteredPosts[0], 'title')} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-full shadow-lg">
                          ⭐ {t("Bài viết nổi bật")}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="flex items-center text-white/80 text-xs mb-3">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {getLocalized(filteredPosts[0], 'date')}
                          {filteredPosts[0].category && (
                            <span className="ml-3 px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-xs">{getLocalized(filteredPosts[0], 'category')}</span>
                          )}
                        </div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-brand-200 transition-colors line-clamp-2">
                          {getLocalized(filteredPosts[0], 'title')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl">
                          {getLocalized(filteredPosts[0], 'excerpt') || filteredPosts[0].seoDescription || ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Side Recent Posts - Stacked */}
                {filteredPosts.length > 1 && (
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-brand-800 mb-1">{t("Bài viết mới")}</h3>
                    {filteredPosts.slice(1, 5).map((post, index) => (
                      <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="block group cursor-pointer">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.08 }}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex h-[100px] hover:shadow-md hover:border-brand-200 transition-all duration-300"
                        >
                          <div className="w-[130px] flex-shrink-0 bg-gray-100 overflow-hidden">
                            <img 
                              src={post.image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400'} 
                              alt={getLocalized(post, 'title')} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full truncate">{getLocalized(post, 'category')}</span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0"><Clock className="w-2.5 h-2.5" />{getLocalized(post, 'date')}</span>
                            </div>
                            <h4 className="text-sm font-bold text-brand-950 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
                              {getLocalized(post, 'title')}
                            </h4>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Remaining Posts Grid */}
            {filteredPosts.length > 5 && (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-lg font-bold text-brand-950">{t("Tất cả bài viết")}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPosts.slice(5, visibleCount).map((post, index) => (
                    <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="block group cursor-pointer h-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md hover:border-brand-200 transition-all duration-300"
                      >
                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                          <img 
                            src={post.image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'} 
                            alt={getLocalized(post, 'title')} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold rounded-full shadow-sm">
                              {getLocalized(post, 'category')}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex items-center text-gray-500 text-xs mb-2.5">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {getLocalized(post, 'date')}
                          </div>
                          <h4 className="text-base font-bold text-brand-950 mb-2 group-hover:text-brand-800 transition-colors line-clamp-2 leading-snug">
                            {getLocalized(post, 'title')}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                            {getLocalized(post, 'excerpt') || post.seoDescription || '...'}
                          </p>
                          <div className="mt-auto pt-3 flex items-center text-sm font-medium text-brand-800 border-t border-gray-50">
                            {t("Đọc tiếp")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </>
            )}

        {visibleCount < filteredPosts.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            >
              {t("Xem thêm")} ({filteredPosts.length - visibleCount})
            </button>
          </div>
        )}
        </>
        )}
      </div>
    </main>
  );
}

export default function BlogPage({ initialPosts, initialCategories }: { initialPosts: any[], initialCategories: string[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <BlogPageContent initialPosts={initialPosts} initialCategories={initialCategories} />
    </Suspense>
  );
}
