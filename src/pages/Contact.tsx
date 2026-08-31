import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { Mail, Facebook, MessageCircle, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.service || !formData.message.trim()) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    if (!hasConsent) {
      toast.error('Vui lòng đồng ý với chính sách bảo mật trước khi gửi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const messageWithContext = `[Nhu cầu: ${formData.service}]\n\n${formData.message.trim()}`;
      
      // 1. Lưu thông tin vào Database (CRM)
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: messageWithContext,
          status: 'new'
        }]);

      if (dbError) {
        console.error('Supabase Error:', dbError);
        throw new Error('Không thể lưu thông tin vào hệ thống.');
      }

      // 2. Gửi Email thông báo (SMTP)
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: messageWithContext
          })
        });

        if (!response.ok) console.warn('Email notification could not be sent, but the contact was saved.');
      } catch (emailError) {
        console.warn('Email notification failed, but the contact was saved:', emailError);
      }

      toast.success('Yêu cầu của bạn đã được ghi nhận.');
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setHasConsent(false);
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
        title="Liên hệ tư vấn giải pháp công nghệ"
        description="Liên hệ Nguyễn Trọng Hữu để tư vấn và triển khai Web, App, phần mềm quản trị hoặc AI Automation cho doanh nghiệp."
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
          className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20 lg:gap-24"
        >
          <div className="flex flex-col space-y-12 md:space-y-16">
            <div>
              <motion.h1 
                variants={STAGGER_ITEM}
                className="mb-8 font-serif text-4xl leading-tight md:text-5xl"
              >
                Bắt đầu thảo luận về dự án của bạn.
              </motion.h1>
              <motion.p variants={STAGGER_ITEM} className="text-sm md:text-base text-zinc-400 mb-8 max-w-sm leading-relaxed">
                Chia sẻ mục tiêu, quy trình hiện tại và điều bạn muốn cải thiện. Thông tin sẽ được ghi nhận để mình phân tích trước khi trao đổi.
              </motion.p>
              <motion.a 
                variants={STAGGER_ITEM}
                href="mailto:nguyentronghuu1905@gmail.com"
                className="inline-flex items-center space-x-2 text-base md:text-lg border-b border-white/30 pb-1 hover:border-white transition-colors"
              >
                <Mail size={20} />
                <span>nguyentronghuu1905@gmail.com</span>
              </motion.a>
            </div>

            <motion.dl variants={STAGGER_ITEM} className="grid grid-cols-3 divide-x divide-zinc-700 border-y border-zinc-700 py-5">
              <div className="pr-3">
                <dt className="font-mono text-xs text-amber-400">01</dt>
                <dd className="mt-2 text-xs text-zinc-400">Chia sẻ bài toán</dd>
              </div>
              <div className="px-3">
                <dt className="font-mono text-xs text-amber-400">02</dt>
                <dd className="mt-2 text-xs text-zinc-400">Phân tích nhu cầu</dd>
              </div>
              <div className="pl-3">
                <dt className="font-mono text-xs text-amber-400">03</dt>
                <dd className="mt-2 text-xs text-zinc-400">Đề xuất hướng làm</dd>
              </div>
            </motion.dl>

            <motion.div variants={STAGGER_ITEM}>
              <div className="flex flex-col space-y-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Mạng xã hội & Liên hệ nhanh</span>
                <div className="mt-2 grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                  <a href="https://www.facebook.com/nguyen.trong.huu.838820/?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/30 p-3 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800"><Facebook size={16} /></div>
                    <span>Facebook Cá Nhân</span>
                  </a>
                  <a href="https://zalo.me/0845555851" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/30 p-3 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800"><MessageCircle size={16} /></div>
                    <span>Zalo: 0845555851</span>
                  </a>
                  <a href="tel:0845555851" className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/30 p-3 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800"><Phone size={16} /></div>
                    <span>0845555851</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={STAGGER_ITEM} className="relative rounded-2xl border border-zinc-700 bg-zinc-950/40 p-5 shadow-2xl shadow-black/20 sm:p-7 md:p-8">
            {isSubmitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                  <CheckCircle2 size={32} />
                </span>
                <h3 className="mt-6 font-serif text-3xl text-white">Đã nhận yêu cầu của bạn</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">Thông tin đã được ghi nhận. Bạn cũng có thể liên hệ trực tiếp qua Zalo nếu cần bổ sung tài liệu.</p>
                <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                  <a href="https://zalo.me/0845555851" target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400">Mở Zalo</a>
                  <button type="button" onClick={() => setIsSubmitted(false)} className="min-h-12 flex-1 rounded-full border border-zinc-600 px-5 text-sm font-semibold text-white transition-colors hover:border-white">Gửi yêu cầu khác</button>
                </div>
              </div>
            ) : (
            <>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Thông tin dự án</p>
              <h3 className="mt-3 font-serif text-2xl text-white md:text-3xl">Gửi lời nhắn cho mình</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">Các trường có dấu * là bắt buộc.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2 group">
                  <label htmlFor="contact-name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Họ và Tên *</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="contact-email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Email *</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label htmlFor="contact-phone" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Số điện thoại</label>
                <input 
                  id="contact-phone"
                  type="tel" 
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                  placeholder="0901234567"
                />
              </div>
              <div className="space-y-2 group">
                <label htmlFor="contact-service" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Nhu cầu cần tư vấn *</label>
                <select
                  id="contact-service"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-sm text-white transition-colors focus:border-amber-400 focus:outline-none"
                >
                  <option value="" disabled>Chọn nhu cầu của bạn</option>
                  <option value="Website / Landing Page">Website / Landing Page</option>
                  <option value="Web App / Mobile App">Web App / Mobile App</option>
                  <option value="AI Automation">AI Automation</option>
                  <option value="Google Sheets / Apps Script">Google Sheets / Apps Script</option>
                  <option value="Kiến trúc hệ thống / Tư vấn công nghệ">Kiến trúc hệ thống / Tư vấn công nghệ</option>
                  <option value="Marketing / Ads">Marketing / Ads</option>
                  <option value="Nhu cầu khác">Nhu cầu khác</option>
                </select>
              </div>
              <div className="space-y-2 group">
                <label htmlFor="contact-message" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Nội dung *</label>
                <textarea 
                  id="contact-message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="min-h-[130px] w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                  placeholder="Mô tả mục tiêu, quy trình hiện tại và kết quả bạn mong muốn..."
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-400">
                <input type="checkbox" checked={hasConsent} onChange={(e) => setHasConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-amber-500" />
                <span>Tôi đồng ý để thông tin được xử lý nhằm phản hồi yêu cầu này theo <Link to="/privacy" className="font-semibold text-zinc-200 underline decoration-zinc-600 underline-offset-2 hover:text-white">Chính sách bảo mật</Link>.</span>
              </label>
              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-medium text-zinc-950 transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
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
            </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
