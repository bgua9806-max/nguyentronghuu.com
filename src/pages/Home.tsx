import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import { STAGGER, STAGGER_ITEM, FADE_UP } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import regeneratedImage from '../assets/images/regenerated_image.webp';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setLatestPosts(data || []);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="Trang chủ" 
        description="Nguyễn Trọng Hữu - Người xây dựng giải pháp nền tảng Web, Mobile App và hệ thống AI Automation. Tư vấn chuyển đổi số và tối ưu vận hành doanh nghiệp." 
        url="https://nguyentronghuu.com"
        keywords="Nguyễn Trọng Hữu, tư vấn công nghệ, AI Automation, Web Developer, Mobile App, chuyển đổi số"
      />

      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16 md:gap-8">
          <div className="max-w-2xl md:w-2/3">
            {/* LCP-critical: No animation — renders instantly */}
            <h1 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">
              Mình là Nguyễn Trọng Hữu
            </h1>
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-6 md:mb-8">
              Giải pháp công nghệ <br className="hidden md:block"/>
              <span className="italic text-zinc-500">tối ưu</span> & trải nghiệm <span className="italic text-zinc-500">vượt trội.</span>
            </h2>
            {/* Non-LCP: Subtle fade-in animation is OK */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm md:text-base text-zinc-600 max-w-xl leading-relaxed mb-10 md:mb-12"
            >
              Người xây dựng giải pháp nền tảng Web/App và tự động hóa AI, đồng hành chuyển đổi số và tối ưu vận hành doanh nghiệp.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/projects" 
                className="inline-flex items-center space-x-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
              >
                <span>Xem dự án</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full max-w-[280px] md:max-w-[320px] md:w-1/3"
          >
            <div className="aspect-[3/4] overflow-hidden bg-zinc-100 rounded-tr-[4rem] rounded-bl-[4rem]">
              <img 
                src="https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png" 
                alt="Nguyễn Trọng Hữu - Avatar" 
                width="320" height="427"
                fetchPriority="high"
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12 border-y border-zinc-200/50 bg-white overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-flex space-x-8 md:space-x-12 items-center">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-lg md:text-2xl font-serif text-zinc-500">System Architecture</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-500">Web & App Development</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-500">AI Automation</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-500">Tech Consulting</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-500">Marketing Strategy</span>
              <span className="text-zinc-300">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-zinc-50 border-b border-zinc-200 px-6 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center"
          >
            <div className="lg:col-span-5 order-2 lg:order-1 relative">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-zinc-200 shadow-lg">
                <img 
                  referrerPolicy="no-referrer"
                  src={regeneratedImage} 
                  alt="Nguyễn Trọng Hữu" 
                  width="600" height="750"
                  fetchPriority="high"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 lg:-right-6 bg-white/95 backdrop-blur-sm p-4 md:p-5 shadow-lg rounded-sm border border-zinc-100 min-w-[160px] h-[81.6px] flex flex-col justify-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Kinh nghiệm</p>
                <p className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 leading-none">5+ Năm</p>
              </div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 lg:mb-8">Nguyễn Trọng Hữu là ai?</h2>
              
              <p className="text-xl md:text-3xl leading-snug text-zinc-900 font-serif font-medium mb-8">
                Mình là một người tư vấn và xây dựng nền tảng công nghệ, giải pháp số và AI.
              </p>
              
              <div className="space-y-6 text-sm md:text-base text-zinc-600 mb-10">
                <p>
                  Niềm đam mê của mình là biến những vấn đề phức tạp thành các giải pháp công nghệ đơn giản, tinh tế và mang lại hiệu quả cao nhất cho doanh nghiệp.
                </p>
                <p>
                  Từ việc kiến tạo các hệ thống Web, App toàn diện đến tích hợp AI Automation, mình luôn đặt yếu tố <span className="text-zinc-900 italic font-medium">"Tối ưu hóa"</span> và <span className="text-zinc-900 italic font-medium">"Trải nghiệm người dùng"</span> lên hàng đầu.
                </p>
                <p>
                  Ngoài công việc, mình còn là một người thích chia sẻ kiến thức về Marketing, Quản trị hệ thống và các góc nhìn về Công nghệ qua blog cá nhân này.
                </p>
              </div>
              
              <div>
                <Link 
                  to="/about" 
                  className="inline-flex items-center space-x-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
                >
                  <span>Biết thêm về mình</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
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
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900 leading-tight">
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
            {isLoading ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : latestPosts.map((post, idx) => (
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
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="w-full aspect-video bg-zinc-100 overflow-hidden mb-6 rounded-sm relative">
                    <img 
                      src={post.cover_image || 'https://via.placeholder.com/400x300'} 
                      alt={post.title} 
                      width="400" height="225"
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold text-zinc-900 uppercase tracking-widest shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-3 text-xs font-medium text-zinc-500">
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span>5 min read</span>
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
