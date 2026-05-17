import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Users, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function MetaAds() {
  const [email, setEmail] = useState('');

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '') {
      alert("Vui lòng nhập email của bạn trước khi tải!");
      return;
    }
    window.open("https://drive.google.com/file/d/1Q6OCYV7iyUtL6FDdJQo7twndpJ2tYWBl/view?usp=sharing", "_blank");
  };
  const workflowSteps = [
    "Đọc số liệu",
    "Audit camp",
    "Soi ad set",
    "Phân tích creative",
    "Setup tệp",
    "Tạo lookalike",
    "Đề xuất tối ưu",
    "Kiểm tra rủi ro trước khi thao tác"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <SEO 
        title="Meta Ads Analyzer - AI Workflow Skill"
        description="Bộ skill Meta Ads Analyzer giúp AI làm việc như một trợ lý media buyer."
        url="https://nguyentronghuu.com/meta_ads"
      />

      <div className="flex flex-col min-h-screen">
        {/* Header - Simple Logo or Name */}
        <div className="py-6 px-6 md:px-12 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <Link to="/" className="text-xl font-serif font-medium text-zinc-900 tracking-tight">
            NTH<span className="text-zinc-400">.</span>
          </Link>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            AI Resources
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 md:py-24">
          <motion.div
            initial="initial"
            animate="whileInView"
            variants={{
              initial: { opacity: 0 },
              whileInView: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {/* Title Section */}
            <motion.div variants={FADE_UP} className="mb-12">
              <h2 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Premium AI Skill</h2>
              <h1 className="text-4xl md:text-6xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-6">
                Meta Ads Analyzer
              </h1>
              <p className="text-[15px] md:text-lg text-zinc-600 leading-relaxed font-light">
                Mình vừa đóng gói xong bộ skill <strong className="font-medium text-zinc-900">Meta Ads Analyzer</strong>. Hơn 40 file <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-[13px] md:text-sm text-zinc-800 font-mono">.md</code> được gom thành một skill hoàn chỉnh, kéo vào ChatGPT là dùng được ngay.
              </p>
            </motion.div>

            {/* Workflow Section */}
            <motion.div variants={FADE_UP} className="mb-12">
              <h3 className="text-xl md:text-2xl font-serif text-zinc-900 mb-6 leading-snug">
                Bộ này giúp AI làm việc như một trợ lý media buyer:
              </h3>
              
              <div className="bg-zinc-50 border border-zinc-200 p-6 md:p-8 rounded-sm">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {workflowSteps.map((step, index) => (
                    <li key={index} className="flex items-start text-zinc-700">
                      <ArrowRight size={16} className="text-zinc-400 mt-[3px] mr-3 flex-shrink-0" />
                      <span className="text-[14px] md:text-[15px] leading-relaxed font-medium text-zinc-800">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Conclusion & CTA */}
            <motion.div variants={FADE_UP} className="mb-12">
              <p className="text-[14px] md:text-[15px] text-zinc-600 leading-relaxed mb-4">
                Không còn dùng ChatGPT kiểu hỏi đáp rời rạc nữa.<br/>
                Mình biến nó thành một workflow Meta Ads có hệ thống.
              </p>
              <p className="text-[14px] md:text-[15px] text-zinc-900 font-medium italic border-l-2 border-zinc-900 pl-4 py-1">
                Ai muốn nhận bộ skill này thì comment bên dưới nhé.
              </p>
            </motion.div>

            {/* Download Form & Buttons */}
            <motion.div variants={FADE_UP} className="flex flex-col gap-6">
              <form onSubmit={handleDownload} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập địa chỉ email của bạn..." 
                    className="flex-1 px-4 py-4 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 text-zinc-900 focus:outline-none rounded-sm text-sm transition-colors"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-zinc-900 text-white px-8 py-4 rounded-sm text-sm font-medium transition-colors hover:bg-zinc-800"
                  >
                    <Download size={18} />
                    <span>Tải Skill Meta Ads Analyzer</span>
                  </button>
                </div>
              </form>
              
              <a 
                href="https://zalo.me/g/bguamkuy0hcgjpvf9kyp" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 border border-zinc-200 text-zinc-900 px-8 py-4 rounded-sm text-sm font-medium transition-colors hover:border-zinc-900 hover:bg-zinc-50 bg-white"
              >
                <Users size={18} />
                <span>Tham gia nhóm tài nguyên AI (Zalo)</span>
              </a>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
