'use client';
import { Facebook, Instagram, Phone, Mail, MapPin, ArrowRight, Heart } from 'lucide-react';
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
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.2 5.5l1.2-2.3c.1-.2.4-.3.6-.2l.1.1.6 1.1h-4.8L16.2 5.5zM12 2C10.3 2 9 3.3 9 5h6c0-1.7-1.3-3-3-3zM3 7l2 14h14l2-14H3zm8 9c-2.8 0-5-2.2-5-5h2c0 1.7 1.3 3 3 3s3-1.3 3-3h2c0 2.8-2.2 5-5 5z"/>
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();
  const settings = useSiteSettings();

  const socialLinks = [
    { href: settings.facebookLink && settings.facebookLink !== "" ? settings.facebookLink : "https://www.facebook.com/SabaiCare79", icon: Facebook, label: "Facebook", hoverBg: "hover:bg-[#1877F2]" },
    { href: settings.tiktokLink || "https://tiktok.com", icon: TiktokIcon, label: "TikTok", hoverBg: "hover:bg-black" },
    { href: settings.zaloLink || "https://zalo.me/0869857395", icon: ZaloIcon, label: "Zalo", hoverBg: "hover:bg-[#0068FF]" },
    { href: settings.shopeeLink || "https://shopee.vn/sabaicare", icon: ShopeeIcon, label: "Shopee", hoverBg: "hover:bg-[#EE4D2D]" },
  ];

  const supportLinks = [
    { href: "/shipping-policy", label: "Chính sách vận chuyển" },
    { href: "/return-policy", label: "Chính sách đổi trả & hoàn tiền" },
    { href: "/privacy-policy", label: "Chính sách bảo mật thông tin" },
    { href: "/shopping-guide", label: "Hướng dẫn mua hàng" },
    { href: "/order-tracking", label: "Tra cứu đơn hàng" },
  ];

  const productLinks = [
    { href: "/products", label: "Chăm sóc khi niềng" },
    { href: "/products", label: "Chăm sóc sau niềng (duy trì)" },
    { href: "/products", label: "Trắng răng & khử mùi" },
  ];

  return (
    <footer className="bg-brand-950 text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-12">
        {/* Top Section: Brand + Social */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          
          {/* Brand Column - Takes more space */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center mb-8 group">
              <FuranoLogo className="w-auto h-14 brightness-0 invert group-hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-base leading-relaxed text-brand-100/70 mb-10 max-w-md">
              {t(settings.footerDescription || "Thương hiệu dược mỹ phẩm hàng đầu cung cấp giải pháp chăm sóc toàn diện chuẩn y khoa thiết kế riêng cho người niềng răng tại Việt Nam.")}
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl bg-white/10 ${social.hoverBg} hover:text-white flex items-center justify-center transition-all duration-300 text-brand-100/60 hover:scale-105 hover:shadow-lg`}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-brand-300 mb-6">{t("Liên Hệ")}</h4>
              <ul className="space-y-5">
                <li className="flex gap-3 items-start group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-sm text-brand-100/70 leading-relaxed">{t(settings.address || "Chung cư Hoàng Dương, Số 50, Ngõ 83, đường Ngọc Hồi, Yên Sở, Hà Nội")}</span>
                </li>
                <li className="flex gap-3 items-center group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-sm text-brand-100/70">{settings.phone || "0869857395"}</span>
                </li>
                <li className="flex gap-3 items-center group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-sm text-brand-100/70">{settings.email || "cskh@sabaicare.vn"}</span>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-brand-300 mb-6">{t("Hỗ Trợ")}</h4>
              <ul className="space-y-4">
                {supportLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-brand-400" />
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-bold tracking-widest uppercase text-brand-300 mb-6">{t("Sản Phẩm")}</h4>
              <ul className="space-y-4">
                {productLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-brand-100/70 hover:text-white transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-brand-400" />
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Quick Action */}
              <div className="mt-8">
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors group"
                >
                  {t("Về Furano")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-100/40">
            &copy; {new Date().getFullYear()} {t("CÔNG TY TNHH FURANO VN. All rights reserved.")}
          </p>
          <p className="text-sm text-brand-100/40 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> in Vietnam
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-800/20 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
}
