import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import { STAGGER, STAGGER_ITEM, FADE_UP } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import homeAiWorkflowPortrait from '../assets/images/home-ai-workflow-portrait.png';
import { optimizeImageUrl } from '../lib/imageUtils';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        // Lazy-load Supabase to keep it off the critical path
        const { supabase } = await import('../lib/supabase');
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
        title="Nguyễn Trọng Hữu | Giải pháp Web, App & AI Automation"
        description="Tư vấn và phát triển Web, Mobile App, kiến trúc hệ thống và AI Automation giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững."
        url="https://nguyentronghuu.com"
        keywords="Nguyễn Trọng Hữu, tư vấn công nghệ, AI Automation, Web Developer, Mobile App, chuyển đổi số"
      />

      <section className="relative overflow-hidden border-b border-zinc-200/60 px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute -right-32 top-12 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8 lg:col-span-8">
            {/* LCP-critical: No animation — renders instantly */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              Tư vấn · Thiết kế · Triển khai
            </div>
            <h1 className="mb-6 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl">
              Biến ý tưởng thành <span className="italic text-zinc-500">Web, App & AI</span> vận hành hiệu quả.
            </h1>
            {/* All hero content renders instantly — no JS-based opacity:0 */}
            <p className="mb-9 max-w-2xl text-base leading-relaxed text-zinc-600 animate-fade-in md:text-lg" style={{ animationDelay: '0.1s' }}>
              Mình là Nguyễn Trọng Hữu — tư vấn và xây dựng sản phẩm số giúp doanh nghiệp giảm thao tác thủ công, kết nối dữ liệu và nâng cao trải nghiệm khách hàng.
            </p>
            <div className="flex flex-col gap-3 animate-fade-in sm:flex-row sm:items-center" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-500 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <span>Nhận tư vấn</span>
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/projects"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:-translate-y-0.5 hover:border-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
              >
                <span>Xem dự án</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-zinc-200 border-y border-zinc-200 py-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="pr-3 sm:pr-6">
                <dt className="text-xl font-semibold text-zinc-900 sm:text-2xl">5+</dt>
                <dd className="mt-1 text-[10px] leading-snug text-zinc-500 sm:text-xs">Năm kinh nghiệm</dd>
              </div>
              <div className="px-3 sm:px-6">
                <dt className="text-sm font-semibold text-zinc-900 sm:text-base">Web · App</dt>
                <dd className="mt-1 text-[10px] leading-snug text-zinc-500 sm:text-xs">Phát triển sản phẩm</dd>
              </div>
              <div className="pl-3 sm:pl-6">
                <dt className="text-sm font-semibold text-zinc-900 sm:text-base">AI Automation</dt>
                <dd className="mt-1 text-[10px] leading-snug text-zinc-500 sm:text-xs">Tối ưu vận hành</dd>
              </div>
            </dl>
          </div>
          
          <div className="relative mx-auto w-full max-w-[300px] md:col-span-4 md:max-w-[340px]">
            <div className="absolute -inset-3 rounded-tr-[5rem] rounded-bl-[5rem] border border-amber-300/60" aria-hidden="true" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-bl-[4.5rem] rounded-tr-[4.5rem] bg-zinc-100 shadow-xl shadow-zinc-900/10">
              <img 
                src="https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png" 
                alt="Nguyễn Trọng Hữu - Chuyên gia tư vấn và phát triển giải pháp Web, App, AI"
                width="340" height="453"
                fetchPriority="high"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Web · App · AI Automation
            </div>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 1.03, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 order-2 lg:order-1 relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-zinc-200 shadow-lg">
                <img 
                  referrerPolicy="no-referrer"
                  src={homeAiWorkflowPortrait} 
                  alt="Nguyễn Trọng Hữu" 
                  width="600" height="750"
                  fetchPriority="high"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              variants={STAGGER}
              className="lg:col-span-7 order-1 lg:order-2"
            >
              <motion.h2 variants={STAGGER_ITEM} className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 lg:mb-8">Nguyễn Trọng Hữu là ai?</motion.h2>
              
              <motion.p variants={STAGGER_ITEM} className="text-xl md:text-3xl leading-snug text-zinc-900 font-serif font-medium mb-8">
                Mình là một người tư vấn và xây dựng nền tảng công nghệ, giải pháp số và AI.
              </motion.p>
              
              <div className="space-y-6 text-sm md:text-base text-zinc-600 mb-10">
                <motion.p variants={STAGGER_ITEM}>
                  Niềm đam mê của mình là biến những vấn đề phức tạp thành các giải pháp công nghệ đơn giản, tinh tế và mang lại hiệu quả cao nhất cho doanh nghiệp.
                </motion.p>
                <motion.p variants={STAGGER_ITEM}>
                  Từ việc kiến tạo các hệ thống Web, App toàn diện đến tích hợp AI Automation, mình luôn đặt yếu tố <span className="text-zinc-900 italic font-medium">"Tối ưu hóa"</span> và <span className="text-zinc-900 italic font-medium">"Trải nghiệm người dùng"</span> lên hàng đầu.
                </motion.p>
                <motion.p variants={STAGGER_ITEM}>
                  Ngoài công việc, mình còn là một người thích chia sẻ kiến thức về Marketing, Quản trị hệ thống và các góc nhìn về Công nghệ qua blog cá nhân này.
                </motion.p>
              </div>
              
              <motion.div variants={STAGGER_ITEM}>
                <Link 
                  to="/about" 
                  className="inline-flex items-center space-x-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
                >
                  <span>Biết thêm về mình</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
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

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {isLoading ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : latestPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={STAGGER_ITEM}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="w-full aspect-video bg-zinc-100 overflow-hidden mb-6 rounded-sm relative">
                    <img 
                      src={optimizeImageUrl(post.cover_image || '', 400)} 
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
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
