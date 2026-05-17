import React from 'react';
import { motion } from 'motion/react';
import { Download, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function MetaAds() {
  const features = [
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
      className="min-h-screen bg-zinc-50 pt-32 pb-24"
    >
      <SEO 
        title="Meta Ads Analyzer - AI Workflow Skill"
        description="Bộ skill Meta Ads Analyzer giúp AI làm việc như một trợ lý media buyer."
        url="https://nguyentronghuu.com/meta_ads"
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-10 md:p-16 text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border border-white/20">
                Premium AI Skill
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-white">
                Meta Ads Analyzer
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-light leading-relaxed">
                Biến ChatGPT thành một trợ lý Media Buyer thực thụ. Hơn 40 file <code className="bg-black/20 px-1.5 py-0.5 rounded text-sm">.md</code> được đóng gói hoàn chỉnh, kéo vào là dùng được ngay.
              </p>
            </motion.div>
          </div>

          <div className="p-8 md:p-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none text-zinc-600 mb-12"
            >
              <div className="text-xl text-zinc-800 font-medium mb-10 leading-relaxed border-l-4 border-blue-500 pl-6">
                Mình vừa đóng gói xong bộ skill <strong className="text-blue-700">Meta Ads Analyzer</strong>. Không còn dùng ChatGPT kiểu hỏi đáp rời rạc nữa, mình đã biến nó thành một workflow Meta Ads có hệ thống.
              </div>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 mb-10">
                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <CheckCircle2 size={18} />
                  </span>
                  Bộ skill này giúp AI làm việc như một Media Buyer:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ArrowRight size={14} className="text-blue-600" />
                      </div>
                      <span className="text-zinc-700 font-medium text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl text-center italic font-medium">
                Ai muốn nhận bộ skill này thì comment bên dưới hoặc click tải ngay nhé!
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a 
                href="#download" 
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Download size={20} />
                <span>Tải Skill Meta Ads Analyzer</span>
              </a>
              <a 
                href="#join-group" 
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 shadow-blue-600/30"
              >
                <Users size={20} />
                <span>Tham gia nhóm tài nguyên AI</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
