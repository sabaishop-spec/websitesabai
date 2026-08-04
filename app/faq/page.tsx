import type { Metadata } from 'next';
import MainLayout from '../MainLayout';
import FAQPage from '@/src/page-components/FAQPage';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://furano.vn';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp Về Niềng Răng & Sản Phẩm FURANO',
  description:
    'Giải đáp thắc mắc thường gặp về niềng răng, kem đánh răng cho người niềng răng, cách sử dụng bàn chải kẽ và các sản phẩm chăm sóc răng miệng FURANO.',
  keywords:
    'câu hỏi niềng răng, faq niềng răng, kem đánh răng cho người niềng răng, bàn chải kẽ, furano, chăm sóc răng niềng, hỏi đáp nha khoa',
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
  openGraph: {
    title: 'Câu Hỏi Thường Gặp Về Niềng Răng & Sản Phẩm FURANO',
    description:
      'Giải đáp thắc mắc thường gặp về niềng răng, kem đánh răng cho người niềng răng, cách sử dụng bàn chải kẽ và các sản phẩm FURANO.',
    url: `${baseUrl}/faq`,
    siteName: 'FURANO',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  // Static FAQ data for JSON-LD schema (Google rich snippets)
  const faqItems = [
    {
      question: 'Sản phẩm FURANO có dùng được cho răng nhạy cảm không?',
      answer:
        'Hoàn toàn được. Công thức của chúng tôi không chứa chất mài mòn mạnh (low RDA), an toàn tuyệt đối cho men răng đang trong giai đoạn yếu ớt khi chịu quá trình kéo chỉnh của mắc cài.',
    },
    {
      question: 'Bao nhiêu lâu thì nên thay đổi bàn chải kẽ?',
      answer:
        'Với người đang niềng răng, nha sĩ khuyên nên làm vệ sinh bàn chải sau mỗi lần sử dụng và thay thế bàn chải/đầu bàn chải kẽ 2-3 tuần một lần để đảm bảo vệ sinh và hiệu quả làm sạch tốt nhất.',
    },
    {
      question: 'Viên sủi Invisalign có làm ố màu khay không?',
      answer:
        'Không. Viên sủi FURANO làm sạch bằng bọt khí O2 siêu nhỏ và các enzym diệt khuẩn, hoàn toàn không sử dụng chất nhuộm màu độc hại gây ảnh hưởng đến cấu trúc nhựa và độ trong suốt của khay niềng.',
    },
    {
      question: 'FURANO có hỗ trợ tư vấn chăm sóc cá nhân không?',
      answer:
        'Có. Đội ngũ chuyên viên của FURANO luôn sẵn sàng hỗ trợ bạn theo dõi tình trạng răng miệng và thiết kế chu trình chăm sóc riêng biệt. Hãy liên hệ với chúng tôi để được tư vấn miễn phí.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hỏi Đáp',
        item: `${baseUrl}/faq`,
      },
    ],
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FAQPage />
    </MainLayout>
  );
}
