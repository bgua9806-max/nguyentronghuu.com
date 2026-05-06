import React from 'react';
import { motion } from 'motion/react';
import { FADE_UP, PROJECTS_DATA } from '../data';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Projects() {
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
      />

      <motion.div
        initial="initial"
        whileInView="whileInView"
        variants={FADE_UP}
        className="mb-16 md:mb-24"
      >
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Tuyển tập Dự Án</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16 md:gap-y-24">
        {PROJECTS_DATA.map((project, idx) => (
          <motion.div 
            key={project.id || idx}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: (idx % 2) * 0.2 } }
            }}
          >
            <Link to={`/projects/${project.id || idx}`} className="group block">
              <div className="relative overflow-hidden mb-6 bg-zinc-100 aspect-[4/3] rounded-sm">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium text-zinc-900 mb-2 group-hover:text-zinc-600 transition-colors">{project.title}</h3>
                  <p className="text-sm text-zinc-500">{project.category}</p>
                </div>
                <span className="text-xs font-medium text-zinc-400">{project.year}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
