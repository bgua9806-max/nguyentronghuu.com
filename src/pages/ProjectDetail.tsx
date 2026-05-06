import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS_DATA, FADE_UP, STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function ProjectDetail() {
  const { id } = useParams();
  const activeProject = PROJECTS_DATA.find(p => p.id === Number(id));
  const [shareText, setShareText] = useState("Chia sẻ dự án");

  if (!activeProject) {
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-zinc-900 mb-6 md:mb-8 leading-tight">
            {activeProject.title}
          </h1>
          {activeProject.description && (
             <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
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

            <div className="lg:col-span-8 space-y-12 md:space-y-16">
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
    </motion.article>
  );
}
