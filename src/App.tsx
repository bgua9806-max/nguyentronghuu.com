import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { SOCIAL_LINKS, COPYRIGHT_TEXT } from './data';
import logoUrl from './assets/images/logo3.png';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogManager from './pages/admin/BlogManager';
import PostEditor from './pages/admin/PostEditor';
import ProjectManager from './pages/admin/ProjectManager';
import ProjectEditor from './pages/admin/ProjectEditor';
import ContactManager from './pages/admin/ContactManager';
import EmailSettings from './pages/admin/EmailSettings';
import Settings from './pages/admin/Settings';

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

  // Use useEffect to scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isContactPage = location.pathname === '/contact';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;
    
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      document.body.style.zoom = "110%";
      document.documentElement.style.setProperty('--ui-zoom', "1.1");
    } else {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', "1");
    }

    return () => {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', "1");
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<BlogManager />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/edit/:id" element={<PostEditor />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="projects/new" element={<ProjectEditor />} />
          <Route path="projects/edit/:id" element={<ProjectEditor />} />
          <Route path="contacts" element={<ContactManager />} />
          <Route path="email" element={<EmailSettings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="min-h-[calc(100vh/var(--ui-zoom,1))] flex flex-col">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? 'pt-4 px-4' : 'pt-6 px-0'
        }`}
      >
        <div 
          className={`relative z-50 flex justify-between items-center transition-all duration-500 h-[51px] ${
            (isScrolled && !isMobileMenuOpen)
              ? 'bg-white/90 backdrop-blur-md border border-zinc-200/50 shadow-sm rounded-full px-6 md:px-8 w-full max-w-3xl' 
              : 'w-full max-w-6xl px-6 md:px-12 bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center z-50 group h-full py-1">
            <img 
              src={logoUrl} 
              alt="Hữu Logo" 
              className="h-[46px] w-[152px] object-contain transition-transform duration-300 transform group-hover:scale-[1.02] origin-left" 
              style={{
                filter: isMobileMenuOpen || (isContactPage && !isScrolled) ? 'invert(1) brightness(1.5)' : 'contrast(1.05)',
                mixBlendMode: isMobileMenuOpen || (isContactPage && !isScrolled) ? 'screen' : 'multiply'
              }}
            />
          </Link>
          <div className={`hidden md:flex space-x-8 text-sm font-medium ${isContactPage && !isScrolled ? 'text-zinc-400' : 'text-zinc-500'}`}>
            <Link to="/about" className={`relative group hover:${isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'} transition-colors py-1 ${location.pathname === '/about' ? 'text-zinc-900' : ''}`}>
              <span>Giới thiệu</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${isContactPage && !isScrolled ? 'bg-white' : 'bg-zinc-900'} transition-all duration-300 ${location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/projects" className={`relative group hover:${isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'} transition-colors py-1 ${location.pathname === '/projects' ? 'text-zinc-900' : ''}`}>
              <span>Dự án</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${isContactPage && !isScrolled ? 'bg-white' : 'bg-zinc-900'} transition-all duration-300 ${location.pathname === '/projects' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/blog" className={`relative group hover:${isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'} transition-colors py-1 ${location.pathname.startsWith('/blog') ? 'text-zinc-900' : ''}`}>
              <span>Bài viết</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${isContactPage && !isScrolled ? 'bg-white' : 'bg-zinc-900'} transition-all duration-300 ${location.pathname.startsWith('/blog') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/contact" className={`relative group hover:${isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'} transition-colors py-1 ${location.pathname === '/contact' ? (isScrolled ? 'text-zinc-900' : 'text-white') : ''}`}>
              <span>Liên hệ</span>
              <span className={`absolute bottom-0 left-0 h-[1.5px] ${isContactPage && !isScrolled ? 'bg-white' : 'bg-zinc-900'} transition-all duration-300 ${location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
               <X size={24} className="text-white" />
            ) : (
               <Menu size={24} className={isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-zinc-900 flex flex-col justify-between pt-32 pb-12 px-8 overflow-y-auto md:hidden"
            >
              <motion.div 
                className="flex flex-col space-y-8 mt-4"
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
                 <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } }}>
                   <Link to="/" className="text-4xl font-serif text-white hover:text-zinc-400 transition-colors">Trang chủ</Link>
                 </motion.div>
                 <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } }}>
                   <Link to="/about" className="text-4xl font-serif text-white hover:text-zinc-400 transition-colors">Giới thiệu</Link>
                 </motion.div>
                 <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } }}>
                   <Link to="/projects" className="text-4xl font-serif text-white hover:text-zinc-400 transition-colors">Dự án</Link>
                 </motion.div>
                 <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } }}>
                   <Link to="/blog" className="text-4xl font-serif text-white hover:text-zinc-400 transition-colors">Bài viết</Link>
                 </motion.div>
                 <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } } }}>
                   <Link to="/contact" className="text-4xl font-serif text-white hover:text-zinc-400 transition-colors">Liên hệ</Link>
                 </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.6 }}
                className="flex flex-col mt-12 space-y-6"
              >
                <div className="w-12 h-[1px] bg-zinc-800"></div>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-400">
                  {SOCIAL_LINKS.map((link, idx) => (
                    <a key={idx} href={link.url} target={link.type === 'external' ? "_blank" : undefined} rel={link.type === 'external' ? "noopener noreferrer" : undefined} className="hover:text-white transition-colors">
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} className="h-full">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!isContactPage && (
        <footer className="bg-white pt-16 pb-8 border-t border-zinc-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
              <div className="md:col-span-4">
                <div className="mb-6 -ml-2">
                  <img src={logoUrl} alt="Hữu Logo" className="h-10 w-auto object-contain origin-left" style={{ filter: 'contrast(1.05)', mixBlendMode: 'multiply' }} />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6 pr-4">
                  Mình chuyên tư vấn và triển khai xây dựng hệ thống phần mềm, phát triển Web, App và tự động hóa AI, giúp doanh nghiệp tối ưu hóa quy trình và tăng trưởng bền vững.
                </p>
                <div className="flex gap-4">
                  <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <svg className="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 2.507 0 0 1 1.768-1.768C5.745 5 12 5 12 5s6.255 0 7.812.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <svg className="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                  </a>
                  <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <svg className="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                  </a>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-zinc-900 font-bold mb-6 tracking-wide text-sm">GIỚI THIỆU</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><Link to="/about" className="hover:text-zinc-900 transition-colors">Về tôi</Link></li>
                  <li><Link to="/projects" className="hover:text-zinc-900 transition-colors">Dự án</Link></li>
                  <li><Link to="/blog" className="hover:text-zinc-900 transition-colors">Bài viết</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-zinc-900 font-bold mb-6 tracking-wide text-sm">CHÍNH SÁCH</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><a href="#" className="hover:text-zinc-900 transition-colors">Điều khoản – điều kiện</a></li>
                  <li><a href="#" className="hover:text-zinc-900 transition-colors">Chính sách bảo mật</a></li>
                  <li><a href="#" className="hover:text-zinc-900 transition-colors">Chính sách Affiliate</a></li>
                  <li><a href="#" className="hover:text-zinc-900 transition-colors">Hướng dẫn vào học</a></li>
                </ul>
              </div>

              <div className="md:col-span-4">
                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-400 text-zinc-900 focus:outline-none rounded-sm text-sm"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors rounded-sm text-sm"
                  >
                    Đăng ký
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-200 text-xs md:text-sm text-zinc-500 text-center">
              © {new Date().getFullYear()} #NguyenTrongHuu · Build with Nguyen Trong Huu
            </div>
          </div>
        </footer>
      )}
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
      <Layout />
    </Router>
  );
}
