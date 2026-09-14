import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Loader2, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Video, ExternalLink } from 'lucide-react';
import { STAGGER, STAGGER_ITEM, FADE_UP } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import homeAiWorkflowPortrait from '../assets/images/home-ai-workflow-portrait.webp';
import { optimizeImageUrl } from '../lib/imageUtils';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

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
                decoding="async"
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
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
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

      {/* Featured Live Showcase Section: FourLand CRM 3D */}
      <section className="py-24 md:py-32 bg-zinc-950 text-white relative overflow-hidden px-6 md:px-12">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <motion.div
              initial="initial"
              whileInView="whileInView"
              variants={FADE_UP}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Dự Án Nổi Bật · Live Showcase
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-white mb-4">
                FourLand CRM 3D
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                Hệ thống quản trị Bất động sản trực quan & Khớp nhu cầu thông minh thế hệ mới, thiết kế theo tư duy định hướng hành động cho sale kết hợp AI và Vibe Coding.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="whileInView"
              variants={FADE_UP}
              className="flex items-center gap-4"
            >
              <Link 
                to="/projects/fourland-crm-3d" 
                className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
              >
                <span>Xem Case Study Chi Tiết</span>
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* Browser Mockup with Video Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-zinc-950/80 mb-12"
          >
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-md bg-zinc-950/60 px-4 py-1 text-xs text-zinc-400 border border-zinc-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>app.fourland.vn · 3D Real Estate CRM Space</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://youtu.be/D4aL51eg7k0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <Video size={13} className="text-red-500" />
                  <span>Mở YouTube</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Native HTML5 Clean Video Player with Zero YouTube Logo & Scroll Autoplay */}
            <div className="relative aspect-video w-full bg-zinc-950 group overflow-hidden">
              <video
                ref={videoRef}
                src="/videos/fourland-crm-3d.mp4"
                poster="https://img.youtube.com/vi/D4aL51eg7k0/maxresdefault.jpg"
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />

              {/* Minimalist Floating Controls */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent flex items-center justify-between opacity-90 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <span className={`flex h-2.5 w-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    {isPlaying ? 'Tự động phát khi cuộn' : 'Tạm dừng'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 border border-white/10"
                    title={isPlaying ? "Tạm dừng" : "Phát"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-white" />}
                  </button>

                  {/* Mute / Unmute Toggle */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 border border-white/10 text-xs font-medium"
                    title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX size={16} className="text-amber-400" />
                        <span className="hidden sm:inline text-zinc-300">Bật tiếng</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={16} className="text-emerald-400" />
                        <span className="hidden sm:inline text-zinc-300">Đang bật tiếng</span>
                      </>
                    )}
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 border border-white/10"
                    title="Toàn màn hình"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
              <div className="text-amber-400 font-serif text-lg mb-2">📞 Hôm nay gọi ai?</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tự động lọc khách hàng đến hạn chăm sóc, khách vừa để lại tương tác hoặc có tín hiệu mua.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
              <div className="text-amber-400 font-serif text-lg mb-2">🎯 Giới thiệu căn nào?</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thuật toán matching tự động khớp tiêu chí tài chính, vị trí, hướng nhà với kho bđs trong 1 click.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
              <div className="text-amber-400 font-serif text-lg mb-2">⏳ Deal nào đang đứng?</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pipeline trực quan cảnh báo các giao dịch bị nghẽn ở bước cọc, hợp đồng hay thủ tục vay.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm">
              <div className="text-amber-400 font-serif text-lg mb-2">💰 Phí nào chưa thu?</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Quản lý chi tiết biểu phí môi giới, hoa hồng phân chia và tiến độ từng đợt thu tiền minh bạch.
              </p>
            </div>
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
