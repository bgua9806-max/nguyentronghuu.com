import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { STAGGER, STAGGER_ITEM } from '../data';
import avatarImg from '../assets/images/regenerated_image_1778072809658.png';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial="initial"
          animate="whileInView"
          variants={STAGGER}
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16 md:gap-8"
        >
          <div className="max-w-2xl md:w-2/3">
            <motion.p variants={STAGGER_ITEM} className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">
              Nguyễn Trọng Hữu &mdash; Chuyên gia Digital Marketing
            </motion.p>
            <motion.h1 
              variants={STAGGER_ITEM} 
              className="text-5xl md:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-8"
            >
              Chiến lược tiếp thị <br className="hidden md:block"/>
              <span className="italic text-zinc-500">tinh tế</span> & có <span className="italic text-zinc-500">trọng tâm.</span>
            </motion.h1>
            <motion.p variants={STAGGER_ITEM} className="text-lg text-zinc-600 max-w-xl leading-relaxed mb-12">
              Tôi giúp các thương hiệu hàng đầu xây dựng chiến lược Digital Marketing cân bằng hoàn hảo giữa hiệu quả tăng trưởng và trải nghiệm thương hiệu cao cấp.
            </motion.p>
            <motion.div variants={STAGGER_ITEM}>
              <Link 
                to="/projects" 
                className="inline-flex items-center space-x-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
              >
                <span>Xem dự án</span>
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>
          
          <motion.div variants={STAGGER_ITEM} className="w-full max-w-[280px] md:max-w-[320px] md:w-1/3">
            <div className="aspect-[3/4] overflow-hidden bg-zinc-100 rounded-tr-[4rem] rounded-bl-[4rem]">
              <img 
                src={avatarImg} 
                alt="Nguyễn Trọng Hữu - Avatar" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8 md:py-12 border-y border-zinc-200/50 bg-white overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-flex space-x-8 md:space-x-12 items-center">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">SEO Strategy</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Performance Marketing</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Conversion Optimization</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">Data Analytics</span>
              <span className="text-zinc-300">•</span>
              <span className="text-lg md:text-2xl font-serif text-zinc-400">UI/UX Strategy</span>
              <span className="text-zinc-300">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
