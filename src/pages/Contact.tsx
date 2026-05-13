import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { Mail, Facebook, MessageCircle, Phone, ArrowRight, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import logoUrl from '../assets/images/logo3.png';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Lưu thông tin vào Database (CRM)
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          status: 'new'
        }]);

      if (dbError) {
        console.error('Supabase Error:', dbError);
        throw new Error('Không thể lưu thông tin vào hệ thống.');
      }

      // 2. Gửi Email thông báo (SMTP)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Gửi email thất bại');
      }

      toast.success('Gửi tin nhắn thành công! Vui lòng kiểm tra hộp thư email của bạn.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
        description="Kết nối với Nguyễn Trọng Hữu để hợp tác, thảo luận về giải pháp phần mềm, Web, App và AI Automation cho doanh nghiệp." 
        url="https://nguyentronghuu.com/contact"
        keywords="liên hệ Nguyễn Trọng Hữu, hợp tác, tư vấn công nghệ, giải pháp AI"
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Liên hệ', url: 'https://nguyentronghuu.com/contact' },
        ]}
      />

      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          variants={STAGGER}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
        >
          <div className="flex flex-col space-y-16">
            <div>
              <motion.h1 
                variants={STAGGER_ITEM}
                className="text-4xl md:text-5xl font-serif leading-tight mb-8"
              >
                Bắt đầu thảo luận về dự án của bạn.
              </motion.h1>
              <motion.p variants={STAGGER_ITEM} className="text-zinc-400 mb-8 max-w-sm">
                Hãy để lại lời nhắn, hệ thống sẽ tự động phản hồi xác nhận qua email và mình sẽ liên lạc lại với bạn sớm nhất.
              </motion.p>
              <motion.a 
                variants={STAGGER_ITEM}
                href="mailto:nguyentronghuu1905@gmail.com"
                className="inline-flex items-center space-x-2 text-lg border-b border-white/30 pb-1 hover:border-white transition-colors"
              >
                <Mail size={20} />
                <span>nguyentronghuu1905@gmail.com</span>
              </motion.a>
            </div>

            <motion.div variants={STAGGER_ITEM}>
              <div className="flex flex-col space-y-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Mạng xã hội & Liên hệ nhanh</span>
                <div className="flex flex-col gap-4 mt-2">
                  <a href="https://www.facebook.com/nguyen.trong.huu.838820/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 text-zinc-400 transition-colors flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800/50"><Facebook size={18} /></div>
                    <span>Facebook Cá Nhân</span>
                  </a>
                  <a href="https://zalo.me/0906291941" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 text-zinc-400 transition-colors flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800/50"><MessageCircle size={18} /></div>
                    <span>Zalo: 0906291941</span>
                  </a>
                  <a href="tel:0906291941" className="hover:text-zinc-300 text-zinc-400 transition-colors flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800/50"><Phone size={18} /></div>
                    <span>0906291941</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={STAGGER_ITEM} className="relative">
            <h3 className="text-3xl font-serif mb-10 text-white">Gửi lời nhắn cho mình</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Họ và Tên *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-zinc-700 focus:border-white rounded-none px-0 py-2 text-white focus:outline-none transition-colors placeholder:text-zinc-700 text-lg"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-zinc-700 focus:border-white rounded-none px-0 py-2 text-white focus:outline-none transition-colors placeholder:text-zinc-700 text-lg"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Số điện thoại</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-white rounded-none px-0 py-2 text-white focus:outline-none transition-colors placeholder:text-zinc-700 text-lg"
                  placeholder="0901234567"
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Nội dung *</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-white rounded-none px-0 py-2 min-h-[120px] text-white focus:outline-none transition-colors resize-y placeholder:text-zinc-700 text-lg"
                  placeholder="Bạn muốn trao đổi về vấn đề gì?"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-medium py-4 rounded-sm flex items-center justify-center space-x-3 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-zinc-500" />
                      <span>Đang gửi tin nhắn...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm uppercase tracking-widest font-bold">Gửi tin nhắn</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
