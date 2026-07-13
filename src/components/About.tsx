'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { db, doc, getDoc } from '../localDB';
import { ArrowDown } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'about'));
        if (snap.exists()) {
          setData(snap.data());
        }
        const snapSettings = await getDoc(doc(db, 'settings', 'site'));
        if (snapSettings.exists()) {
          setSettings(snapSettings.data());
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const content = {
    hero: {
      eyebrow: "VỀ FURANO",
      title: data?.heroTitle || "Chăm sóc nụ cười, từ những ngày còn mắc cài.",
      desc: data?.heroSubtitle || "FURANO phát triển các giải pháp chăm sóc răng miệng dành riêng cho những nhu cầu xuất hiện trong và sau quá trình chỉnh nha.",
      image: "/images/team-furano.jpeg"
    },
    story: {
      title: "Câu chuyện FURANO",
      desc1: "Từ mong muốn giúp việc chăm sóc răng miệng trong quá trình chỉnh nha trở nên đơn giản và dễ duy trì hơn, FURANO từng bước phát triển những giải pháp phù hợp với nhu cầu của người đang niềng, vừa tháo niềng và đeo hàm duy trì.",
      desc2: "Người niềng thường phải dành nhiều thời gian hơn cho việc vệ sinh răng miệng. Những khu vực quanh mắc cài, dây cung hoặc hàm duy trì cũng cần cách chăm sóc phù hợp hơn so với nhu cầu thông thường.",
      desc3: "FURANO được xây dựng với mong muốn đồng hành cùng người dùng trong từng giai đoạn của hành trình chỉnh nha: từ làm sạch quanh mắc cài, chăm sóc nướu, hỗ trợ hơi thở đến vệ sinh hàm duy trì.",
      quote: "Không phải tạo ra một quy trình phức tạp hơn, mà là xây dựng một quy trình phù hợp và dễ thực hiện hơn mỗi ngày.",
      image: "/images/furano-lab.png" 
    },
    missionVision: {
      mission: data?.missionText || "Phát triển các giải pháp chăm sóc răng miệng chất lượng, dễ sử dụng và phù hợp với nhu cầu của người đang trong và sau quá trình chỉnh nha.",
      vision: data?.visionText || "Trở thành thương hiệu chăm sóc răng niềng được người dùng tin tưởng, đồng hành cùng khách hàng trong hành trình hướng tới một nụ cười khỏe mạnh và tự tin.",
      philosophy: data?.philosophyText || "FURANO không chỉ cung cấp sản phẩm mà còn hướng tới việc cung cấp kiến thức, hướng dẫn và sự đồng hành cần thiết trong từng giai đoạn chăm sóc răng niềng.",
      philosophyHighlight: "Không chỉ cung cấp sản phẩm, FURANO hướng tới sự đồng hành lâu dài."
    },
    team: {
      title: "Đội ngũ FURANO",
      text1: data?.teamText1 || "FURANO được xây dựng bởi đội ngũ quan tâm đến lĩnh vực chăm sóc răng miệng và thấu hiểu những bất tiện thường gặp trong quá trình chỉnh nha.",
      text2: data?.teamText2 || "Từ việc nghiên cứu nhu cầu người dùng, lựa chọn sản phẩm đến xây dựng nội dung hướng dẫn, đội ngũ FURANO hướng tới một mục tiêu chung: giúp việc chăm sóc răng niềng trở nên rõ ràng, thuận tiện và dễ duy trì hơn.",
      highlight: "Tận tâm trong từng giải pháp\nThấu hiểu trong từng trải nghiệm",
      image: data?.teamImage || "/images/team-furano.jpeg"
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
    commitments: [
      {
        num: "01",
        title: "An toàn",
        desc: "FURANO ưu tiên lựa chọn các sản phẩm có thông tin sử dụng rõ ràng và phù hợp với nhu cầu chăm sóc răng miệng hằng ngày."
      },
      {
        num: "02",
        title: "Dịu nhẹ",
        desc: "Trải nghiệm sử dụng cần phù hợp với những người có răng, nướu hoặc khoang miệng nhạy cảm trong quá trình chỉnh nha."
      },
      {
        num: "03",
        title: "Minh bạch thông tin",
        desc: "Thành phần, công dụng, cách sử dụng và những lưu ý quan trọng cần được trình bày rõ ràng để người dùng có thể lựa chọn phù hợp."
      }
    ],
    coreValues: [
      {
        title: "Thấu hiểu",
        desc: "FURANO bắt đầu từ những khó khăn thực tế của người đang niềng, vừa tháo niềng và đeo hàm duy trì."
      },
      {
        title: "Đổi mới",
        desc: "Liên tục cập nhật nhu cầu người dùng, kiến thức chăm sóc và các giải pháp phù hợp với quá trình chỉnh nha."
      },
      {
        title: "Chất lượng",
        desc: "Ưu tiên thông tin rõ ràng, quy trình lựa chọn cẩn thận và trải nghiệm sử dụng phù hợp."
      },
      {
        title: "Cộng đồng",
        desc: "Xây dựng một không gian chia sẻ kiến thức và kinh nghiệm chăm sóc răng miệng dành cho cộng đồng niềng răng."
      }
    ],
    principles: [
      {
        num: "01",
        title: "Đúng với nhu cầu của người niềng",
        desc: "Mỗi giải pháp cần hướng tới một nhu cầu cụ thể trong hành trình chỉnh nha."
      },
      {
        num: "02",
        title: "Dễ duy trì mỗi ngày",
        desc: "Sản phẩm cần dễ sử dụng, tạo cảm giác dễ chịu và phù hợp với một quy trình chăm sóc lâu dài."
      },
      {
        num: "03",
        title: "Thông tin rõ ràng",
        desc: "Công dụng, cách sử dụng và giới hạn sản phẩm cần được giải thích bằng ngôn ngữ dễ hiểu."
      }
    ],
    science: {
      title: "Phát triển dựa trên sự thấu hiểu",
      text1: "Mỗi giải pháp được FURANO lựa chọn dựa trên nhu cầu thực tế của người dùng trong quá trình chỉnh nha.",
      text2: "FURANO chú trọng tới thành phần, công dụng, cách sử dụng và trải nghiệm hằng ngày, đồng thời trình bày thông tin theo cách dễ hiểu để người dùng có thể đưa ra lựa chọn phù hợp.",
      checks: data?.scienceChecks && data.scienceChecks.length > 0 ? data.scienceChecks : [
        "Thông tin thành phần rõ ràng.",
        "Hướng dẫn sử dụng cụ thể.",
        "Phù hợp với từng giai đoạn chỉnh nha.",
        "Ưu tiên trải nghiệm dễ chịu và dễ duy trì.",
        "Nội dung chăm sóc được trình bày dễ hiểu."
      ],
      image: data?.labImage || "/images/furano-lab.png"
    },
    journey: [
      {
        phase: "Đang niềng",
        desc: "Làm sạch quanh mắc cài, chăm sóc nướu và duy trì cảm giác hơi thở thơm mát.",
        link: "/products?category=dang-nieng"
      },
      {
        phase: "Vừa tháo niềng",
        desc: "Chăm sóc men răng, làm sạch kỹ và quan sát những khu vực có màu sắc chưa đồng đều.",
        link: "/products?category=thao-nieng"
      },
      {
        phase: "Đeo hàm duy trì",
        desc: "Làm sạch hàm hằng ngày, hạn chế cặn bám và mùi khó chịu.",
        link: "/products?category=ham-duy-tri"
      }
    ],
    lifestyle: {
      title: "Một quy trình chăm sóc dễ duy trì mỗi ngày",
      desc: "Từ sản phẩm chăm sóc răng miệng, hỗ trợ hơi thở đến giải pháp làm sạch hàm duy trì, FURANO hướng tới việc giúp quá trình chăm sóc răng niềng trở nên đơn giản và dễ thực hiện hơn.",
      imgLarge: "/images/team-furano.jpeg",
      imgSmall: "/images/furano-lab.png"
    },
    cta: {
      title: "Trở thành một phần của cộng đồng FURANO",
      desc: "Khám phá sản phẩm và bắt đầu xây dựng quy trình chăm sóc răng niềng phù hợp với bạn."
    },
    timelineFallback: [
      { year: "2018", text: "FURANO được thành lập", side: "left" },
      { year: "2019", text: "Ra mắt dòng sản phẩm Ortho chuyên biệt", side: "right" },
      { year: "2021", text: "Giành được giải thưởng Oral-Care New-Star Brand từ Shopee", side: "left" },
      { year: "2023", text: "Mở rộng sang 3 nước Đông Nam Á", side: "right" },
      { year: "2024", text: "Nhận danh hiệu 5 star Health-care shop từ Tiktok shop", side: "left" }
    ]
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-50 flex items-center justify-center animate-pulse"><div className="w-12 h-12 rounded-full border-4 border-brand-900 border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="bg-white selection:bg-brand-100 selection:text-brand-950 font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAF9F7] pt-20">
        {/* Massive background text */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h1 className="text-[20vw] font-black text-brand-950 whitespace-nowrap leading-none select-none">
            FURANO
          </h1>
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="inline-block py-2 px-6 rounded-full bg-brand-950 text-white text-xs font-bold tracking-widest uppercase mb-8"
          >
            {content.hero.eyebrow}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-950 leading-[1.1] mb-8 max-w-4xl mx-auto"
          >
            {content.hero.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl text-gray-600 font-light mb-16 max-w-2xl mx-auto"
          >
            {content.hero.desc}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
             <a href="#story" className="inline-flex flex-col items-center gap-4 text-brand-900 hover:text-[#3DCAA0] transition-colors group">
               <span className="text-sm uppercase tracking-widest font-bold">Khám phá</span>
               <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                 <ArrowDown className="w-5 h-5 animate-bounce" />
               </div>
             </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Câu chuyện FURANO (Sticky Scroll) */}
      <section id="story" className="relative bg-white py-12 md:py-0">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
          {/* Sticky Image Side */}
          <div className="md:w-1/2 md:h-screen md:sticky md:top-0 p-4 md:p-12 lg:p-20 flex items-center justify-center">
            <div className="relative w-full aspect-square md:h-full md:aspect-auto rounded-[40px] overflow-hidden shadow-2xl">
              <img src={content.story.image} alt="Câu chuyện FURANO" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-12 left-10 right-10">
                <h3 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">{content.story.title}</h3>
                <div className="w-20 h-1.5 bg-[#3DCAA0]"></div>
              </div>
            </div>
          </div>
          
          {/* Scrolling Text Side */}
          <div className="md:w-1/2 p-4 md:p-12 lg:p-24 md:py-[30vh]">
            <div className="max-w-xl mx-auto space-y-32">
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.8 }}>
                <p className="text-3xl md:text-4xl font-light text-brand-950 leading-[1.6]">
                  {content.story.desc1}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.8 }}>
                <p className="text-3xl md:text-4xl font-light text-brand-950 leading-[1.6]">
                  {content.story.desc2}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.8 }}>
                <p className="text-3xl md:text-4xl font-light text-brand-950 leading-[1.6]">
                  {content.story.desc3}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.8 }} className="p-10 md:p-12 bg-brand-50 rounded-3xl border-l-8 border-[#3DCAA0]">
                <p className="text-2xl md:text-3xl font-serif text-brand-900 italic leading-relaxed">
                  "{content.story.quote}"
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sứ mệnh - Tầm nhìn - Triết lý */}
      <section className="py-24 md:py-40 bg-brand-50 px-4 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-12 md:p-16 rounded-[40px] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <span className="absolute -right-8 -top-12 text-[200px] font-black text-brand-50/50 group-hover:text-brand-100 transition-colors pointer-events-none select-none">01</span>
              <div className="relative z-10">
                <h3 className="text-4xl font-serif text-brand-950 mb-8">Sứ mệnh</h3>
                <p className="text-gray-600 font-light text-xl leading-relaxed">{content.missionVision.mission}</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-12 md:p-16 rounded-[40px] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 lg:translate-y-24">
              <span className="absolute -right-8 -top-12 text-[200px] font-black text-brand-50/50 group-hover:text-brand-100 transition-colors pointer-events-none select-none">02</span>
              <div className="relative z-10">
                <h3 className="text-4xl font-serif text-brand-950 mb-8">Tầm nhìn</h3>
                <p className="text-gray-600 font-light text-xl leading-relaxed">{content.missionVision.vision}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-white p-12 md:p-16 rounded-[40px] shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 lg:translate-y-48">
              <span className="absolute -right-8 -top-12 text-[200px] font-black text-brand-50/50 group-hover:text-brand-100 transition-colors pointer-events-none select-none">03</span>
              <div className="relative z-10">
                <h3 className="text-4xl font-serif text-brand-950 mb-8">Triết lý</h3>
                <p className="text-gray-600 font-light text-xl leading-relaxed mb-8">{content.missionVision.philosophy}</p>
                <p className="font-serif text-[#3DCAA0] text-2xl leading-relaxed">"{content.missionVision.philosophyHighlight}"</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Những ngày niềng răng */}
      <section className="py-24 md:py-40 bg-brand-950 text-white px-4 lg:mt-32">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif mb-20 max-w-4xl leading-[1.1]">
            Những ngày niềng răng không phải lúc nào cũng dễ dàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/20 pt-20">
            {content.struggles.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}>
                <div className="text-[#3DCAA0] mb-6">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </div>
                <h3 className="text-3xl font-medium mb-6">{item.title}</h3>
                <p className="text-gray-300 font-light text-xl leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Những điều FURANO ưu tiên */}
      <section className="py-24 md:py-40 px-4 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-2/5">
              <h2 className="text-5xl md:text-7xl font-serif text-brand-950 leading-[1.1] lg:sticky lg:top-40">
                Những điều FURANO ưu tiên
              </h2>
            </div>
            <div className="lg:w-3/5 space-y-8">
              {content.commitments.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ margin: "-10%" }}
                  className="bg-[#FAF9F7] p-10 md:p-16 rounded-[40px] flex flex-col sm:flex-row gap-8 sm:gap-12 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-6xl md:text-8xl font-serif text-[#3DCAA0] leading-none">{item.num}</span>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-serif text-brand-950 mb-6">{item.title}</h3>
                    <p className="text-gray-600 font-light text-xl leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Giá trị cốt lõi */}
      <section className="py-24 md:py-40 px-4 bg-brand-900 text-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif text-center mb-24">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.coreValues.map((val, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="bg-brand-950/50 border border-brand-800 p-10 md:p-12 rounded-[40px] text-center">
                <div className="w-20 h-20 mx-auto bg-brand-800 rounded-full flex items-center justify-center mb-8">
                  <div className="w-5 h-5 bg-[#3DCAA0] rounded-full"></div>
                </div>
                <h3 className="text-3xl font-serif mb-6">{val.title}</h3>
                <p className="text-gray-300 font-light text-lg leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Hành trình của FURANO (Timeline) */}
      {(data?.timeline?.length > 0 ? data.timeline : content.timelineFallback)?.length > 0 && (
        <section className="py-24 md:py-40 px-4 bg-white overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif text-brand-950 mb-32 text-center">Hành trình của chúng tôi</h2>
            <div className="space-y-40">
              {(data?.timeline?.length > 0 ? data.timeline : content.timelineFallback).map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }}
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group"
                >
                  <div className={`w-full md:w-1/2 flex ${idx % 2 === 0 ? 'justify-end md:order-1' : 'justify-start md:order-2'}`}>
                    <span className="text-[120px] md:text-[200px] font-black text-[#FAF9F7] group-hover:text-[#3DCAA0] transition-colors leading-none tracking-tighter">
                      {item.year}
                    </span>
                  </div>
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:order-2 text-left' : 'md:order-1 md:text-right'}`}>
                    <p className="text-3xl md:text-4xl font-light text-brand-950 leading-relaxed border-b-4 border-brand-50 pb-8 group-hover:border-[#3DCAA0] transition-colors">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Ba nguyên tắc & Phát triển */}
      <section className="py-24 md:py-40 px-4 sm:px-6 lg:px-8 bg-[#FAF9F7]">
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center gap-20">
          <div className="flex-1 w-full order-2 xl:order-1">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl"
             >
                <img src={content.science.image} alt="Phát triển sản phẩm FURANO" className="w-full h-full object-cover" />
             </motion.div>
          </div>
          <div className="flex-1 w-full order-1 xl:order-2">
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
                <h2 className="text-4xl md:text-6xl font-serif text-brand-950 mb-10 leading-[1.1]">{content.science.title}</h2>
                <div className="space-y-6 text-gray-600 font-light text-xl leading-relaxed mb-12">
                   <p>{content.science.text1}</p>
                   <p>{content.science.text2}</p>
                </div>
                
                <ul className="space-y-6">
                  {content.science.checks.map((check: string, idx: number) => (
                     <li key={idx} className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm">
                       <span className="w-3 h-3 rounded-full bg-[#3DCAA0] mt-2.5 flex-shrink-0"></span>
                       <span className="text-brand-950 text-lg leading-relaxed font-medium">{check}</span>
                     </li>
                  ))}
                </ul>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Hành trình chăm sóc răng niềng */}
      <section className="py-24 md:py-40 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-24 text-center"
          >
             <h2 className="text-5xl md:text-7xl font-serif text-brand-950 mb-6">
               Hành trình chăm sóc
             </h2>
          </motion.div>

          {/* Desktop Timeline */}
          <div className="hidden md:flex relative justify-between pt-12 pb-16">
             <div className="absolute top-16 left-0 w-full h-[2px] bg-brand-50 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.2 }}
                 className="relative z-10 w-1/3 px-8 flex flex-col items-center text-center group"
               >
                 <div className="w-8 h-8 rounded-full bg-white border-4 border-brand-100 group-hover:border-[#3DCAA0] transition-colors flex items-center justify-center mb-10">
                   <div className="w-2 h-2 rounded-full bg-brand-900 group-hover:bg-[#3DCAA0] transition-colors"></div>
                 </div>
                 <span className="text-sm text-gray-400 font-bold tracking-[0.2em] uppercase mb-6 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-3xl font-serif text-brand-950 mb-6">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-lg mb-8">{item.desc}</p>
                 <Link href={item.link} className="text-lg font-medium text-brand-900 hover:text-[#3DCAA0] transition-colors underline underline-offset-8 decoration-brand-200 hover:decoration-[#3DCAA0]">
                   Khám phá sản phẩm
                 </Link>
               </motion.div>
             ))}
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden flex flex-col relative pl-8 space-y-16">
             <div className="absolute top-4 bottom-4 left-[15px] w-[2px] bg-brand-50 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="relative z-10 pl-10 group"
               >
                 <div className="absolute top-2 -left-[21px] w-8 h-8 rounded-full bg-white border-4 border-brand-100 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-[#3DCAA0]"></div>
                 </div>
                 <span className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-3 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-2xl font-serif text-brand-950 mb-4">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-lg mb-6">{item.desc}</p>
                 <Link href={item.link} className="text-lg font-medium text-brand-900 hover:text-[#3DCAA0] underline underline-offset-8">
                   Khám phá
                 </Link>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 10. Thông tin công ty */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50 rounded-t-[80px] lg:rounded-t-[120px]">
        <div className="max-w-[1200px] mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                 <h2 className="text-5xl font-serif text-brand-950 mb-10">Liên hệ FURANO</h2>
                 <p className="text-gray-600 font-light text-xl leading-relaxed mb-16 max-w-lg">
                   Nếu bạn cần hỗ trợ về sản phẩm hoặc quá trình chăm sóc răng niềng, đừng ngần ngại liên hệ với chúng tôi.
                 </p>
                 
                 <div className="space-y-10">
                   <div>
                     <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Tên công ty</h4>
                     <p className="text-brand-950 text-xl font-medium">{settings?.companyName || "CÔNG TY TNHH FURANO"}</p>
                   </div>
                   <div>
                     <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Địa chỉ</h4>
                     <p className="text-brand-950 text-xl font-medium max-w-sm leading-relaxed">{settings?.address || "Hà Nội, Việt Nam"}</p>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-10">
                     <div>
                       <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Email hỗ trợ</h4>
                       <p className="text-brand-950 text-xl font-medium">{settings?.email || "cskh@sabaicare.vn"}</p>
                     </div>
                     <div>
                       <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Hotline</h4>
                       <p className="text-brand-950 text-xl font-medium">{settings?.hotline || "1900 6868"}</p>
                     </div>
                   </div>
                 </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-brand-100 rounded-[40px] overflow-hidden aspect-square lg:aspect-[4/5] flex items-center justify-center relative"
              >
                 <img src="/images/furano-lab.png" alt="Office" className="absolute inset-0 w-full h-full object-cover grayscale opacity-20" />
                 <span className="relative z-10 text-brand-900/40 font-serif italic text-3xl">Bản đồ FURANO</span>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 11. CTA cuối trang */}
      <section className="py-32 md:py-48 px-4 sm:px-6 lg:px-8 bg-brand-950 text-white text-center">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-serif mb-10 leading-tight">
              {content.cta.title}
            </h2>
            <p className="text-gray-300 mb-16 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              {content.cta.desc}
            </p>
            <div className="flex justify-center">
              <Link
                href="/products"
                className="px-12 py-6 bg-white text-brand-950 text-xl font-bold rounded-full hover:bg-[#3DCAA0] hover:text-white transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
