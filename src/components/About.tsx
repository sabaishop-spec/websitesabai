'use client';
import { motion } from 'motion/react';
import { Shield, Leaf, ClipboardList, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function About() {
  const { t } = useTranslation();

  const coreValues = [
    {
      title: t("Chăm sóc"),
      description: t("Chúng tôi quan tâm đến sức khỏe răng miệng của mỗi khách hàng như chăm sóc gia đình chính mình"),
      emoji: "💚",
    },
    {
      title: t("Đổi mới"),
      description: t("Không ngừng phát triển công thức mới dựa trên nghiên cứu khoa học và sự thấu hiểu khách hàng"),
      emoji: "🔬",
    },
    {
      title: t("Chất lượng"),
      description: t("Mỗi sản phẩm đều qua kiểm duyệt chất lượng nghiêm ngặt"),
      emoji: "⭐",
    },
    {
      title: t("Cộng đồng"),
      description: t("Xây dựng cộng đồng những người quan tâm sức khỏe răng miệng trong quá trình chỉnh nha"),
      emoji: "🤝",
    },
  ];

  const timeline = [
    { year: 2018, text: t("FURANO được thành lập"), side: 'left' as const },
    { year: 2019, text: t("Ra mắt dòng sản phẩm Ortho chuyên biệt"), side: 'right' as const },
    { year: 2021, text: t("Giành được giải thưởng Oral-Care New-Star Brand từ Shopee"), side: 'left' as const },
    { year: 2023, text: t("Mở rộng sang 3 nước Đông Nam Á"), side: 'right' as const },
    { year: 2024, text: t("Nhận danh hiệu 5 star Health-care shop từ Tiktok shop"), side: 'left' as const },
  ];

  const scienceChecks = [
    t("Kiểm duyệt bởi Bộ Y tế Việt Nam"),
    t("Công thức dermatologically tested"),
    t("Không chứa fluoride quá mức"),
    t("Thành phần tự nhiên, an toàn"),
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-950 to-brand-900">
        <div className="max-w-7xl mx-auto text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t("Câu chuyện FURANO")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            {t("Từ một ý tưởng nhỏ để giúp mọi người có nụ cười tự tin, chúng tôi đã trở thành thương hiệu hàng đầu chuyên về chăm sóc răng miệng cho cộng đồng niềng răng khắp Đông Nam Á")}
          </motion.p>
        </div>
      </section>

      {/* Sứ mệnh / Tầm nhìn / Triết lý */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-bold text-brand-950 mb-4">{t("Sứ mệnh")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("Cung cấp các sản phẩm chăm sóc hàm răng chất lượng cao, khoa học, an toàn cho mọi người, đặc biệt là những người niềng răng.")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-bold text-brand-950 mb-4">{t("Tầm nhìn")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("Trở thành thương hiệu chăm sóc hàm răng được tin tưởng nhất ở Đông Nam Á, đồng hành cùng mọi người trên hành trình tìm kiếm nụ cười tự tin.")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#3DCAA0]/10 rounded-2xl p-8 border border-[#3DCAA0]/40"
            >
              <h3 className="text-2xl font-bold text-brand-950 mb-4">{t("Triết lý")}</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#3DCAA0]">{t("Không chỉ bán sản phẩm, chúng tôi đồng hành.")}</span>{' '}
                {t("Mỗi khách hàng là một phần của gia đình FURANO.")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-950 mb-6">{t("Đội ngũ FURANO")}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t("FURANO được xây dựng bởi một nhóm những chuyên gia nhiều năm kinh nghiệm trong lĩnh vực chăm sóc hàm răng. Chúng tôi hiểu rõ nỗi lo, khó khăn của những người niềng răng vì chính bản thân chúng tôi cũng từng trải qua.")}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t("Triết lý của chúng tôi rất đơn giản:")}{' '}
                <span className="font-semibold text-[#3DCAA0]">&quot;{t("Không chỉ bán sản phẩm, chúng tôi đồng hành")}&quot;</span>
                {t(". Mỗi thành viên trong đội ngũ FURANO đều tâm huyết với việc phát triển các sản phẩm tốt nhất để giúp bạn có nụ cười tự tin trong suốt hành trình chỉnh nha.")}
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3DCAA0]" />
                  <span className="text-gray-600">{t("Tâm tài, tâm huyết")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3DCAA0]" />
                  <span className="text-gray-600">{t("Đội ngũ chuyên gia")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-80 md:h-96 lg:min-h-[24rem] overflow-hidden rounded-3xl shadow-xl"
            >
              <img
                src="/images/team-furano.jpeg"
                alt={t("Đội ngũ FURANO")}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* An toàn – Lành tính – Minh bạch */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#3DCAA0]/5">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-950 mb-12 text-center"
          >
            {t("An toàn – Lành tính – Minh bạch thành phần")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: t("An toàn"), desc: t("Tất cả sản phẩm được kiểm duyệt bởi Bộ Y tế Việt Nam và đạt tiêu chuẩn quốc tế về an toàn. Không chứa hóa chất độc hại.") },
              { icon: '🌿', title: t("Lành tính"), desc: t("Công thức lành tính với chiết xuất tự nhiên, phù hợp cho cả gia đình. Kiểm duyệt da học, an toàn cho nướu nhạy cảm.") },
              { icon: '📋', title: t("Minh bạch thành phần"), desc: t("Tất cả thành phần được công khai rõ ràng. Không chứa chất gây dị ứng, không có thành phần ẩn kín.") },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-8 border-2 border-[#3DCAA0]/30 text-center hover:border-[#3DCAA0]/60 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-brand-950 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-950 mb-4 text-center"
          >
            {t("Giá trị cốt lõi")}
          </motion.h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("Những nguyên tắc cơ bản định hướng mọi hoạt động của chúng tôi")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 overflow-hidden bg-[#3DCAA0]/10 flex items-center justify-center">
                  <span className="text-7xl">{val.emoji}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-brand-950 mb-3">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hành trình / Timeline */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-950 mb-12 text-center"
          >
            {t("Hành trình của FURANO")}
          </motion.h2>
          <div className="relative">
            {/* Vertical line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#3DCAA0] to-[#3DCAA0]/30 rounded-full" />

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row gap-8 items-center md:items-start"
                >
                  {item.side === 'left' ? (
                    <>
                      <div className="flex-1 md:text-right">
                        <div className="inline-block bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                          <p className="text-gray-600">{item.text}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3DCAA0] text-brand-950 flex items-center justify-center font-bold hidden md:flex shadow-md">
                        {item.year}
                      </div>
                      <div className="flex-1" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1" />
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#3DCAA0] text-brand-950 flex items-center justify-center font-bold hidden md:flex shadow-md">
                        {item.year}
                      </div>
                      <div className="flex-1 md:text-left">
                        <div className="inline-block bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                          <p className="text-gray-600">{item.text}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Mobile year badge */}
                  <div className="md:hidden">
                    <span className="font-bold text-[#3DCAA0] text-xl">{item.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phát triển dựa trên khoa học */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-950 mb-6">{t("Phát triển dựa trên khoa học")}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t("Mỗi công thức của FURANO được phát triển bởi một đội ngũ các chuyên gia nha khoa và nhà hóa học hàng đầu. Chúng tôi tiến hành hàng ngàn lần thử nghiệm để đảm bảo an toàn và hiệu quả tối đa.")}
              </p>
              <ul className="space-y-4">
                {scienceChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3DCAA0]/20 text-[#3DCAA0] flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-600">{check}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src="/images/furano-lab.png"
                alt={t("Phòng lab FURANO")}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thông tin công ty */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-950 mb-12 text-center"
          >
            {t("Thông tin công ty")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-brand-950 mb-2">{t("Địa chỉ")}</h3>
              <p className="text-gray-600">{t("Hà Nội, Việt Nam")}<br />{t("Văn phòng chi nhánh tại TP.HCM")}</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-brand-950 mb-2">{t("Email")}</h3>
              <p className="text-gray-600">
                <a href="mailto:sonnt.ceo@sabaicare.vn" className="hover:text-[#3DCAA0] transition-colors">sonnt.ceo@sabaicare.vn</a>
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-brand-950 mb-2">{t("Hotline")}</h3>
              <p className="text-gray-600">
                <a href="tel:+84869833854" className="hover:text-[#3DCAA0] transition-colors">+84 (8)69 833 854</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Gia nhập gia đình */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#3DCAA0]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-950 mb-4">
            {t("Trở thành một phần của gia đình FURANO")}
          </h2>
          <p className="text-brand-950/80 mb-8 text-lg">
            {t("Khám phá sản phẩm và bắt đầu hành trình chăm sóc hàm răng ngay hôm nay")}
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-brand-950 text-white font-bold rounded-lg hover:bg-brand-900 transition-colors shadow-lg"
          >
            {t("Khám phá sản phẩm")}
          </Link>
        </div>
      </section>
    </>
  );
}
