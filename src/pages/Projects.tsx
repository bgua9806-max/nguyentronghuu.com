import React from 'react';
import { motion } from 'motion/react';
import { FADE_UP, PROJECTS_DATA } from '../data';
import { Link } from 'react-router-dom';

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen"
    >
      <motion.div
        initial="initial"
        whileInView="whileInView"
        variants={FADE_UP}
        className="mb-24"
      >
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Tuyển tập Dự Án</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24">
        {PROJECTS_DATA.map((project, idx) => (
          <motion.div 
            key={idx}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: (idx % 2) * 0.2 } }
            }}
            className="group block"
          >
            <div className="relative overflow-hidden mb-6 bg-zinc-100 aspect-[4/3] rounded-sm">
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium text-zinc-900 mb-2">{project.title}</h3>
                <p className="text-sm text-zinc-500">{project.category}</p>
              </div>
              <span className="text-xs font-medium text-zinc-400">{project.year}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
