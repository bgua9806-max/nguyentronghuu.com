import React from 'react';
import { motion } from 'motion/react';
import { FADE_UP, STAGGER, STAGGER_ITEM } from '../data';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const EXPERIENCES = [
  {
    period: "2021 - Hiện tại",
    role: "Senior Digital Marketing Manager",
    company: "TechGrowth & E-com Partners",
    description: "Quản lý ngân sách quảng cáo quy mô lớn, dẫn dắt đội ngũ cross-functional để thực thi các chiến dịch Performance Marketing. Tối ưu hóa phễu chuyển đổi và phác thảo chiến lược UI/UX cho các nền tảng thương mại điện tử."
  },
  {
    period: "2018 - 2021",
    role: "Performance Marketing Lead",
    company: "Global Tech Agency",
    description: "Xây dựng chiến lược tăng trưởng toàn diện, quản lý các chiến dịch Paid Search, Paid Social và Marketing Automation mang lại tăng trưởng doanh thu vượt bậc cho các khách hàng B2B và B2C."
  },
  {
    period: "2015 - 2018",
    role: "Content & Digital Strategist",
    company: "Creative Startup",
    description: "Khởi đầu hành trình bằng việc xây dựng nền tảng nội dung mạnh mẽ, phân tích dữ liệu hành vi người dùng, bắt nhịp với các thuật toán tối ưu hóa công cụ tìm kiếm (SEO)."
  }
];

const SKILLS = [
  "Triển khai Hệ thống AI Automation",
  "Xây dựng Web & Mobile App",
  "Thiết kế Kiến trúc Hệ thống",
  "Tư vấn Công nghệ Doanh nghiệp",
  "Performance Marketing (Facebook, Google, TikTok)",
  "Search Engine Optimization (SEO & ASO)",
  "Conversion Rate Optimization (CRO)",
  "Data Analytics & Tracking (GA4, Mixpanel)",
  "Marketing Automation & CRM",
  "UI/UX Strategy & User Journey Mapping"
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen pb-32"
    >
      <SEO 
        title="Giới thiệu" 
        description="Khám phá câu chuyện, triết lý và kinh nghiệm làm việc của Nguyễn Trọng Hữu - Người xây dựng giải pháp Công nghệ & AI Automation." 
      />

      {/* Intro Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-100">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={FADE_UP}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
        >
          <div className="w-full">
             <div className="aspect-[4/3] md:aspect-[4/5] rounded-sm overflow-hidden bg-zinc-100">
               <img 
                 src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
                 alt="Workspace" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
             </div>
          </div>
          <div className="w-full lg:pt-8">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">Câu chuyện & Triết lý</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-zinc-900 leading-tight mb-8">
              "Công nghệ chỉ thực sự tỏa sáng khi nó giải quyết đúng nỗi đau của bài toán doanh nghiệp."
            </h3>
            <p className="text-lg text-zinc-600 leading-relaxed mb-6">
              Với xuất phát điểm kết hợp giữa tư duy hệ thống và thấu hiểu trải nghiệm số, mình tin rằng bất cứ nền tảng ứng dụng hay giải pháp AI nào cũng cần được xây dựng xoay quanh người dùng.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Mình tập trung vào việc tư vấn và kiến trúc phần mềm, phát triển các giải pháp Web, Mobile App chất lượng cao cùng các công cụ tự động hóa, trí tuệ nhân tạo (AI Automation) - biến những ý tưởng phức tạp thành những quy trình triển khai đơn giản, mang lại hiệu quả thực tế cho khách hàng.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-6 md:px-12 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {[
              { label: "Năm kinh nghiệm", value: "8+" },
              { label: "Dự án thành công", value: "50+" },
              { label: "ROI trung bình", value: "300%" },
              { label: "Đối tác chiến lược", value: "20+" }
            ].map((metric, idx) => (
              <motion.div key={idx} variants={STAGGER_ITEM} className="text-center flex flex-col items-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-2">{metric.value}</div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest sticky top-32">Kinh nghiệm</h2>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              variants={STAGGER}
              className="space-y-16"
            >
              {EXPERIENCES.map((exp, idx) => (
                <motion.div key={idx} variants={STAGGER_ITEM} className="relative pl-8 md:pl-0">
                  <div className="absolute left-0 md:-left-12 top-2 w-3 h-3 bg-zinc-200 rounded-full"></div>
                  <div className="absolute left-[5px] md:-left-[43px] top-5 w-[1px] h-full bg-zinc-100 last:hidden"></div>
                  
                  <span className="text-sm font-medium text-zinc-400 block mb-2">{exp.period}</span>
                  <h4 className="text-2xl font-serif text-zinc-900 mb-1">{exp.role}</h4>
                  <p className="text-lg font-medium text-zinc-800 mb-4">{exp.company}</p>
                  <p className="text-zinc-600 leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Chuyên môn</h2>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              variants={STAGGER}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {SKILLS.map((skill, idx) => (
                <motion.div key={idx} variants={STAGGER_ITEM} className="flex items-start space-x-3">
                  <CheckCircle2 size={20} className="text-zinc-900 shrink-0 mt-0.5" />
                  <span className="text-lg text-zinc-700">{skill}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 pt-16 border-t border-zinc-100"
            >
              <h3 className="text-2xl font-serif text-zinc-900 mb-6">Sẵn sàng nâng tầm thương hiệu của bạn?</h3>
              <p className="text-zinc-600 mb-8 max-w-xl">
                 Dù bạn cần một chiến lược Digital Marketing toàn diện hay muốn tối ưu hóa một điểm chạm cụ thể, mình luôn sẵn sàng lắng nghe và đồng hành.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center space-x-3 bg-zinc-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-zinc-800 hover:scale-105 transition-all duration-300"
              >
                <span>Kết nối ngay</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
