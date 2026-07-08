'use client';
import About from '../components/About';
import CTASection from '../components/CTASection';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const settings = useSiteSettings();
  const { t } = useTranslation();

  return (
    <main className="pt-24 min-h-screen">
      {settings?.aboutCoverImage && (
        <div className="w-full relative overflow-hidden flex justify-center bg-brand-950 mx-auto">
           <img src={settings.aboutCoverImage} alt={t("Về chúng tôi")} className="w-full h-auto max-h-[50vh] object-contain" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">{t("Về FURANO")}</h1>
           </div>
        </div>
      )}
      <About />
      <CTASection />
    </main>
  );
}
