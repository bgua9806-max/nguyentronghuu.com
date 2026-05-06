import React from 'react';
import { motion } from 'motion/react';
import { PROJECTS_DATA, FADE_UP, STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function ProjectDetail() {
  const { id } = useParams();
  const activeProject = PROJECTS_DATA.find(p => p.id === Number(id));

  if (!activeProject) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-4xl mx-auto min-h-screen"
    >
      <SEO 
        title={activeProject.title} 
        description={activeProject.description || `Dự án: ${activeProject.title} của Nguyễn Trọng Hữu`}
        type="article"
        image={activeProject.img}
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
              {activeProject.category}
            </span>
            <span className="text-sm font-medium text-zinc-400">{activeProject.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-6 leading-tight">
            {activeProject.title}
          </h1>
          {activeProject.description && (
             <p className="text-xl text-zinc-600 leading-relaxed max-w-3xl">
               {activeProject.description}
             </p>
          )}
        </motion.div>

        <motion.div variants={STAGGER_ITEM} className="w-full aspect-[21/9] md:aspect-[16/9] bg-zinc-100 mb-16 md:mb-24 overflow-hidden rounded-sm">
          <img 
            src={activeProject.img} 
            alt={activeProject.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="md:col-span-1 space-y-8">
                {activeProject.client && (
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Khách hàng</h4>
                        <p className="text-zinc-600">{activeProject.client}</p>
                    </div>
                )}
                <div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Vai trò</h4>
                    <p className="text-zinc-600">Marketing Strategist</p>
                </div>
            </div>

            <div className="md:col-span-2 space-y-12">
                {activeProject.challenge && (
                    <motion.div variants={STAGGER_ITEM}>
                        <h3 className="text-2xl font-serif text-zinc-900 mb-4">Thách thức</h3>
                        <p className="text-zinc-600 leading-relaxed">{activeProject.challenge}</p>
                    </motion.div>
                )}
                
                {activeProject.solution && (
                    <motion.div variants={STAGGER_ITEM}>
                        <h3 className="text-2xl font-serif text-zinc-900 mb-4">Giải pháp</h3>
                        <p className="text-zinc-600 leading-relaxed">{activeProject.solution}</p>
                    </motion.div>
                )}

                {activeProject.results && (
                    <motion.div variants={STAGGER_ITEM}>
                        <h3 className="text-2xl font-serif text-zinc-900 mb-4">Kết quả</h3>
                        <ul className="space-y-3">
                            {activeProject.results.map((result, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-zinc-400 mr-3 mt-1">•</span>
                                    <span className="text-zinc-600 font-medium leading-relaxed">{result}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
