'use client';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../localDB';
import { ArrowRight, Check, ArrowDown } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giữ nguyên logic fetch để không phá vỡ chức năng backend
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'about'));
        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (error) {
        console.error("Error fetching about page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Nội dung editorial mới hoàn toàn, hardcode theo yêu cầu
  const content = {
    hero: {
      eyebrow: "VỀ FURANO",
      title: "Chăm sóc nụ cười, từ những ngày còn mắc cài.",
      desc: "FURANO phát triển các giải pháp chăm sóc răng miệng dành riêng cho những nhu cầu xuất hiện trong và sau quá trình chỉnh nha.",
      image: "/images/team-furano.jpeg" // Sử dụng ảnh hiện có trong public/images
    },
    story: {
      title: "FURANO bắt đầu từ một vấn đề rất nhỏ",
      desc1: "Người niềng thường phải dành nhiều thời gian hơn cho việc vệ sinh răng miệng, nhưng phần lớn sản phẩm trên thị trường lại được thiết kế cho nhu cầu chăm sóc thông thường.",
      desc2: "FURANO được xây dựng từ mong muốn tạo ra những giải pháp dễ sử dụng hơn cho từng vấn đề cụ thể: làm sạch quanh mắc cài, chăm sóc nướu, hỗ trợ hơi thở và vệ sinh hàm duy trì.",
      quote: "Không phải một quy trình phức tạp hơn, mà là một quy trình phù hợp hơn.",
      image: "/images/furano-lab.png" // Sử dụng ảnh hiện có trong public/images
    },
    struggles: [
      {
        title: "Những vị trí khó làm sạch",
        desc: "Thức ăn và mảng bám dễ lưu lại ở khu vực quanh dây cung và mắc cài."
      },
      {
        title: "Sự tự tin trong giao tiếp",
        desc: "Cảm giác hơi thở không thơm mát có thể khiến người niềng thiếu tự tin trong ngày dài."
      },
      {
        title: "Chăm sóc không kết thúc khi tháo niềng",
        desc: "Hàm duy trì vẫn cần được làm sạch đúng cách để hạn chế cặn bám và mùi khó chịu."
      }
    ],
    principles: [
      {
        num: "01",
        title: "Đúng với nhu cầu của người niềng",
        desc: "Không chỉ thêm chữ “Ortho” lên bao bì, mỗi sản phẩm cần hướng tới một nhu cầu cụ thể trong hành trình chỉnh nha."
      },
      {
        num: "02",
        title: "Dễ duy trì mỗi ngày",
        desc: "Sản phẩm cần dễ sử dụng, tạo cảm giác dễ chịu và phù hợp với một quy trình chăm sóc có thể thực hiện lâu dài."
      },
      {
        num: "03",
        title: "Thông tin rõ ràng",
        desc: "FURANO ưu tiên giải thích công dụng, cách sử dụng và giới hạn của sản phẩm bằng ngôn ngữ dễ hiểu."
      }
    ],
    journey: [
      {
        phase: "Đang niềng",
        desc: "Làm sạch quanh mắc cài, chăm sóc nướu và duy trì cảm giác hơi thở thơm mát."
      },
      {
        phase: "Vừa tháo niềng",
        desc: "Chăm sóc men răng, làm sạch kỹ và quan sát những khu vực có màu sắc chưa đồng đều."
      },
      {
        phase: "Đeo hàm duy trì",
        desc: "Làm sạch hàm hằng ngày, hạn chế cặn bám và mùi khó chịu."
      }
    ],
    lifestyle: {
      title: "Một quy trình chăm sóc dễ duy trì mỗi ngày",
      desc: "Từ kem đánh răng, sản phẩm hỗ trợ hơi thở đến giải pháp làm sạch hàm duy trì, FURANO hướng tới việc giúp quá trình chăm sóc răng niềng trở nên đơn giản và dễ thực hiện hơn.",
      imgLarge: "/images/team-furano.jpeg",
      imgSmall: "/images/furano-lab.png"
    },
    cta: {
      title: "Bạn đang ở giai đoạn nào của hành trình niềng răng?",
      desc: "Khám phá những sản phẩm và hướng dẫn chăm sóc phù hợp với nhu cầu của bạn."
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-50 flex items-center justify-center animate-pulse"><div className="w-12 h-12 rounded-full border-4 border-brand-900 border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="bg-white selection:bg-brand-100 selection:text-brand-950 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 w-full md:w-1/2 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-gray-500 font-medium tracking-[0.2em] uppercase text-xs mb-8 block">
                {content.hero.eyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-950 leading-[1.15] mb-8">
                {content.hero.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mb-12 font-light">
                {content.hero.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-950 text-white font-medium hover:bg-brand-900 transition-colors"
                >
                  Khám phá sản phẩm
                </Link>
                <a
                  href="#brand-story"
                  className="inline-flex items-center gap-2 text-brand-900 font-medium hover:text-[#3DCAA0] transition-colors group"
                >
                  Hiểu hơn về FURANO
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full md:w-1/2 order-1 md:order-2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-brand-50 rounded-tl-[80px] rounded-br-[80px]"
            >
               <img src={content.hero.image} alt="Nụ cười tự tin" className="w-full h-full object-cover object-center" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Câu chuyện bắt đầu */}
      <section id="brand-story" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-gray-200">
               <img src={content.story.image} alt="Khởi nguồn của FURANO" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-8 leading-tight">
                {content.story.title}
              </h2>
              <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed">
                <p>{content.story.desc1}</p>
                <p>{content.story.desc2}</p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-2xl font-serif text-brand-900 italic leading-snug">
                  "{content.story.quote}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Những ngày niềng răng không phải lúc nào cũng dễ dàng */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-16 md:mb-24"
          >
             <h2 className="text-3xl md:text-4xl font-serif text-brand-950 max-w-2xl leading-tight">
               Những ngày niềng răng không phải lúc nào cũng dễ dàng
             </h2>
          </motion.div>

          {/* Asymmetric layout */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-5/12 flex flex-col justify-end pb-8 border-b border-brand-100"
            >
               <h3 className="text-xl font-medium text-brand-950 mb-4">{content.struggles[0].title}</h3>
               <p className="text-gray-600 font-light leading-relaxed">{content.struggles[0].desc}</p>
            </motion.div>
            
            <div className="md:w-7/12 flex flex-col sm:flex-row gap-8 md:gap-12">
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 pb-8 border-b border-brand-100"
               >
                 <h3 className="text-xl font-medium text-brand-950 mb-4">{content.struggles[1].title}</h3>
                 <p className="text-gray-600 font-light leading-relaxed">{content.struggles[1].desc}</p>
               </motion.div>
               
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 pb-8 border-b border-brand-100"
               >
                 <h3 className="text-xl font-medium text-brand-950 mb-4">{content.struggles[2].title}</h3>
                 <p className="text-gray-600 font-light leading-relaxed">{content.struggles[2].desc}</p>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ba nguyên tắc của FURANO */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-950 text-white">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-20"
          >
             <h2 className="text-3xl md:text-4xl font-serif leading-tight">
               Ba nguyên tắc của FURANO
             </h2>
          </motion.div>

          <div className="flex flex-col">
            {content.principles.map((p, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-16 py-12 border-t border-white/20 first:border-t-0"
              >
                <div className="w-full md:w-1/4">
                  <span className="text-5xl md:text-6xl font-light text-[#3DCAA0]">{p.num}</span>
                </div>
                <div className="w-full md:w-3/4">
                  <h3 className="text-2xl font-serif mb-4">{p.title}</h3>
                  <p className="text-gray-300 font-light text-lg leading-relaxed max-w-2xl">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Hành trình chăm sóc răng niềng */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-20 text-center"
          >
             <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-6">
               Hành trình chăm sóc răng niềng
             </h2>
          </motion.div>

          {/* Desktop Timeline: Horizontal */}
          <div className="hidden md:flex relative justify-between pt-8 pb-12">
             <div className="absolute top-10 left-0 w-full h-[1px] bg-brand-100 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="relative z-10 w-1/3 px-6 flex flex-col items-center text-center group"
               >
                 <div className="w-5 h-5 rounded-full bg-white border border-brand-200 group-hover:border-[#3DCAA0] transition-colors flex items-center justify-center mb-8">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-900 group-hover:bg-[#3DCAA0] transition-colors"></div>
                 </div>
                 <span className="text-sm text-gray-400 font-medium tracking-widest uppercase mb-4 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-xl font-serif text-brand-950 mb-3">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-sm lg:text-base">{item.desc}</p>
               </motion.div>
             ))}
          </div>

          {/* Mobile Timeline: Vertical */}
          <div className="md:hidden flex flex-col relative pl-6 space-y-12">
             <div className="absolute top-2 bottom-2 left-[11px] w-[1px] bg-brand-100 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="relative z-10 pl-8 group"
               >
                 <div className="absolute top-1 -left-[14px] w-5 h-5 rounded-full bg-white border border-brand-200 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-900"></div>
                 </div>
                 <span className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-2 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-lg font-serif text-brand-950 mb-2">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-sm">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. Sản phẩm trong đời sống hằng ngày */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-[1200px] mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              <div className="w-full lg:w-7/12">
                 <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="aspect-[4/3] bg-gray-200 overflow-hidden"
                 >
                   <img src={content.lifestyle.imgLarge} alt="FURANO in daily life" className="w-full h-full object-cover object-center" />
                 </motion.div>
              </div>

              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                 >
                   <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-6 leading-tight">
                     {content.lifestyle.title}
                   </h2>
                   <p className="text-gray-600 font-light text-lg leading-relaxed mb-12">
                     {content.lifestyle.desc}
                   </p>
                 </motion.div>

                 <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="aspect-[3/2] bg-gray-200 overflow-hidden ml-auto w-4/5"
                 >
                   <img src={content.lifestyle.imgSmall} alt="FURANO products" className="w-full h-full object-cover object-center" />
                 </motion.div>
              </div>
           </div>
        </div>
      </section>

      {/* 7. Cộng đồng FURANO */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-16 md:mb-24 text-center"
          >
             <h2 className="text-3xl md:text-4xl font-serif text-brand-950">
               Những nụ cười FURANO đang đồng hành
             </h2>
          </motion.div>

          {/* Asymmetrical Collage Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="col-span-2 md:col-span-2 row-span-2 bg-brand-50 aspect-square flex flex-col items-center justify-center p-8 text-center"
             >
                <div className="w-12 h-12 rounded-full bg-brand-100 mb-4 opacity-50"></div>
                <p className="text-brand-900/40 italic font-serif">"Placeholder cho nội dung chia sẻ của khách hàng hoặc hình ảnh lifestyle"</p>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="col-span-1 bg-gray-50 aspect-square flex items-center justify-center p-4 text-center"
             >
                <span className="text-gray-300 text-xs uppercase tracking-widest">Ảnh cộng đồng 1</span>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="col-span-1 bg-brand-50 aspect-[3/4] md:aspect-square flex flex-col justify-end p-6"
             >
                <div className="w-8 h-2 bg-brand-200 mb-2 opacity-50"></div>
                <div className="w-16 h-2 bg-brand-100 opacity-50"></div>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="col-span-2 bg-gray-50 aspect-[2/1] md:aspect-[2/1] flex items-center justify-center p-4 text-center"
             >
                <span className="text-gray-300 text-xs uppercase tracking-widest">Hình ảnh review ngang</span>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 8. CTA cuối trang */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-950 text-white text-center">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              {content.cta.title}
            </h2>
            <p className="text-gray-300 mb-12 text-lg font-light max-w-2xl mx-auto">
              {content.cta.desc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-950 font-medium hover:bg-brand-50 transition-colors"
              >
                Tìm sản phẩm phù hợp
              </Link>
              <Link
                href="/blog"
                className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Xem cẩm nang chăm sóc
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

