const fs = require('fs');
const file = 'src/components/Testimonials.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `        {/* Bố cục 5/5 -> 1/2 và 1/2 */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-6xl mx-auto">
          
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[380px] rounded-[2rem] overflow-hidden">
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

          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[380px] flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-[2rem] relative flex flex-col justify-center w-full"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" strokeWidth={1} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  {(testimonials[currentIndex].name || testimonials[currentIndex].customerName) && (
                     <div className="text-white/80 font-medium italic border-b border-white/20 pb-0.5">
                       {testimonials[currentIndex].name || testimonials[currentIndex].customerName}
                     </div>
                  )}
                </div>
                
                <p className="text-brand-50 text-lg md:text-xl leading-relaxed italic relative z-10 flex-grow">
                  &quot;{t(testimonials[currentIndex].content)}&quot;
                </p>

                <div className="mt-6 flex flex-col xl:flex-row items-center xl:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center w-full xl:w-auto">
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                      aria-label="Xem nhận xét trước"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {testimonials.map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setCurrentIndex(i)}
                          className={`h-2 rounded-full transition-all duration-300 \${i === currentIndex ? 'w-8 bg-brand-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                          aria-label={\`Nhận xét \${i + 1}\`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                      aria-label="Xem nhận xét tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <Link
                    href={testimonials[currentIndex].productId ? \`/product/\${testimonials[currentIndex].productId}\` : \`/products\`}
                    className="group flex flex-row items-center gap-2 text-brand-300 hover:text-brand-100 transition-colors font-medium text-base md:text-lg w-full xl:w-auto justify-center xl:justify-end text-center xl:text-right"
                  >
                    <span>
                      {t('Xem thêm về')} <span className="font-bold underline underline-offset-4">{testimonials[currentIndex].productName || testimonials[currentIndex].product || 'Sản phẩm FURANO'}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>`;

const replacement = `        {/* Layout with Side Navigation */}
        <div className="relative w-full max-w-6xl mx-auto px-12 md:px-16">
          {/* Nút điều hướng - Trái */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-500 border border-white/20 text-white backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110"
            aria-label="Xem nhận xét trước"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Nút điều hướng - Phải */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-500 border border-white/20 text-white backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110"
            aria-label="Xem nhận xét tiếp theo"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Testimonial Card */}
          <div className="flex flex-col lg:flex-row items-stretch rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl backdrop-blur-lg w-full">
            
            {/* Hình ảnh */}
            <div className="w-full lg:w-2/5 relative min-h-[300px] lg:min-h-[420px]">
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
                  <Quote className="absolute top-0 right-0 w-24 h-24 text-white/5 -mt-4 -mr-4 pointer-events-none" strokeWidth={1} />
                  
                  <div className="flex flex-col mb-6">
                    <div className="flex items-center gap-1 text-amber-400 mb-6">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-white text-xl md:text-2xl leading-relaxed italic relative z-10 font-medium">
                      &quot;{t(testimonials[currentIndex].content)}&quot;
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex flex-col">
                       {(testimonials[currentIndex].name || testimonials[currentIndex].customerName) && (
                          <span className="text-white font-bold text-xl">
                            {testimonials[currentIndex].name || testimonials[currentIndex].customerName}
                          </span>
                       )}
                       <div className="flex items-center gap-2 mt-3">
                         {testimonials.map((_, i) => (
                           <button 
                             key={i} 
                             onClick={() => setCurrentIndex(i)}
                             className={\`h-2 rounded-full transition-all duration-300 \${i === currentIndex ? 'w-8 bg-brand-400' : 'w-2 bg-white/20 hover:bg-white/40'}\`}
                             aria-label={\`Nhận xét \${i + 1}\`}
                           />
                         ))}
                       </div>
                    </div>

                    <Link
                      href={testimonials[currentIndex].productId ? \`/product/\${testimonials[currentIndex].productId}\` : \`/products\`}
                      className="group flex flex-row items-center gap-2 text-brand-300 hover:text-white transition-colors font-medium text-base bg-white/5 hover:bg-brand-600 px-5 py-2.5 rounded-full border border-white/10 hover:border-transparent shrink-0"
                    >
                      <span>
                        {t('Xem thêm về')} <span className="font-bold">{testimonials[currentIndex].productName || testimonials[currentIndex].product || 'Sản phẩm'}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>`;

if (content.includes(target)) {
    fs.writeFileSync(file, content.replace(target, replacement));
    console.log("Success");
} else {
    console.log("Target not found!");
}
