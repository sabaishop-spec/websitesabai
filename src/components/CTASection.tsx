'use client';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, collection, doc, setDoc, getDocs } from '../localDB';

export default function CTASection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      // Check for duplicate email
      const snap = await getDocs(collection(db, 'subscribers'));
      const existing = snap.docs.find(
        (d: any) => d.data()?.email?.toLowerCase() === email.toLowerCase() && d.data()?.status !== 'unsubscribed'
      );

      if (existing) {
        setStatus('duplicate');
        return;
      }

      // Save subscriber
      const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await setDoc(doc(collection(db, 'subscribers'), id), {
        email: email.toLowerCase().trim(),
        source: 'cta',
        subscribedAt: Date.now(),
        status: 'active',
      });

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Subscribe error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Đã xảy ra lỗi');
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400 rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t("Sẵn sàng tỏa sáng")} <br className="hidden md:block"/> {t("với nụ cười mới?")}
            </h2>
            <p className="text-brand-100 text-lg mb-0 font-light">
              {t("Đăng ký nhận cẩm nang chăm sóc răng niềng chuẩn nha khoa và voucher giảm giá 15% cho đơn hàng đầu tiên.")}
            </p>
          </div>

          <div className="relative z-10 w-full max-w-md">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-white text-lg font-semibold mb-1">{t("Đăng ký thành công!")}</h3>
                <p className="text-brand-200 text-sm">{t("Cẩm nang & voucher sẽ được gửi đến email của bạn sớm nhất.")}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm text-brand-300 hover:text-white transition-colors underline underline-offset-2"
                >
                  {t("Đăng ký email khác")}
                </button>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="bg-white p-2 rounded-full shadow-2xl flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow flex items-center pl-4">
                    <Mail className="w-5 h-5 text-gray-400 absolute" />
                    <input 
                      type="email" 
                      placeholder={t("Nhập email của bạn...")} 
                      className="w-full py-3 pl-8 pr-4 text-gray-900 bg-transparent border-none focus:ring-0 outline-none"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error' || status === 'duplicate') setStatus('idle');
                      }}
                      disabled={status === 'loading'}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-brand-800 hover:bg-brand-900 disabled:opacity-70 text-white font-medium rounded-full transition-colors whitespace-nowrap"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t("Nhận Quà Ngay")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>

                {status === 'duplicate' && (
                  <p className="text-yellow-300 text-xs mt-3 text-center md:text-left">
                    ⚠️ {t("Email này đã được đăng ký. Vui lòng sử dụng email khác.")}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-300 text-xs mt-3 text-center md:text-left">
                    ❌ {t("Đã xảy ra lỗi. Vui lòng thử lại sau.")}
                  </p>
                )}
                {status === 'idle' && (
                  <p className="text-brand-200 text-xs mt-4 text-center md:text-left">
                    {t("*Tất cả thông tin được bảo mật và không spam.")}
                  </p>
                )}
              </>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
