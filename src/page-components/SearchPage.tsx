import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search as SearchIcon, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { searchPosts } from '../localDB';
import DOMPurify from 'isomorphic-dompurify';

import Header from '../components/Header';
import Footer from '../components/Footer';

// A utility to highlight matching terms safely
const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim() || !text) {
    return <span>{text || ''}</span>;
  }
  
  // We want to highlight case-insensitive and accent-insensitive ideally,
  // but standard regex replace is easier for just exact/case-insensitive match.
  // Full accent-insensitive highlight is fairly complex in JS without large libraries.
  // Let's do a simple case-insensitive highlighting first.
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((p, i) => 
        regex.test(p) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
};

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [prevQuery, setPrevQuery] = useState(query);
  
  if (query !== prevQuery) {
    setPrevQuery(query);
    setPage(1);
    setResults([]);
  }
  
  const limit = 12;

  useEffect(() => {
    let active = true;

    const performSearch = async (pageNum: number) => {
      if (!query) {
        setResults([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await searchPosts(query, pageNum, limit);
        if (active) {
          if (pageNum === 1) {
            setResults(res.docs);
          } else {
            setResults(prev => [...prev, ...res.docs]);
          }
          setTotal(res.total);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Lỗi khi tải kết quả tìm kiếm.');
      } finally {
        if (active) setLoading(false);
      }
    };
    
    performSearch(page);

    return () => {
      active = false;
    };
  }, [query, page]);

  useEffect(() => {
    // When query changes, reset page to 1
    // We use a separate state reset to avoid loop, but since we want to avoid cascading setState inside effect body:
    // It's better to reset page inside the main flow, or just reset state when query changes directly.
  }, [query]);

  const loadMore = () => setPage(p => p + 1);

  const getLocalized = (obj: any, key: string) => {
    if (!obj || !obj[key]) return '';
    if (typeof obj[key] === 'string') return obj[key];
    const lang = i18n.language === 'en' ? 'en' : 'vi';
    return obj[key][lang] || obj[key]['vi'] || obj[key]['en'] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <div className="mb-10 lg:mb-16">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-4">
             {t("Kết quả tìm kiếm cho")}: <span className="text-brand-800">&quot;{query}&quot;</span>
          </h1>
          <p className="text-gray-600 text-lg">
             {loading && page === 1 ? t("Đang tìm kiếm...") : (
                <>
                   {t("Tìm thấy")} <span className="font-bold text-gray-900">{total}</span> {t("kết quả phù hợp")}
                </>
             )}
          </p>
        </div>

        {error && (
            <div className="text-center py-20 text-red-500">
               <p>{error}</p>
               <button onClick={() => performSearch(1)} className="mt-4 px-6 py-2 bg-brand-800 text-white rounded-full">Thử lại</button>
            </div>
        )}

        {loading && page === 1 && !error ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {[1,2,3,4].map(n => (
                 <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse h-80 flex flex-col">
                    <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded-md mt-auto"></div>
                 </div>
               ))}
            </div>
        ) : !loading && total === 0 && !error ? (
           <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Không tìm thấy kết quả nào với từ khóa này.</p>
              <p className="text-gray-400 mt-2">Vui lòng thử lại bằng một từ khóa khác ngắn gọn hơn.</p>
           </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map((post, index) => {
                 const title = getLocalized(post, 'title');
                 const excerpt = getLocalized(post, 'excerpt') || post.seoDescription;
                 return (
                    <Link href={`/blog/${post.id}`} key={post.id} className="block group cursor-pointer h-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                          {post.image ? (
                             <img 
                               src={post.image} 
                               alt={title} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                             />
                          ) : (
                             <ImageIcon className="w-12 h-12 text-gray-300" />
                          )}
                          
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold rounded-full shadow-sm">
                              {getLocalized(post, 'category') || t("Bài viết")}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="flex items-center text-gray-500 text-xs mb-3">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {getLocalized(post, 'date')}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-800 transition-colors line-clamp-2">
                             <HighlightedText text={title} highlight={query} />
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                             <HighlightedText text={excerpt} highlight={query} />
                          </p>
                          <div className="mt-auto flex items-center text-sm font-medium text-brand-800 border-t border-gray-50 pt-4">
                            {t("Đọc tiếp")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                 )
              })}
            </div>

            {results.length < total && (
              <div className="mt-16 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? t("Đang tải...") : t("Xem thêm")} ({total - results.length})
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
