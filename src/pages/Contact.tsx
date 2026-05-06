import React from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { Mail, Facebook, MessageCircle, Phone } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:py-32 bg-zinc-900 text-white px-6 md:px-12 min-h-screen flex flex-col justify-center"
    >
      <SEO 
        title="Liên hệ" 
        description="Kết nối với Nguyễn Trọng Hữu để hợp tác, thảo luận về Marketing và xây dựng thương hiệu." 
      />

      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={STAGGER}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
        >
          <div className="max-w-md">
            <motion.h2 
              variants={STAGGER_ITEM}
              className="text-4xl md:text-5xl font-serif leading-tight mb-8"
            >
              Bắt đầu thảo luận về dự án của bạn.
            </motion.h2>
            <motion.a 
              variants={STAGGER_ITEM}
              href="mailto:unicon9091@gmail.com"
              className="inline-flex items-center space-x-2 text-lg border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              <Mail size={20} />
              <span>unicon9091@gmail.com</span>
            </motion.a>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end">
            <motion.div variants={STAGGER_ITEM} className="flex">
              <div className="flex flex-col space-y-4 md:space-y-2">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Mạng xã hội & Khác</span>
                <div className="flex flex-col md:flex-row gap-6 md:gap-6 mt-2">
                  <a href="https://www.facebook.com/nguyen.trong.huu.838820/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 text-white transition-colors flex items-center space-x-2">
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </a>
                  <a href="https://zalo.me/0906291941" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 text-white transition-colors flex items-center space-x-2">
                    <MessageCircle size={18} />
                    <span>Zalo: 0906291941</span>
                  </a>
                  <a href="tel:0906291941" className="hover:text-zinc-400 text-white transition-colors flex items-center space-x-2">
                    <Phone size={18} />
                    <span>0906291941</span>
                  </a>
                </div>
              </div>
            </motion.div>
            
            <motion.p variants={STAGGER_ITEM} className="text-zinc-500 text-sm mt-16 md:mt-24">
              &copy; {new Date().getFullYear()} Trọng Hữu. Mọi quyền được bảo lưu.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
