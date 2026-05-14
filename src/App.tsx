import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Youtube, Twitter, Facebook } from 'lucide-react';
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
                  { path: '/projects', label: 'Dự án', num: '03' },
                  { path: '/blog', label: 'Bài viết', num: '04' },
                  { path: '/contact', label: 'Liên hệ', num: '05' },
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
                  <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <Youtube size={18} className="text-zinc-600 group-hover:text-red-600 transition-colors" />
                  </a>
                  <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <Twitter size={18} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                  </a>
                  <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors group">
                    <Facebook size={18} className="text-zinc-600 group-hover:text-blue-600 transition-colors" />
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
              © {new Date().getFullYear()} Nguyen Trong Huu
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
