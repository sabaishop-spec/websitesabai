'use client';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../localDB';
import { ArrowRight, ArrowDown } from 'lucide-react';

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
                  Câu chuyện FURANO
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

      {/* 2. Câu chuyện FURANO */}
      <section id="brand-story" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full order-2 md:order-1"
          >
            <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-gray-200">
               <img src={content.story.image} alt="Khởi nguồn của FURANO" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          
          <div className="flex-1 w-full order-1 md:order-2">
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
                <p>{content.story.desc3}</p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-300">
                <p className="text-2xl font-serif text-brand-900 italic leading-snug">
                  "{content.story.quote}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Sứ mệnh - Tầm nhìn - Triết lý */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 pb-12 lg:pb-0 lg:pr-12 lg:border-r border-gray-200 border-b lg:border-b-0"
            >
              <span className="text-5xl font-light text-gray-200 mb-6 block">01</span>
              <h3 className="text-2xl font-serif text-brand-950 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {content.missionVision.mission}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 pb-12 lg:pb-0 lg:pr-12 lg:border-r border-gray-200 border-b lg:border-b-0"
            >
              <span className="text-5xl font-light text-gray-200 mb-6 block">02</span>
              <h3 className="text-2xl font-serif text-brand-950 mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {content.missionVision.vision}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <span className="text-5xl font-light text-gray-200 mb-6 block">03</span>
              <h3 className="text-2xl font-serif text-brand-950 mb-4">Triết lý</h3>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                {content.missionVision.philosophy}
              </p>
              <p className="font-serif text-lg text-[#3DCAA0] leading-snug">
                "{content.missionVision.philosophyHighlight}"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Đội ngũ FURANO */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
                <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-8">{content.team.title}</h2>
                <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed mb-12">
                   <p>{content.team.text1}</p>
                   <p>{content.team.text2}</p>
                </div>
                <div className="pl-6 border-l-2 border-[#3DCAA0]">
                   <p className="text-xl font-serif text-brand-900 leading-relaxed whitespace-pre-line">
                     {content.team.highlight}
                   </p>
                </div>
             </motion.div>
          </div>
          <div className="flex-1 w-full">
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="aspect-[4/5] bg-gray-200 overflow-hidden"
             >
                <img src={content.team.image} alt="Đội ngũ FURANO" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Những ngày niềng răng không phải lúc nào cũng dễ dàng */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
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

      {/* 6. Những điều FURANO ưu tiên (Cam kết) */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#FAF9F7]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-16 md:mb-24"
          >
             <h2 className="text-3xl md:text-4xl font-serif text-brand-950">
               Những điều FURANO ưu tiên
             </h2>
          </motion.div>
          
          <div className="flex flex-col space-y-12 md:space-y-0 md:flex-row md:gap-12 lg:gap-16">
            {content.commitments.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="flex-1 border-t border-brand-200 pt-8"
               >
                 <span className="text-5xl font-light text-brand-950/20 mb-6 block">{item.num}</span>
                 <h3 className="text-2xl font-serif text-brand-950 mb-4">{item.title}</h3>
                 <p className="text-gray-600 font-light leading-relaxed">{item.desc}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Giá trị cốt lõi */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
             <div className="md:w-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-6">Giá trị cốt lõi</h2>
                  <p className="text-gray-600 font-light text-lg leading-relaxed">
                    Những nguyên tắc định hướng cách FURANO lựa chọn sản phẩm, xây dựng nội dung và đồng hành cùng khách hàng.
                  </p>
                </motion.div>
             </div>
             
             <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                {content.coreValues.map((val, idx) => (
                   <motion.div
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.5, delay: idx * 0.1 }}
                   >
                     <h3 className="text-xl font-medium text-brand-950 mb-3">{val.title}</h3>
                     <p className="text-gray-600 font-light leading-relaxed">{val.desc}</p>
                   </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 8. Ba nguyên tắc phát triển giải pháp */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-950 text-white">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-20"
          >
             <h2 className="text-3xl md:text-4xl font-serif leading-tight">
               Ba nguyên tắc phát triển giải pháp
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

      {/* 9. Hành trình của FURANO (Timeline) */}
      {(data?.timeline?.length > 0 ? data.timeline : content.timelineFallback)?.length > 0 && (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50 border-b border-gray-100">
          <div className="max-w-[1000px] mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mb-20 text-center"
            >
               <h2 className="text-3xl md:text-4xl font-serif text-brand-950">
                 Hành trình của FURANO
               </h2>
            </motion.div>
            
            <div className="relative">
              {/* Vertical line desktop & mobile */}
              <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-[1px] bg-brand-200 transform md:-translate-x-1/2"></div>
              
              <div className="space-y-12">
                {(data?.timeline?.length > 0 ? data.timeline : content.timelineFallback).map((item: any, idx: number) => {
                   const isLeft = item.side === 'left';
                   return (
                     <div key={idx} className={`relative flex flex-col md:flex-row items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                       <div className="absolute left-[20px] md:left-1/2 w-3 h-3 bg-brand-900 rounded-full transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>
                       
                       <div className="md:w-1/2 w-full pl-14 md:pl-0">
                         <div className={`${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                           <span className="text-xl md:text-2xl font-serif text-[#3DCAA0] mb-2 block">{item.year}</span>
                           <p className="text-gray-600 font-light leading-relaxed">{item.text}</p>
                         </div>
                       </div>
                       <div className="hidden md:block md:w-1/2"></div>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. Phát triển dựa trên sự thấu hiểu */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 w-full order-2 md:order-1">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="aspect-[4/3] bg-gray-200 overflow-hidden"
             >
                <img src={content.science.image} alt="Phát triển sản phẩm FURANO" className="w-full h-full object-cover" />
             </motion.div>
          </div>
          <div className="flex-1 w-full order-1 md:order-2">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
                <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-8 leading-tight">{content.science.title}</h2>
                <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed mb-10">
                   <p>{content.science.text1}</p>
                   <p>{content.science.text2}</p>
                </div>
                
                <ul className="space-y-4">
                  {content.science.checks.map((check: string, idx: number) => (
                     <li key={idx} className="flex items-start gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#3DCAA0] mt-2.5 flex-shrink-0"></span>
                       <span className="text-gray-600 leading-relaxed font-light">{check}</span>
                     </li>
                  ))}
                </ul>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 11. Hành trình chăm sóc răng niềng */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50">
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
             <div className="absolute top-10 left-0 w-full h-[1px] bg-brand-200 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="relative z-10 w-1/3 px-6 flex flex-col items-center text-center group"
               >
                 <div className="w-5 h-5 rounded-full bg-brand-50 border border-brand-300 group-hover:border-[#3DCAA0] transition-colors flex items-center justify-center mb-8">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-900 group-hover:bg-[#3DCAA0] transition-colors"></div>
                 </div>
                 <span className="text-sm text-gray-400 font-medium tracking-widest uppercase mb-4 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-xl font-serif text-brand-950 mb-3">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-sm lg:text-base mb-6">{item.desc}</p>
                 <Link href={item.link} className="text-sm font-medium text-brand-900 hover:text-[#3DCAA0] transition-colors underline underline-offset-4 decoration-brand-200 hover:decoration-[#3DCAA0]">
                   Khám phá sản phẩm
                 </Link>
               </motion.div>
             ))}
          </div>

          {/* Mobile Timeline: Vertical */}
          <div className="md:hidden flex flex-col relative pl-6 space-y-12">
             <div className="absolute top-2 bottom-2 left-[11px] w-[1px] bg-brand-200 z-0"></div>
             
             {content.journey.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: idx * 0.1 }}
                 className="relative z-10 pl-8 group"
               >
                 <div className="absolute top-1 -left-[14px] w-5 h-5 rounded-full bg-brand-50 border border-brand-300 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-900"></div>
                 </div>
                 <span className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-2 block">Giai đoạn 0{idx + 1}</span>
                 <h3 className="text-lg font-serif text-brand-950 mb-2">{item.phase}</h3>
                 <p className="text-gray-600 font-light leading-relaxed text-sm mb-4">{item.desc}</p>
                 <Link href={item.link} className="text-sm font-medium text-brand-900 hover:text-[#3DCAA0] underline underline-offset-4">
                   Khám phá
                 </Link>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 12. Sản phẩm trong đời sống hằng ngày */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
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

      {/* 13. Cộng đồng FURANO */}
      {/* Ẩn trên production nếu chưa có dữ liệu thật. Ở đây tạo placeholder sãn sàng. */}
      {data?.testimonials && data.testimonials.length > 0 && (
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-50 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-16">Những nụ cười FURANO đang đồng hành</h2>
            {/* Logic render KOC/Reviews here */}
          </div>
        </section>
      )}

      {/* 14. Thông tin công ty */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                 <h2 className="text-3xl md:text-4xl font-serif text-brand-950 mb-8">Thông tin FURANO</h2>
                 <p className="text-gray-600 font-light leading-relaxed mb-10 max-w-md">
                   Nếu bạn cần hỗ trợ về sản phẩm hoặc quá trình chăm sóc răng niềng, đừng ngần ngại liên hệ với chúng tôi.
                 </p>
                 
                 <div className="space-y-6">
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Tên công ty</h4>
                     <p className="text-brand-950 font-medium">{settings?.companyName || "CÔNG TY TNHH FURANO"}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Địa chỉ</h4>
                     <p className="text-brand-950 font-medium">{settings?.address || "Hà Nội, Việt Nam"}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email hỗ trợ</h4>
                     <p className="text-brand-950 font-medium">{settings?.email || "cskh@sabaicare.vn"}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hotline</h4>
                     <p className="text-brand-950 font-medium">{settings?.hotline || "1900 6868"}</p>
                   </div>
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Thời gian làm việc</h4>
                     <p className="text-brand-950 font-medium">8:00 - 17:30 (Thứ 2 - Thứ 6)</p>
                   </div>
                 </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-brand-50 rounded-2xl overflow-hidden aspect-square lg:aspect-[4/3] flex items-center justify-center relative"
              >
                 {/* Google Maps placeholder or branding image */}
                 <img src="/images/furano-lab.png" alt="Office" className="absolute inset-0 w-full h-full object-cover grayscale opacity-30" />
                 <span className="relative z-10 text-brand-900/50 font-serif italic">Bản đồ FURANO</span>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 15. CTA cuối trang */}
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
                Khám phá sản phẩm
              </Link>
              <Link
                href="/blog"
                className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Xem góc kiến thức
              </Link>
            </div>
            
            {/* Newsletter Form */}
            <form className="mt-16 max-w-md mx-auto relative group">
               <input 
                 type="email" 
                 placeholder="Để lại email nhận thông tin hữu ích" 
                 className="w-full bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3DCAA0] transition-colors"
                 required
               />
               <button 
                 type="submit" 
                 className="absolute right-2 top-2 bottom-2 px-6 bg-white text-brand-950 rounded-full font-medium hover:bg-[#3DCAA0] hover:text-white transition-colors"
               >
                 Đăng ký
               </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
