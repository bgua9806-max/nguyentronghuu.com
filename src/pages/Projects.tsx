import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FADE_UP } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { optimizeImageUrl } from '../lib/imageUtils';
import { ArrowUpRight, Loader2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 xl:px-8 max-w-7xl mx-auto min-h-screen"
    >
      <SEO 
        title="Dự án Web, App & AI Automation"
        description="Các dự án Web, App, hệ thống phần mềm và tự động hóa AI do Nguyễn Trọng Hữu tư vấn và triển khai."
        url="https://nguyentronghuu.com/projects"
        keywords="dự án công nghệ, portfolio, phần mềm, hệ thống AI, Web App"
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Dự án', url: 'https://nguyentronghuu.com/projects' },
        ]}
      />

      <motion.div
        initial="initial"
        whileInView="whileInView"
        variants={FADE_UP}
        className="mb-16 md:mb-24 max-w-4xl"
      >
        <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 md:mb-8">
          Tuyển tập Dự án
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-6 md:mb-8">
          Sản phẩm thực, <br className="hidden md:block" />
          <span className="italic text-zinc-500 font-light">giá trị thực.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed">
          Khám phá các dự án tiêu biểu mình đã triển khai, từ hệ thống Web/App phức tạp đến các chiến dịch tự động hóa mang lại hiệu quả đo lường được.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 flex justify-center py-24">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-1 md:col-span-2 py-24 text-center text-zinc-500">Chưa có dự án nào được cập nhật.</div>
        ) : projects.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: (idx % 2) * 0.2 } }
            }}
          >
            <Link to={`/projects/${project.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-zinc-900/5">
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <img 
                  src={optimizeImageUrl(project.cover_image || '', 600)} 
                  alt={project.title} 
                  width="800" height="450"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/60 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-800 backdrop-blur-sm">
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold text-white">{project.year}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-5">
                  <h3 className="font-serif text-xl leading-snug text-zinc-900 transition-colors group-hover:text-amber-700 md:text-2xl">{project.title}</h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-all duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
                {project.seo_description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">{project.seo_description}</p>
                )}
                <div className="mt-auto pt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-zinc-900">
                  Xem case study
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
