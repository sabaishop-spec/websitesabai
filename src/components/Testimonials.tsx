'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, collection, getDocs } from '../localDB';

export default function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const items: any[] = [];
        if (querySnapshot.docs) {
          querySnapshot.docs.forEach((doc: any) => {
            items.push({ id: doc.id, ...doc.data() });
          });
        }
        
        // Sort by order/createdAt
        items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        
        if (items.length > 0) {
          setTestimonials(items);
        } else {
           setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      }
      setLoading(false);
    };

    fetchTestimonials();

    const handleUpdate = () => {
      fetchTestimonials();
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

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (loading || testimonials.length === 0) {
    return null; // or a loading skeleton
  }

  return (
    <>
    <section className="py-16 md:py-24 lg:py-32 bg-brand-50 relative" id="testimonials">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Tiêu đề nằm trên cùng */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4">{t("Hơn cả sự hài lòng")}</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-brand-950">
            {t("Lời tâm tình từ")} <br className="hidden md:block" /> <span className="font-serif italic font-normal text-[#3DCAA0]">{t("Đồng Niềng")}</span>
          </h3>
        </div>

                {/* Layout with Side Navigation */}
        <div className="relative w-full max-w-6xl mx-auto px-12 md:px-16">
          {/* Nút điều hướng - Trái */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white hover:bg-brand-50 border border-brand-100 text-brand-900 transition-all duration-300 shadow-lg hover:scale-110"
            aria-label="Xem nhận xét trước"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Nút điều hướng - Phải */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white hover:bg-brand-50 border border-brand-100 text-brand-900 transition-all duration-300 shadow-lg hover:scale-110"
            aria-label="Xem nhận xét tiếp theo"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Testimonial Card */}
          <div className="flex flex-col lg:flex-row items-stretch rounded-[2rem] overflow-hidden bg-white border border-brand-100 shadow-xl w-full min-h-[500px] lg:h-[500px]">
            
            {/* Hình ảnh */}
            <div className="w-full lg:w-2/5 relative min-h-[300px] lg:min-h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src={testimonials[currentIndex].avatar || testimonials[currentIndex].image || undefined}
                  alt="Khách hàng"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
            </div>

            {/* Nội dung */}
            <div className="w-full lg:w-3/5 p-8 md:p-12 relative flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex flex-col h-full"
                >
                  <Quote className="absolute top-0 right-0 w-32 h-32 text-brand-50 -mt-8 -mr-8 pointer-events-none" strokeWidth={1} />
                  
                  <div className="flex flex-col flex-grow min-h-0 overflow-y-auto pr-4 mb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-brand-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    <div className="flex items-center gap-1 text-amber-400 mb-6 shrink-0">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-xl md:text-2xl leading-relaxed italic relative z-10 font-medium">
                      &quot;{t(testimonials[currentIndex].content)}&quot;
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 shrink-0">
                    <div className="flex flex-col">
                       {(testimonials[currentIndex].name || testimonials[currentIndex].customerName) && (
                          <span className="text-brand-950 font-bold text-xl">
                            {testimonials[currentIndex].name || testimonials[currentIndex].customerName}
                          </span>
                       )}
                       <div className="flex items-center gap-2 mt-3">
                         {testimonials.map((_, i) => (
                           <button 
                             key={i} 
                             onClick={() => setCurrentIndex(i)}
                             className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[#3DCAA0]' : 'w-2 bg-brand-200 hover:bg-brand-300'}`}
                             aria-label={`Nhận xét ${i + 1}`}
                           />
                         ))}
                       </div>
                    </div>

                    <Link
                      href={testimonials[currentIndex].productId ? `/product/${testimonials[currentIndex].productId}` : `/products`}
                      className="group flex flex-row items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors font-medium text-base bg-brand-50 hover:bg-brand-100 px-6 py-3 rounded-full border border-brand-100 shrink-0"
                    >
                      <span>
                        {t('Xem thêm về')} <span className="font-bold text-[#3DCAA0]">{testimonials[currentIndex].productName || testimonials[currentIndex].product || 'Sản phẩm'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
      </div>
      </div>
    </section>
    <div className="py-12 bg-transparent flex justify-center w-full relative z-10">
      <Link
        href="/products"
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#3DCAA0] hover:bg-[#34b08b] rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 uppercase tracking-wide gap-2"
      >
        {t('Khám phá thêm')}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
    </>
  );
}
