'use client';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../localDB';
import { ArrowRight, Check } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const defaultValues = {
    heroTitle: t("Câu chuyện FURANO"),
    heroSubtitle: t("Từ một ý tưởng nhỏ để giúp mọi người có nụ cười tự tin, chúng tôi đã trở thành thương hiệu chăm sóc răng miệng đồng hành cùng cộng đồng."),
    missionText: t("Cung cấp các sản phẩm chăm sóc hàm răng chất lượng cao, khoa học, an toàn cho mọi người, đặc biệt là những người niềng răng."),
    visionText: t("Trở thành thương hiệu chăm sóc hàm răng được tin tưởng nhất ở Đông Nam Á, đồng hành cùng mọi người trên hành trình tìm kiếm nụ cười tự tin."),
    philosophyText: t("Không chỉ bán sản phẩm, chúng tôi đồng hành. Mỗi khách hàng là một phần của gia đình FURANO."),
    teamText1: t("FURANO được xây dựng bởi một nhóm chuyên gia nha khoa. Chúng tôi hiểu rõ nỗi lo, khó khăn của những người niềng răng vì chính bản thân chúng tôi cũng từng trải qua."),
    teamText2: t("Tâm huyết với việc phát triển các sản phẩm tốt nhất để giúp bạn có nụ cười tự tin trong suốt hành trình chỉnh nha."),
    teamImage: '/images/team-furano.jpeg',
    timeline: [
      { year: 2018, text: t("FURANO được thành lập"), side: 'left' },
      { year: 2019, text: t("Ra mắt dòng sản phẩm Ortho chuyên biệt"), side: 'right' },
      { year: 2021, text: t("Giải thưởng Oral-Care New-Star Brand"), side: 'left' },
      { year: 2023, text: t("Mở rộng sang 3 nước Đông Nam Á"), side: 'right' }
    ],
    scienceChecks: [
      t("Kiểm duyệt bởi Bộ Y tế Việt Nam"),
      t("Công thức dermatologically tested"),
      t("Không chứa hóa chất độc hại"),
      t("Thành phần tự nhiên, an toàn")
    ],
    labImage: '/images/furano-lab.png',
  };

  const pageData = { ...defaultValues, ...data };

  if (loading) {
    return <div className="min-h-screen bg-brand-50 flex items-center justify-center animate-pulse"><div className="w-12 h-12 rounded-full border-4 border-brand-900 border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="bg-brand-50 selection:bg-brand-900 selection:text-white">
      {/* 1. Hero Section - Organic Split */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative blob */}
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-[#3DCAA0]/5 rounded-bl-[120px] -z-10 transform translate-x-1/4 -translate-y-1/4" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-[#3DCAA0] font-medium tracking-widest uppercase text-sm mb-6 block">Giới thiệu</span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-brand-950 leading-tight mb-8">
                {pageData.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg border-l-2 border-[#3DCAA0] pl-6">
                {pageData.heroSubtitle}
              </p>
            </motion.div>
          </div>
          <div className="flex-1 w-full relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="aspect-[4/5] md:aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden"
            >
               <img src="/images/routine-step-1.jpeg" alt="Hero" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision - Elegant Typography layout */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-3xl font-bold text-brand-950 mb-6 flex items-baseline gap-4">
                <span className="text-sm font-normal text-gray-400">01</span>
                {t("Sứ mệnh")}
              </h3>
              <p className="text-gray-600 leading-loose text-lg font-light">
                {pageData.missionText}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-brand-950 mb-6 flex items-baseline gap-4">
                <span className="text-sm font-normal text-gray-400">02</span>
                {t("Tầm nhìn")}
              </h3>
              <p className="text-gray-600 leading-loose text-lg font-light">
                {pageData.visionText}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="md:col-span-2 mt-8 p-10 md:p-16 bg-brand-950 rounded-[2rem] text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {t("Triết lý")}
              </h3>
              <p className="text-[#3DCAA0] leading-relaxed text-xl md:text-2xl font-light italic max-w-3xl mx-auto">
                &quot;{pageData.philosophyText}&quot;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Team - Overlapping Layout */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-brand-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-3/5 w-full z-10"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={pageData.teamImage}
                  alt="Đội ngũ FURANO"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-2/5 w-full lg:-ml-20 mt-12 lg:mt-0 z-20"
            >
              <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-xl">
                <h2 className="text-3xl font-bold text-brand-950 mb-8">{t("Đội ngũ FURANO")}</h2>
                <p className="text-gray-600 leading-relaxed mb-6 font-light">
                  {pageData.teamText1}
                </p>
                <p className="text-gray-600 leading-relaxed font-light pb-6 border-b border-gray-100">
                  {pageData.teamText2}
                </p>
                <div className="flex gap-8 mt-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#3DCAA0] font-bold text-2xl">100%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tâm huyết</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#3DCAA0] font-bold text-2xl">5+</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Năm kinh nghiệm</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Core Values - Minimalist List */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
             <h2 className="text-4xl font-bold text-brand-950 mb-6">{t("Giá trị Cốt lõi")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { t: "An toàn", d: "Tất cả sản phẩm được kiểm duyệt bởi Bộ Y tế Việt Nam và đạt tiêu chuẩn quốc tế về an toàn. Không chứa hóa chất độc hại." },
              { t: "Lành tính", d: "Công thức lành tính với chiết xuất tự nhiên, phù hợp cho cả gia đình. Kiểm duyệt da học, an toàn cho nướu nhạy cảm." },
              { t: "Minh bạch", d: "Tất cả thành phần được công khai rõ ràng. Không chứa chất gây dị ứng, không có thành phần ẩn kín." },
              { t: "Chăm sóc", d: "Chúng tôi quan tâm đến sức khỏe răng miệng của mỗi khách hàng như chăm sóc gia đình chính mình." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-6 items-start group"
              >
                <div className="text-4xl font-light text-gray-200 group-hover:text-[#3DCAA0] transition-colors">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-950 mb-3">{item.t}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{item.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Timeline - Sleek vertical design */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-brand-950 text-white relative overflow-hidden">
        {/* Minimal grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-20 text-center"
          >
            {t("Hành trình của FURANO")}
          </motion.h2>

          <div className="space-y-16 pl-8 md:pl-0">
            {pageData.timeline.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center gap-8 group"
              >
                {/* Desktop layout: Year - Line - Content */}
                <div className="hidden md:flex w-1/3 justify-end text-right">
                  <span className="text-3xl font-light text-[#3DCAA0] group-hover:scale-110 transition-transform">{item.year}</span>
                </div>
                
                {/* Timeline node */}
                <div className="absolute left-0 md:static w-px h-full md:h-24 bg-white/20 ml-[3.5px] md:ml-0 flex flex-col items-center">
                  <div className="absolute top-0 md:top-1/2 md:-translate-y-1/2 -left-[3.5px] md:-left-1 w-2 h-2 rounded-full bg-[#3DCAA0] shadow-[0_0_15px_rgba(61,202,160,0.8)]" />
                </div>
                
                <div className="w-full md:w-1/2 pl-6 md:pl-0">
                  <span className="md:hidden text-2xl font-light text-[#3DCAA0] block mb-2">{item.year}</span>
                  <p className="text-gray-300 font-light text-lg">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Science - Elegant Split */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <span className="text-gray-400 font-semibold tracking-widest uppercase text-xs mb-4 block">Nghiên cứu & Phát triển</span>
              <h2 className="text-3xl md:text-5xl font-bold text-brand-950 mb-8 leading-tight">{t("Phát triển dựa trên khoa học")}</h2>
              <ul className="space-y-6 mb-10">
                {(pageData.scienceChecks || []).map((check: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <Check className="w-5 h-5 text-[#3DCAA0]" />
                    </div>
                    <span className="text-gray-600 font-light text-lg">{check}</span>
                  </li>
                ))}
              </ul>
              <Link href="/products" className="inline-flex items-center gap-2 text-brand-900 font-bold hover:text-[#3DCAA0] transition-colors pb-1 border-b-2 border-brand-900 hover:border-[#3DCAA0]">
                {t("Xem báo cáo kiểm nghiệm")} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:w-1/2 w-full"
            >
              <div className="aspect-square rounded-full overflow-hidden p-4 border border-gray-100">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={pageData.labImage}
                    alt="Phòng lab FURANO"
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Contact / CTA - Soft block */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-sm border border-gray-100">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-950 mb-6">
            {t("Khởi đầu nụ cười mới")}
          </h2>
          <p className="text-gray-500 mb-10 text-lg font-light max-w-2xl mx-auto">
            {t("Khám phá các sản phẩm chuyên biệt của FURANO và bắt đầu hành trình chăm sóc hàm răng ngay hôm nay.")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-brand-950 text-white font-bold rounded-full hover:bg-brand-900 transition-all hover:scale-105 shadow-xl shadow-brand-950/20"
            >
              {t("Khám phá sản phẩm")}
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-950 font-bold rounded-full border border-gray-200 hover:border-brand-900 hover:bg-gray-50 transition-all"
            >
              {t("Liên hệ với chúng tôi")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
