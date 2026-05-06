import React from 'react';
import { motion } from 'motion/react';
import { FADE_UP, STAGGER, STAGGER_ITEM } from '../data';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  "Performance Marketing (Facebook, Google, TikTok)",
  "Search Engine Optimization (SEO & ASO)",
  "Conversion Rate Optimization (CRO)",
  "Data Analytics & Tracking (GA4, Mixpanel, GTM)",
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
      {/* Intro Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-zinc-100">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={FADE_UP}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8"
        >
          <div className="md:col-span-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Triết lý thiết kế</h2>
          </div>
          <div className="md:col-span-8 md:pl-12">
            <h3 className="text-3xl md:text-5xl font-serif text-zinc-900 leading-tight mb-8">
              "Tiếp thị hiệu quả không ồn ào, mà là sự hiện diện đúng chỗ, đúng thời điểm."
            </h3>
            <p className="text-lg text-zinc-600 leading-relaxed mb-6">
              Với hơn 8 năm kinh nghiệm trong lĩnh vực Digital Marketing, tôi tin rằng sự phát triển bền vững đến từ việc thấu hiểu khách hàng một cách sâu sắc thay vì chỉ dựa vào những con số khô khan. 
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Tôi kết hợp sức mạnh của dữ liệu (Data-driven) với sự tinh tế trong trải nghiệm người dùng (UX) để xây dựng các chiếc lược tối ưu hóa mọi điểm chạm kỹ thuật số. Mục tiêu cuối cùng không chỉ là tăng trưởng chuyển đổi, mà còn là nâng tầm giá trị thương hiệu.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-b border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest sticky top-32">Kinh nghiệm</h2>
          </div>
          <div className="md:col-span-8 md:pl-12">
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              variants={STAGGER}
              className="space-y-16"
            >
              {EXPERIENCES.map((exp, idx) => (
                <motion.div key={idx} variants={STAGGER_ITEM} className="relative pl-8 md:pl-0">
                  <div className="hidden md:block absolute -left-12 top-2 w-3 h-3 bg-zinc-200 rounded-full"></div>
                  <div className="hidden md:block absolute -left-10.5 top-5 w-[1px] h-full bg-zinc-100 last:hidden"></div>
                  
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
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Chuyên môn</h2>
          </div>
          <div className="md:col-span-8 md:pl-12">
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
                 Dù bạn cần một chiến lược Digital Marketing toàn diện hay muốn tối ưu hóa một điểm chạm cụ thể, tôi luôn sẵn sàng lắng nghe và đồng hành.
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
