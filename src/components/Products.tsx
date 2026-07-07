'use client';
import { motion } from 'motion/react';
import { ArrowRight, CircleCheck as CheckCircle2, Package } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { db, collection, getDocs } from '../localDB';

export interface ProductDetail {
  id: string;
  name: string;
  tag?: string;
  image: string;
  features: string[];
  mainUses: string[];
  specs?: string;
  ingredients?: string[];
  materials?: string[];
  variants?: {
    name: string;
    image: string;
    colorClass: string;
  }[];
}

function ProductCard({ product, index = 0 }: { product: ProductDetail; index?: number }) {
  const { t } = useTranslation();
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Reset image error state when variant changes
  useEffect(() => {
    setImgError(false);
  }, [selectedVariant]);

  const safeVariantIndex = useMemo(() => {
    if (!hasVariants || !product.variants) return 0;
    return selectedVariant >= 0 && selectedVariant < product.variants.length ? selectedVariant : 0;
  }, [selectedVariant, hasVariants, product.variants]);

  const currentImage = hasVariants && product.variants ? product.variants[safeVariantIndex].image : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl p-3 pb-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-300 transition-all duration-300 group flex flex-col h-auto cursor-pointer"
    >
      <Link href={`/product/${product.id}`} className="block flex-grow flex flex-col relative">
        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
            {t(product.tag)}
          </div>
        )}

        {/* Product image */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-3 flex-shrink-0">
          {!imgError && currentImage ? (
            <img
              src={currentImage}
              alt={t(product.name)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <Package className="w-12 h-12 mb-2" strokeWidth={1} />
              <span className="text-xs text-gray-400">{t(product.name)}</span>
            </div>
          )}
        </div>

        {/* Variant selector */}
        {hasVariants && product.variants && (
          <div className="flex items-center gap-2 mb-3 px-1 flex-shrink-0 z-10" onClick={(e) => e.preventDefault()}>
            {product.variants.map((variant, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(idx);
                }}
                className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
                  safeVariantIndex === idx
                    ? 'ring-2 ring-brand-600 ring-offset-2 scale-110'
                    : 'border-2 border-gray-200 hover:scale-110 hover:border-gray-300'
                }`}
                title={t(variant?.name)}
              >
                <span className={`w-full h-full rounded-full ${variant.colorClass}`}></span>
              </button>
            ))}
            <span className="text-xs text-gray-500 ml-1 truncate font-medium">
              {t(product.variants[safeVariantIndex]?.name)}
            </span>
          </div>
        )}

        {/* Product info */}
        <div className="flex-grow flex flex-col px-1">
          <h5 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{t(product?.name)}</h5>
          <ul className="space-y-1.5 mb-4">
            {product.features?.slice(0, 2).map((feature, fIndex) => (
              <li key={fIndex} className="flex items-start text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-brand-500 mr-2 shrink-0 mt-0.5" />
                <span className="leading-tight line-clamp-1">{t(feature)}</span>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <div className="mt-auto pt-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 text-brand-800 text-sm font-semibold group-hover:bg-brand-800 group-hover:text-white transition-colors duration-300">
              {t("Xem chi tiết")}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Products() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        let fetchedCategories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (!fetchedCategories || fetchedCategories.length === 0 || !fetchedCategories[0].products) {
          const { categories: staticCats } = await import('../data/products');
          fetchedCategories = staticCats;
        }

        fetchedCategories.sort((a, b) => {
          const orderA = typeof a.order === 'number' ? a.order : 999;
          const orderB = typeof b.order === 'number' ? b.order : 999;
          if (orderA === orderB) return a.id.localeCompare(b.id);
          return orderA - orderB;
        });

        setCategories(fetchedCategories);
      } catch (e) {
        setCategories([]);
      }
    };
    fetchCats();

    const handleUpdate = () => {
      fetchCats();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-800 font-semibold tracking-wider uppercase text-sm mb-3">{t("Danh Mục Sản Phẩm")}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t("Thiết kế chuyên biệt cho")} <br className="hidden md:block" /> <span className="font-serif italic text-brand-800">{t("Từng giai đoạn chỉnh nha")}</span>
          </h3>
          <p className="text-gray-600 text-lg">
            {t("Sự kết hợp hoàn hảo giữa y khoa và dược liệu tự nhiên. Khám phá các dòng sản phẩm của FURANO giúp bảo vệ nụ cười của bạn.")}
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((category, catIndex) => (
            <div key={category.id} id={category.id} className="scroll-mt-32">
              {/* Category hero image with gradient overlay */}
              {category.heroImage && (
                <div className="w-full h-40 md:h-56 rounded-2xl overflow-hidden mb-8 relative group">
                  <img 
                    src={category.heroImage || undefined} 
                    alt={t(category.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h4 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">{t(category.title)}</h4>
                    {category.description && (
                      <p className="text-white/80 mt-1 text-sm md:text-base max-w-xl">{t(category.description)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Category header (only when no hero image) */}
              {!category.heroImage && (
                <div className="mb-8 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{t(category.title)}</h4>
                    <p className="text-gray-500 mt-2">{t(category.description)}</p>
                  </div>
                  <Link href={`/products`} className="flex items-center text-brand-800 font-medium hover:text-brand-900 group whitespace-nowrap">
                    {t("Xem tất cả")} {t(category.title)} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* "View all" link when hero is present */}
              {category.heroImage && (
                <div className="flex justify-end mb-6">
                  <Link href={`/products`} className="flex items-center text-brand-800 font-medium hover:text-brand-900 group whitespace-nowrap text-sm">
                    {t("Xem tất cả")} {t(category.title)} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Product grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {category.products?.map((product: any, pIndex: number) => (
                  <ProductCard key={product?.id || pIndex} product={product} index={pIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
