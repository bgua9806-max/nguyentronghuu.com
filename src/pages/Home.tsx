import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { STAGGER, STAGGER_ITEM, FADE_UP, BLOG_POSTS } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
  const latestPosts = BLOG_POSTS.slice(0, 3);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="Trang chủ" 
        description="Nguyễn Trọng Hữu - Chuyên gia Marketing và Chiến lược gia thương hiệu." 
      />

      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial="initial"
          animate="whileInView"
          variants={STAGGER}
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16 md:gap-8"
        >
          <div className="max-w-2xl md:w-2/3">
            <motion.p variants={STAGGER_ITEM} className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">
              Nguyễn Trọng Hữu &mdash; Chuyên gia Digital Marketing
            </motion.p>
            <motion.h1 
              variants={STAGGER_ITEM} 
              className="text-5xl md:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-8"
            >
              Chiến lược tiếp thị <br className="hidden md:block"/>
              <span className="italic text-zinc-500">tinh tế</span> & có <span className="italic text-zinc-500">trọng tâm.</span>
            </motion.h1>
            <motion.p variants={STAGGER_ITEM} className="text-lg text-zinc-600 max-w-xl leading-relaxed mb-12">
              Tôi giúp các thương hiệu hàng đầu xây dựng chiến lược Digital Marketing cân bằng hoàn hảo giữa hiệu quả tăng trưởng và trải nghiệm thương hiệu cao cấp.
            </motion.p>
            <motion.div variants={STAGGER_ITEM}>
              <Link 
                to="/projects" 
                className="inline-flex items-center space-x-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
              >
                <span>Xem dự án</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
          
          <motion.div variants={STAGGER_ITEM} className="w-full max-w-[280px] md:max-w-[320px] md:w-1/3">
            <div className="aspect-[3/4] overflow-hidden bg-zinc-100 rounded-tr-[4rem] rounded-bl-[4rem]">
              <img 
                src="https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png" 
                alt="Nguyễn Trọng Hữu - Avatar" 
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8 md:py-12 border-y border-zinc-200/50 bg-white overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-flex space-x-8 md:space-x-12 items-center">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">SEO Strategy</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Performance Marketing</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Conversion Optimization</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Data Analytics</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">UI/UX Strategy</span>
              <span className="text-zinc-300">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-24 md:py-32 bg-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
              initial="initial"
              whileInView="whileInView"
              variants={FADE_UP}
              className="max-w-xl"
            >
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Góc nhìn & Phân tích</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-zinc-900 leading-tight">
                Bài viết mới nhất
              </h3>
            </motion.div>
            
            <motion.div
              initial="initial"
              whileInView="whileInView"
              variants={FADE_UP}
            >
              <Link 
                to="/blog" 
                className="inline-flex items-center space-x-2 border-b-2 border-zinc-200 hover:border-zinc-900 pb-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } }
                }}
              >
                <Link to={`/blog/${post.id}`} className="group block">
                  <div className="w-full aspect-[4/3] bg-zinc-100 overflow-hidden mb-6 rounded-sm relative">
                    <img 
                      src={post.img} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-3 text-xs font-medium text-zinc-400">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span>{post.readTime || '5 min read'}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-serif text-zinc-900 mb-3 group-hover:text-zinc-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="inline-flex items-center space-x-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors">
                    <span>Đọc tiếp</span>
                    <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
