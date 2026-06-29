'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { db, collection, getDocs } from '../localDB';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[], posts: any[] }>({ products: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAllPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blogPosts')
        .select('id, title, slug, excerpt, category, content, status, deletedAt');
        
      if (!error && data) {
         setAllPosts(data.filter((p: any) => (p.status === 'published' || !p.status) && !p.deletedAt));
      }

      const snap = await getDocs(collection(db, 'products'));
      let catData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategories(catData);
    } catch (e) {
      console.error('Error fetching posts for search:', e);
    }
  }, []);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      // Fetch posts once if not fetched yet
      if (allPosts.length === 0) {
        fetchAllPosts();
      }
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setQuery('');
        setResults({ products: [], posts: [] });
      }, 0);
    }
  }, [isOpen, allPosts.length, fetchAllPosts]);

  const performSearch = useCallback((q: string) => {
    const term = q.toLowerCase();

    // 1. Search products
    const matchedProducts: any[] = [];
    categories.forEach(cat => {
      cat.products.forEach(prod => {
        if (
          prod.name.toLowerCase().includes(term) ||
          prod.features?.some(f => f.toLowerCase().includes(term)) ||
          prod.mainUses?.some(u => u.toLowerCase().includes(term)) ||
          prod.ingredients?.some(i => i.toLowerCase().includes(term)) ||
          cat.title.toLowerCase().includes(term)
        ) {
          matchedProducts.push({ ...prod, categoryName: cat.title });
        }
      });
    });

    // 2. Search posts
    const matchedPosts = allPosts.filter(post => 
      post.title?.toLowerCase().includes(term) ||
      post.excerpt?.toLowerCase().includes(term) ||
      post.category?.toLowerCase().includes(term) ||
      post.content?.toLowerCase().includes(term)
    );

    setResults({ products: matchedProducts, posts: matchedPosts });
  }, [allPosts]);

  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => setResults({ products: [], posts: [] }), 0);
      return;
    }

    setLoading(true);
    const searchTimeout = setTimeout(() => {
      performSearch(query);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, performSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-start pt-16 md:pt-24 items-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-[61] flex flex-col max-h-[80vh]"
          >
            {/* Search Input Area */}
            <div className="flex items-center border-b border-gray-100 p-4">
              <Search className="w-6 h-6 text-gray-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Tìm kiếm sản phẩm, bài viết...")}
                className="flex-grow bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {loading && <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />}
              <button
                onClick={onClose}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 bg-gray-100 rounded-lg"
              >
                {t("Đóng")}
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto flex-grow p-4 bg-gray-50/50">
              {!query.trim() ? (
                <div className="text-center text-gray-400 py-12">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>{t("Nhập từ khóa để bắt đầu tìm kiếm...")}</p>
                </div>
              ) : results.products.length === 0 && results.posts.length === 0 && !loading ? (
                <div className="text-center text-gray-500 py-12">
                  <p>{t("Không tìm thấy kết quả nào cho")} &quot;<span className="font-semibold">{query}</span>&quot;</p>
                </div>
              ) : (
                <div className="space-y-8 pb-4">
                  {/* Products */}
                  {results.products.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
                        {t("Sản phẩm")} ({results.products.length})
                      </h3>
                      <div className="grid gap-2">
                        {results.products.map(prod => (
                          <Link 
                            key={`prod-${prod.id}`}
                            href={`/product/${prod.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                          >
                            <img src={prod.image} alt={prod.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors">{prod.name}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{prod.categoryName}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 mr-2 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts */}
                  {results.posts.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
                        {t("Bài viết")} ({results.posts.length})
                      </h3>
                      <div className="grid gap-2">
                        {results.posts.map(post => (
                          <Link 
                            key={`post-${post.id}`}
                            href={`/blog/${post.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                          >
                           {post.thumbnail && (
                             <img src={post.thumbnail} alt={post.title} className="w-16 h-12 object-cover rounded-md bg-gray-100" />
                           )}
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-1">{post.title}</h4>
                              {post.category && <p className="text-xs text-brand-600 font-medium mt-0.5">{post.category}</p>}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 mr-2 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
