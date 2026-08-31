import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Menu, X, Facebook, Sun, Moon, ArrowUpRight, Phone, MessageCircle, Mail } from 'lucide-react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { SOCIAL_LINKS, COPYRIGHT_TEXT } from './data';
import logoUrl from './assets/images/logo3.webp';

// Eager: Home (LCP page - must load instantly)
import Home from './pages/Home';

// Lazy-loaded pages (code splitting - only loads when navigated to)
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const BlogList = React.lazy(() => import('./pages/BlogList'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Contact = React.lazy(() => import('./pages/Contact'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const MetaAds = React.lazy(() => import('./pages/MetaAds'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Lazy-loaded Admin Pages
const Login = React.lazy(() => import('./pages/admin/Login'));
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const BlogManager = React.lazy(() => import('./pages/admin/BlogManager'));
const PostEditor = React.lazy(() => import('./pages/admin/PostEditor'));
const ProjectManager = React.lazy(() => import('./pages/admin/ProjectManager'));
const ProjectEditor = React.lazy(() => import('./pages/admin/ProjectEditor'));
const ServiceManager = React.lazy(() => import('./pages/admin/ServiceManager'));
const ServiceEditor = React.lazy(() => import('./pages/admin/ServiceEditor'));
const ContactManager = React.lazy(() => import('./pages/admin/ContactManager'));
const EmailSettings = React.lazy(() => import('./pages/admin/EmailSettings'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));

function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isContactPage = location.pathname === '/contact';
  const isMetaAdsPage = location.pathname === '/meta_ads';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const phoneLink = SOCIAL_LINKS.find((link) => link.type === 'phone');
  const zaloLink = SOCIAL_LINKS.find((link) => link.name === 'Zalo');
  const showMobileContactBar = !isContactPage && !isMetaAdsPage && !isMobileMenuOpen;
  const navLinkTone = isContactPage && !isScrolled ? 'hover:text-white' : 'hover:text-zinc-900 dark:hover:text-white';
  const navUnderlineTone = isContactPage && !isScrolled ? 'bg-white' : 'bg-zinc-900 dark:bg-white';

  // Use useEffect to scroll to top on path change
  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Initialize Lenis Smooth Scroll (ignored for admin routes)
  useEffect(() => {
    if (isAdminRoute) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    (window as any).lenis = lenisInstance;

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      (window as any).lenis = null;
    };
  }, [isAdminRoute]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
      }
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (isAdminRoute) {
        root.classList.remove('dark');
        return;
      }
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Failed to update theme classes or localStorage:', e);
    }
  }, [theme, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" /></div>}>
        <Routes location={location}>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<BlogManager />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/edit/:id" element={<PostEditor />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/edit/:id" element={<ProjectEditor />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="services/new" element={<ServiceEditor />} />
            <Route path="services/edit/:id" element={<ServiceEditor />} />
            <Route path="contacts" element={<ContactManager />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${showMobileContactBar ? 'pb-24 md:pb-0' : ''}`}>
      {/* Navigation */}
      {!isMetaAdsPage && (
        <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? 'pt-4 px-4' : 'pt-6 px-0'
        }`}
      >
        <div 
          className={`relative z-50 flex justify-between items-center transition-all duration-500 h-[51px] ${
            (isScrolled && !isMobileMenuOpen)
              ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm rounded-full px-6 md:px-8 w-full max-w-4xl'
              : 'w-full max-w-6xl px-6 md:px-12 bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center z-50 group h-full py-1">
            <img 
              src={logoUrl} 
              alt="Hữu Logo" 
              width="152"
              height="46"
              className="h-[46px] w-[152px] object-contain transition-transform duration-300 transform group-hover:scale-[1.02] origin-left" 
              style={{
                filter: theme === 'dark' || isMobileMenuOpen || (isContactPage && !isScrolled) ? 'invert(1) brightness(1.5)' : 'contrast(1.05)',
                mixBlendMode: theme === 'dark' || isMobileMenuOpen || (isContactPage && !isScrolled) ? 'screen' : 'multiply'
              }}
            />
          </Link>
          <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${isContactPage && !isScrolled ? 'text-zinc-400' : 'text-zinc-500'}`}>
            <Link to="/about" className={`relative group transition-colors py-1 ${navLinkTone} ${location.pathname === '/about' ? 'text-zinc-900' : ''}`}>
              <span>Giới thiệu</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${navUnderlineTone} transition-all duration-300 ${location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/services" className={`relative group transition-colors py-1 ${navLinkTone} ${location.pathname === '/services' ? 'text-zinc-900' : ''}`}>
              <span>Dịch vụ</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${navUnderlineTone} transition-all duration-300 ${location.pathname === '/services' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/projects" className={`relative group transition-colors py-1 ${navLinkTone} ${location.pathname === '/projects' ? 'text-zinc-900' : ''}`}>
              <span>Dự án</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${navUnderlineTone} transition-all duration-300 ${location.pathname === '/projects' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/blog" className={`relative group transition-colors py-1 ${navLinkTone} ${location.pathname.startsWith('/blog') ? 'text-zinc-900' : ''}`}>
              <span>Bài viết</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${navUnderlineTone} transition-all duration-300 ${location.pathname.startsWith('/blog') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link
              to="/contact"
              className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                isContactPage && !isScrolled
                  ? 'bg-white text-zinc-950 hover:bg-amber-400'
                  : 'bg-zinc-950 text-white shadow-sm hover:bg-amber-500 hover:text-zinc-950 dark:bg-white dark:text-zinc-950'
              } ${location.pathname === '/contact' ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-transparent' : ''}`}
            >
              <span>Nhận tư vấn</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center justify-center p-1 ml-2 rounded-full transition-colors cursor-pointer ${
                isContactPage && !isScrolled ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
              }`}
              aria-label={theme === 'dark' ? 'Bật giao diện sáng' : 'Bật giao diện tối'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isMobileMenuOpen || (isContactPage && !isScrolled) ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
              }`}
              aria-label={theme === 'dark' ? 'Bật giao diện sáng' : 'Bật giao diện tối'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                 <X size={24} className="text-white" />
              ) : (
                 <Menu size={24} className={isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900 dark:text-white'} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-between pt-32 pb-12 px-8 overflow-y-auto md:hidden"
            >
              <motion.div 
                className="flex flex-col mt-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {[
                  { path: '/', label: 'Trang chủ', num: '01' },
                  { path: '/about', label: 'Giới thiệu', num: '02' },
                  { path: '/services', label: 'Dịch vụ', num: '03' },
                  { path: '/projects', label: 'Dự án', num: '04' },
                  { path: '/blog', label: 'Bài viết', num: '05' },
                ].map((item) => (
                  <motion.div 
                    key={item.num}
                    variants={{ 
                      hidden: { x: -30, opacity: 0 }, 
                      visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } 
                    }}
                    className="border-b border-white/10 last:border-0"
                  >
                    <Link 
                      to={item.path} 
                      className="py-5 flex items-baseline justify-between group"
                    >
                      <span className="text-3xl sm:text-4xl font-serif text-white group-hover:text-amber-500 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-zinc-600 group-hover:text-amber-500/50 transition-colors">
                        {item.num}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="pt-8"
                >
                  <Link
                    to="/contact"
                    className="group flex min-h-14 w-full items-center justify-between rounded-full bg-amber-400 px-6 py-4 text-zinc-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    <span className="text-base font-semibold">Nhận tư vấn dự án</span>
                    <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </motion.div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      )}

      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" /></div>}>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} className="h-full">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<LegalPage variant="privacy" />} />
                <Route path="/terms" element={<LegalPage variant="terms" />} />
                <Route path="/meta_ads" element={<MetaAds />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isContactPage && !isMetaAdsPage && (
        <footer className="bg-white pt-16 pb-8 border-t border-zinc-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
              <div className="md:col-span-4">
                <div className="mb-6 -ml-2">
                  <img 
                    src={logoUrl} 
                    alt="Hữu Logo" 
                    className="h-10 w-auto object-contain origin-left" 
                    style={{ 
                      filter: theme === 'dark' ? 'invert(1) brightness(1.5)' : 'contrast(1.05)', 
                      mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' 
                    }} 
                  />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6 pr-4">
                  Mình chuyên tư vấn và triển khai xây dựng hệ thống phần mềm, phát triển Web, App và tự động hóa AI, giúp doanh nghiệp tối ưu hóa quy trình và tăng trưởng bền vững.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/nguyen.trong.huu.838820/?locale=vi_VN" target="_blank" rel="noopener noreferrer" aria-label="Facebook của Nguyễn Trọng Hữu" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <Facebook size={18} className="text-zinc-600 group-hover:text-blue-600 transition-colors" />
                  </a>
                  <a href="https://zalo.me/0845555851" target="_blank" rel="noopener noreferrer" aria-label="Zalo của Nguyễn Trọng Hữu" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <MessageCircle size={18} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                  </a>
                  <a href="mailto:nguyentronghuu1905@gmail.com" aria-label="Gửi email cho Nguyễn Trọng Hữu" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <Mail size={18} className="text-zinc-600 group-hover:text-amber-600 transition-colors" />
                  </a>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-zinc-900 font-bold mb-6 tracking-wide text-sm">GIỚI THIỆU</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><Link to="/about" className="hover:text-zinc-900 transition-colors">Về tôi</Link></li>
                  <li><Link to="/services" className="hover:text-zinc-900 transition-colors">Dịch vụ</Link></li>
                  <li><Link to="/projects" className="hover:text-zinc-900 transition-colors">Dự án</Link></li>
                  <li><Link to="/blog" className="hover:text-zinc-900 transition-colors">Bài viết</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-zinc-900 font-bold mb-6 tracking-wide text-sm">CHÍNH SÁCH</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><Link to="/terms" className="hover:text-zinc-900 transition-colors">Điều khoản sử dụng</Link></li>
                  <li><Link to="/privacy" className="hover:text-zinc-900 transition-colors">Chính sách bảo mật</Link></li>
                </ul>
              </div>

              <div className="md:col-span-4">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bắt đầu dự án</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">Chia sẻ bài toán để nhận đề xuất hướng triển khai phù hợp.</p>
                  <Link to="/contact" className="group mt-5 flex min-h-11 items-center justify-between rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-500 hover:text-zinc-950 dark:bg-white dark:text-zinc-950">
                    <span>Nhận tư vấn</span>
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-200 text-xs md:text-sm text-zinc-500 text-center">
              © {new Date().getFullYear()} Nguyen Trong Huu
            </div>
          </div>
        </footer>
      )}

      <AnimatePresence>
        {showMobileContactBar && (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 z-40 rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-2xl shadow-zinc-950/20 backdrop-blur-xl md:hidden"
            style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
            aria-label="Liên hệ nhanh"
          >
            <div className="grid grid-cols-[0.8fr_0.8fr_1.4fr] items-stretch gap-1">
              {phoneLink && (
                <a
                  href={phoneLink.url}
                  className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`Gọi ${phoneLink.name}`}
                >
                  <Phone size={18} strokeWidth={1.8} />
                  <span>Gọi điện</span>
                </a>
              )}
              {zaloLink && (
                <a
                  href={zaloLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Nhắn tin qua Zalo"
                >
                  <MessageCircle size={18} strokeWidth={1.8} />
                  <span>Zalo</span>
                </a>
              )}
              <Link
                to="/contact"
                className="group flex min-h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-3 text-xs font-semibold text-white transition-colors hover:bg-amber-500 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-white dark:text-zinc-950"
              >
                <span>Nhận tư vấn</span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{
        className: 'text-sm font-medium rounded-sm border border-zinc-200 shadow-xl shadow-black/5',
        style: {
          background: '#fff',
          color: '#09090b',
        },
      }} />
      <MotionConfig reducedMotion="user">
        <Layout />
      </MotionConfig>
    </Router>
  );
}
