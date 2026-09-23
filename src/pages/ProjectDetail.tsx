import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM, PROJECTS_DATA } from '../data';
import { ArrowLeft, Share2, Loader2, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Video } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const getYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareText, setShareText] = useState("Chia sẻ dự án");
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
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
  }, [project]);

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
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (!error && data) {
          setProject(data);
          const { data: relatedData } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'completed')
            .neq('id', data.id)
            .limit(2)
            .order('created_at', { ascending: false });
          setRelatedProjects(relatedData || []);
        } else {
          const staticProject = PROJECTS_DATA.find(p => p.slug === slug);
          if (staticProject) {
            setProject({
              ...staticProject,
              cover_image: staticProject.img,
              seo_title: `${staticProject.title} | Nguyễn Trọng Hữu`,
              seo_description: staticProject.description,
              tech_stack: staticProject.tech_stack || [],
              content: staticProject.content || ''
            });
            setRelatedProjects(PROJECTS_DATA.filter(p => p.slug !== slug).slice(0, 2).map(p => ({
              ...p,
              cover_image: p.img
            })));
          } else {
            throw error || new Error('Project not found');
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        const staticProject = PROJECTS_DATA.find(p => p.slug === slug);
        if (staticProject) {
          setProject({
            ...staticProject,
            cover_image: staticProject.img,
            seo_title: `${staticProject.title} | Nguyễn Trọng Hữu`,
            seo_description: staticProject.description,
            tech_stack: staticProject.tech_stack || [],
            content: staticProject.content || ''
          });
          setRelatedProjects(PROJECTS_DATA.filter(p => p.slug !== slug).slice(0, 2).map(p => ({
            ...p,
            cover_image: p.img
          })));
        } else {
          navigate('/projects');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProject();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải dự án...</p>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Đã chép link!");
    setTimeout(() => setShareText("Chia sẻ dự án"), 2000);
  };

  const youtubeId = getYouTubeId(project.link);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 lg:px-8 max-w-5xl mx-auto min-h-screen"
    >
      <SEO 
        title={project.seo_title || project.title} 
        description={project.seo_description || `Dự án: ${project.title} của Nguyễn Trọng Hữu`}
        type="project"
        image={project.cover_image}
        url={`https://nguyentronghuu.com/projects/${project.slug}`}
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Dự án', url: 'https://nguyentronghuu.com/projects' },
          { name: project.title, url: `https://nguyentronghuu.com/projects/${project.slug}` },
        ]}
      />

      <Link 
        to="/projects"
        className="inline-flex items-center space-x-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft size={16} />
        <span>Trở lại Dự án</span>
      </Link>

      <motion.div
        variants={STAGGER}
        initial="initial"
        animate="whileInView"
      >
        <motion.div variants={STAGGER_ITEM} className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-sm">
              {project.category}
            </span>
            <span className="text-sm font-medium text-zinc-500">{project.year}</span>
            {youtubeId && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-200">
                <Video size={13} className="text-red-600" />
                <span>Video Demo Walkthrough</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-zinc-900 mb-6 md:mb-8 leading-tight">
            {project.title}
          </h1>
          {project.seo_description && (
             <p className="text-sm md:text-2xl text-zinc-600 leading-relaxed max-w-3xl">
               {project.seo_description}
             </p>
          )}
        </motion.div>

        {/* Hero Media: Native HTML5 Clean Video (Zero YouTube Logo & Scroll Autoplay) or YouTube or Cover Image */}
        <motion.div variants={STAGGER_ITEM} className="w-full mb-16 md:mb-24">
          {slug === 'fourland-crm-3d' ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-2xl group">
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
                    {isPlaying ? 'Tự động phát khi cuộn tới' : 'Tạm dừng'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 border border-white/10"
                    title={isPlaying ? "Tạm dừng" : "Phát"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-white" />}
                  </button>

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
          ) : youtubeId ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-2xl">
              {isPlayingVideo ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="group relative h-full w-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                  <img
                    src={project.cover_image || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt={project.title}
                    width="1280"
                    height="720"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent transition-opacity group-hover:opacity-75" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                    <button
                      type="button"
                      aria-label="Phát video demo"
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-2xl shadow-amber-500/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-400 focus:outline-none"
                    >
                      <Play size={32} className="ml-1 fill-zinc-950" />
                    </button>
                    <div className="rounded-full bg-zinc-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                      Bấm để xem Video Demo thực tế (2:57)
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center bg-zinc-50 rounded-sm">
              <img src={project.cover_image || 'https://via.placeholder.com/1200x600'} alt={project.title} width="1200" height="675" className="w-full h-auto max-h-[70vh] object-contain rounded-sm" />
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
                {project.client && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Khách hàng</h4>
                        <p className="text-zinc-600">{project.client}</p>
                    </div>
                )}
                {project.year && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Năm thực hiện</h4>
                        <p className="text-zinc-600">{project.year}</p>
                    </div>
                )}
                {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Công nghệ & Phương pháp</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech_stack.map((tech: string, i: number) => (
                            <span key={i} className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                    </div>
                )}
                {project.link && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Sản phẩm / Link</h4>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-4"
                        >
                          <span>{youtubeId ? 'Xem trực tiếp trên YouTube' : 'Xem dự án thực tế'}</span>
                          <ExternalLink size={14} />
                        </a>
                    </div>
                )}
            </div>

            <div className="lg:col-span-8 space-y-12 md:space-y-16">
                <motion.div variants={STAGGER_ITEM} className="prose md:prose-lg prose-zinc max-w-none text-base md:text-lg text-zinc-700 leading-relaxed">
                  {project.content ? (
                    <div dangerouslySetInnerHTML={{ __html: project.content.replace(/\\n/g, '\n').replace(/font-family:[^;"]*;?/gi, '').replace(/line-height:[^;"]*;?/gi, '').replace(/font-size:[^;"]*;?/gi, '').replace(/background-color:[^;"]*;?/gi, '') }} />
                  ) : (
                    <p className="italic text-zinc-500">Đang cập nhật chi tiết dự án...</p>
                  )}
                </motion.div>
                <aside className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-600">
                  <strong className="text-zinc-900">Phạm vi công bố:</strong> Nội dung case study mô tả phần thông tin được phép chia sẻ. Tên khách hàng hoặc dữ liệu nhạy cảm có thể được khái quát; kết quả định lượng chỉ nên được hiểu trong phạm vi và thời gian nêu trong dự án.{' '}
                  <Link to="/editorial-policy" className="font-semibold text-amber-700 underline underline-offset-4">Xem nguyên tắc công bố</Link>.
                </aside>
            </div>
        </div>

        <motion.div variants={STAGGER_ITEM} className="mt-16 pt-8 border-t border-zinc-200">
           <button 
             onClick={handleShare}
             className="flex items-center space-x-2 px-4 py-2 rounded-full border border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
           >
             <Share2 size={18} />
             <span className="font-medium">{shareText}</span>
           </button>
        </motion.div>
      </motion.div>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-zinc-200 pt-16 mt-16">
          <h3 className="text-2xl font-serif text-zinc-900 mb-8">Dự án liên quan</h3>
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 md:mx-0 md:px-0">
            {relatedProjects.map((rp) => (
              <Link 
                key={rp.id} 
                to={`/projects/${rp.slug}`}
                className="group block w-[300px] sm:w-[320px] md:w-auto flex-shrink-0 snap-center"
              >
                <div className="w-full aspect-video overflow-hidden rounded-sm bg-zinc-100 mb-6">
                  <img 
                    src={rp.cover_image || 'https://via.placeholder.com/600x400'} 
                    alt={rp.title} 
                    width="600" height="338"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest bg-zinc-100 px-2.5 py-1 rounded-sm">
                    {rp.category}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">{rp.year}</span>
                </div>
                <h4 className="text-2xl font-serif text-zinc-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {rp.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.article>
  );
}
