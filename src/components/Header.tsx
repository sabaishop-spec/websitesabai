'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { categories } from '../data/products';
import FuranoLogo from './FuranoLogo';

import 'firebase/firestore';
import { db, collection, getDocs } from '../localDB';

export default function Header() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState(i18n.language === 'en' ? 'EN' : 'VN');
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCats() {
       try {
           const snap = await getDocs(collection(db, 'blogCategories'));
           let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
           if (data.length > 0) {
              setBlogCategories(data);
           } else {
              setBlogCategories([
                  { id: '1', name: 'Kiến thức bọc răng sứ' },
                  { id: '2', name: 'Kiến thức tổng quát' },
                  { id: '3', name: 'Kiến thức niềng răng' },
                  { id: '4', name: 'Kiến thức trồng răng' }
               ]);
           }
       } catch(e) {
           setBlogCategories([
              { id: '1', name: 'Kiến thức bọc răng sứ' },
              { id: '2', name: 'Kiến thức tổng quát' },
              { id: '3', name: 'Kiến thức niềng răng' },
              { id: '4', name: 'Kiến thức trồng răng' }
           ]);
       }
    }
    fetchCats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const navLinks = [
    { name: t('Trang Chủ'), href: '/' },
    { name: t('Sản Phẩm'), href: '/products' },
    { name: t('Về FURANO'), href: '/about' },
    { name: t('Góc Kiến Thức'), href: '/blog' },
    { name: t('Hỏi Đáp'), href: '/faq' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-md py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center z-50 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <FuranoLogo className="w-auto h-8 md:h-10 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 bg-white/70 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-gray-100">
          {navLinks.map((link) => (
            link.href === '/products' ? (
              <div key={link.name} className="relative group/prod">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-brand-800 ${
                    pathname === link.href ? 'text-brand-800' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover/prod:rotate-180" />
                </Link>
                <div className="absolute top-full -left-[180px] pt-4 hidden group-hover/prod:block transition-all z-50">
                  <div className="w-max bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex gap-12">
                    {categories.map((category) => (
                      <div key={category.id} className="flex flex-col min-w-[200px]">
                        <Link
                          href={`/products#${category.id}`}
                          className="text-base font-bold text-gray-900 mb-4 hover:text-brand-800 flex items-center justify-between group/cat uppercase"
                        >
                          {t(category.title)}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-all text-brand-800" />
                        </Link>
                        <div className="flex flex-col space-y-3">
                          {category.products?.map(product => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              className="text-sm text-gray-600 hover:text-brand-800 font-medium transition-colors"
                            >
                              {t(product.name)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : link.href === '/blog' ? (
              <div key={link.name} className="relative group/blog">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-brand-800 ${
                    pathname === link.href ? 'text-brand-800' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover/blog:rotate-180" />
                </Link>
                <div className="absolute top-full -left-[50px] pt-4 hidden group-hover/blog:block transition-all z-50">
                  <div className="min-w-[220px] bg-white rounded-xl shadow-xl border border-gray-100 py-3 flex flex-col">
                    {blogCategories.map((category) => (
                       <Link
                         key={category.id}
                         href={`/blog?category=${encodeURIComponent(category.name)}`}
                         className="px-5 py-2.5 text-sm text-gray-700 hover:text-brand-800 hover:bg-gray-50 transition-colors"
                       >
                         {t(category.name)}
                       </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-brand-800 ${
                  pathname === link.href ? 'text-brand-800' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 z-50">
          
          {/* Search Button & Input */}
          <div className="relative">
             {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm min-w-[200px] lg:min-w-[240px]">
                   <Search className="w-4 h-4 text-gray-400" />
                   <input
                     ref={searchInputRef}
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={t("Tìm kiếm...")}
                     className="w-full bg-transparent border-none outline-none text-sm px-2 text-gray-700"
                   />
                   {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                         <X className="w-3 h-3" />
                      </button>
                   )}
                   <button type="button" onClick={() => setSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-full ml-1 text-gray-500">
                      <X className="w-4 h-4" />
                   </button>
                </form>
             ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 text-gray-700 hover:text-brand-800 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                   <Search className="w-5 h-5" />
                </button>
             )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
            >
              <Image
                src={currentLang === 'VN' ? "https://flagcdn.com/w20/vn.png" : "https://flagcdn.com/w20/gb.png"}
                alt={currentLang}
                className="w-5 h-auto rounded-sm"
                width={20}
                height={15}
                referrerPolicy="no-referrer"
              />
              <span className="hidden md:inline">{currentLang}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden z-50">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${currentLang === 'VN' ? 'font-bold text-brand-800 bg-brand-50/50' : 'text-gray-700'}`}
                  onClick={() => { setCurrentLang('VN'); i18n.changeLanguage('vi'); setLangDropdownOpen(false); }}
                >
                  <Image src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-auto rounded-sm" width={20} height={15} referrerPolicy="no-referrer" />
                  Tiếng Việt
                </button>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${currentLang === 'EN' ? 'font-bold text-brand-800 bg-brand-50/50' : 'text-gray-700'}`}
                  onClick={() => { setCurrentLang('EN'); i18n.changeLanguage('en'); setLangDropdownOpen(false); }}
                >
                  <Image src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-sm" width={20} height={15} referrerPolicy="no-referrer" />
                  English
                </button>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-gray-900 bg-white rounded-full shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-4 px-4 lg:hidden h-screen flex flex-col min-h-screen overflow-y-auto pb-32">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                link.href === '/products' ? (
                  <div key={link.name} className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-semibold leading-6 p-3 transition-colors flex justify-between items-center ${
                        pathname === link.href ? 'bg-brand-50 text-brand-800' : 'text-gray-900 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                    <div className="flex flex-col py-2 px-4 shadow-inner space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="flex flex-col">
                          <Link
                            onClick={() => setMobileMenuOpen(false)}
                            href={`/products#${category.id}`}
                            className="py-1 text-sm font-bold text-gray-900 border-b border-gray-100 mb-2 uppercase"
                          >
                            {t(category.title)}
                          </Link>
                          <div className="flex flex-col space-y-2 pl-2">
                            {category.products?.map(product => (
                              <Link
                                key={product.id}
                                onClick={() => setMobileMenuOpen(false)}
                                href={`/product/${product.id}`}
                                className="text-sm text-gray-600 hover:text-brand-800"
                              >
                                {t(product.name)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-semibold leading-6 p-3 rounded-xl transition-colors ${
                      pathname === link.href ? 'bg-brand-50 text-brand-800' : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
