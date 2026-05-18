import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FADE_UP } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

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
        title="Dự án" 
        description="Tuyển tập các dự án nổi bật về công nghệ, hệ thống phần mềm và truyền thông mà Nguyễn Trọng Hữu đã thực hiện." 
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
        <h1 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 md:mb-8">
          Tuyển tập Dự án
        </h1>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-6 md:mb-8">
          Sản phẩm thực, <br className="hidden md:block" />
          <span className="italic text-zinc-500 font-light">giá trị thực.</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed">
          Khám phá các dự án tiêu biểu mình đã triển khai, từ hệ thống Web/App phức tạp đến các chiến dịch tự động hóa mang lại hiệu quả đo lường được.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-24">
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
            <Link to={`/projects/${project.slug}`} className="group block">
              <div className="relative overflow-hidden mb-6 bg-zinc-100 aspect-video rounded-sm">
                <img 
                  src={project.cover_image || 'https://via.placeholder.com/800x600'} 
                  alt={project.title} 
                  width="800" height="450"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-zinc-900 mb-2 group-hover:text-zinc-600 transition-colors">{project.title}</h3>
                  <p className="text-sm text-zinc-500">{project.category}</p>
                </div>
                <span className="text-xs font-medium text-zinc-500">{project.year}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
