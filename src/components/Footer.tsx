'use client';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import FuranoLogo from './FuranoLogo';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.21-3.07 1.87-5.91 4.83-6.71 1.38-.37 2.83-.3 4.17.24v4.06c-1.04-.42-2.31-.38-3.23.27-1.14.77-1.51 2.39-.8 3.56.63 1.05 1.92 1.54 3.07 1.25 1.17-.28 1.95-1.28 2.05-2.48.06-3.79.03-7.59.04-11.38V.02z" />
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M21.2 12.3c0-4.8-4.1-8.7-9.2-8.7-5.1 0-9.2 3.9-9.2 8.7 0 2.5 1.1 4.8 3 6.3l-.9 3c-.1.3.3.6.6.4l3.5-2.2c1 .3 2 .4 3 .4 5.1 0 9.2-3.9 9.2-8.7zm-14 1.2h-.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5zm2.8 0h-1.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5zm4 0h-.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h.5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5zm2.8 0h-1.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5z"/>
  </svg>
);

const ShopeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.4 6h-6.8c-.3 0-.6.2-.7.5l-2.6 7.5c-.1.4 0 .9.3 1.1l5.9 5.3c.3.3.7.3 1 0l5.9-5.3c.3-.3.4-.8.3-1.1L16.1 6.5c-.1-.3-.4-.5-.7-.5zm-6.2 1.5h5.6l2 5.5H7.2l2-5.5z" />
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();
  const settings = useSiteSettings();

  return (
    <footer className="bg-brand-50 text-gray-600 pt-20 pb-10 border-t border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <FuranoLogo className="w-auto h-12" />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {t(settings.footerDescription || "Thương hiệu dược mỹ phẩm hàng đầu cung cấp giải pháp chăm sóc toàn diện chuẩn y khoa thiết kế riêng cho người niềng răng tại Việt Nam.")}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookLink && settings.facebookLink !== "" ? settings.facebookLink : "https://www.facebook.com/SabaiCare79"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={settings.tiktokLink || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <TiktokIcon className="w-5 h-5" />
              </a>
              <a href={settings.zaloLink || "https://zalo.me/0869857395"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <ZaloIcon className="w-5 h-5" />
              </a>
              <a href={settings.shopeeLink || "https://shopee.vn/sabaicare"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-[#EE4D2D] hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <ShopeeIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-950 font-bold mb-6 text-lg">{t("Liên Hệ")}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{t(settings.address || "Chung cư Hoàng Dương, Số 50, Ngõ 83, đường Ngọc Hồi, Yên Sở, Hà Nội")}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{settings.phone || "0869857395"}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{settings.email || "cskh@sabaicare.vn"}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-brand-950 font-bold mb-6 text-lg">{t("Hỗ Trợ Khách Hàng")}</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/shipping-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách vận chuyển")}</Link></li>
              <li><Link href="/return-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách đổi trả & hoàn tiền")}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách bảo mật thông tin")}</Link></li>
              <li><Link href="/shopping-guide" className="hover:text-brand-800 transition-colors">{t("Hướng dẫn mua hàng")}</Link></li>
              <li><Link href="/order-tracking" className="hover:text-brand-800 transition-colors">{t("Tra cứu đơn hàng")}</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-brand-950 font-bold mb-6 text-lg">{t("Sản Phẩm")}</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Chăm sóc khi niềng")}</Link></li>
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Chăm sóc sau niềng (duy trì)")}</Link></li>
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Trắng răng & khử mùi")}</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-brand-200 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t("CÔNG TY TNHH FURANO VN. All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
}
