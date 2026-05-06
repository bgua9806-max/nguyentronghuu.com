import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { SOCIAL_LINKS, COPYRIGHT_TEXT } from './data';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
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
  }, [location.pathname]);

  const isContactPage = location.pathname === '/contact';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-center ${
          isScrolled ? 'pt-4 px-4' : 'pt-6 px-0'
        }`}
      >
        <div 
          className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/90 backdrop-blur-md border border-zinc-200/50 shadow-sm rounded-full px-8 py-3 w-full max-w-3xl' 
              : 'w-full max-w-6xl px-6 md:px-12 py-2 bg-transparent'
          }`}
        >
          <Link to="/" className={`font-serif text-xl tracking-tight font-medium ${isContactPage && !isScrolled ? 'text-white' : 'text-zinc-900'}`}>
            Hữu<span className={isContactPage && !isScrolled ? 'text-zinc-400' : 'text-zinc-400'}>.</span>
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
        </div>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isContactPage && (
        <footer className="py-12 bg-white border-t border-zinc-200">
           <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-zinc-500">
                {SOCIAL_LINKS.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target={link.type === 'external' ? "_blank" : undefined}
                    rel={link.type === 'external' ? "noopener noreferrer" : undefined}
                    className="hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="text-sm text-zinc-400 text-center md:text-right">
                {COPYRIGHT_TEXT}
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
      <Layout>
        {/* Intentionally empty to let Router handle content */}
      </Layout>
    </Router>
  );
}
