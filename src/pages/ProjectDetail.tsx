import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft, Share2, Loader2 } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareText, setShareText] = useState("Chia sẻ dự án");
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (error) throw error;
        setProject(data);

        // Fetch related projects
        const { data: relatedData } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'completed')
          .neq('id', data.id)
          .limit(2)
          .order('created_at', { ascending: false });
          
        setRelatedProjects(relatedData || []);
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/projects');
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
        type="article"
        image={project.cover_image}
        url={window.location.href}
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
            <span className="text-sm font-medium text-zinc-400">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-zinc-900 mb-6 md:mb-8 leading-tight">
            {project.title}
          </h1>
          {project.seo_description && (
             <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl">
               {project.seo_description}
             </p>
          )}
        </motion.div>

        <motion.div variants={STAGGER_ITEM} className="w-full aspect-[21/9] md:aspect-[16/9] bg-zinc-100 mb-16 md:mb-24 overflow-hidden rounded-sm">
          <img 
            src={project.cover_image || 'https://via.placeholder.com/1200x600'} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
                {project.client && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Khách hàng</h4>
                        <p className="text-zinc-600">{project.client}</p>
                    </div>
                )}
                {project.link && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Sản phẩm / Link</h4>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline underline-offset-4">Xem dự án thực tế</a>
                    </div>
                )}
            </div>

            <div className="lg:col-span-8 space-y-12 md:space-y-16">
                <motion.div variants={STAGGER_ITEM} className="prose md:prose-lg prose-zinc max-w-none text-base md:text-lg text-zinc-700 leading-relaxed">
                  {project.content ? (
                    <div dangerouslySetInnerHTML={{ __html: project.content }} />
                  ) : (
                    <p className="italic text-zinc-400">Đang cập nhật chi tiết dự án...</p>
                  )}
                </motion.div>
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
                <div className="w-full aspect-[16/9] overflow-hidden rounded-sm bg-zinc-100 mb-6">
                  <img 
                    src={rp.cover_image || 'https://via.placeholder.com/800x450'} 
                    alt={rp.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest bg-zinc-100 px-2.5 py-1 rounded-sm">
                    {rp.category}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">{rp.year}</span>
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
