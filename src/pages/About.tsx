import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FADE_UP, STAGGER, STAGGER_ITEM } from '../data';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const EXPERIENCES = [
  {
    period: "2024 - Hiện tại",
    role: "Founder & Tech Consultant",
    company: "Freelance / Dự án cá nhân",
    description: "Tự xây dựng và vận hành các dự án công nghệ từ A-Z: thiết kế kiến trúc hệ thống, phát triển Web & Mobile App, triển khai AI Agent và tự động hóa quy trình (n8n, Make) cho các doanh nghiệp SMEs, nhà hàng, khách sạn và startup."
  },
  {
    period: "2021 - 2024",
    role: "Digital Marketing & Growth Specialist",
    company: "Đa dự án — E-commerce & F&B",
    description: "Quản lý chiến dịch Performance Marketing đa nền tảng (Facebook, Google, TikTok), tối ưu phễu chuyển đổi và xây dựng hệ thống Marketing Automation. Đạt ROI trung bình 300% cho các khách hàng trong lĩnh vực thương mại điện tử và F&B."
  },
  {
    period: "2019 - 2021",
    role: "Content Strategist & SEO Executive",
    company: "Agency & In-house",
    description: "Khởi đầu hành trình với việc xây dựng chiến lược nội dung, phân tích dữ liệu hành vi người dùng và tối ưu hóa công cụ tìm kiếm (SEO). Nền tảng này giúp hình thành tư duy data-driven cho mọi quyết định sau này."
  }
];

const EXPERTISE_AREAS = [
  {
    category: "Công nghệ & Kỹ thuật",
    items: [
      "Triển khai Hệ thống AI Automation",
      "Xây dựng Web & Mobile App",
      "Thiết kế Kiến trúc Hệ thống",
      "Tư vấn Công nghệ & Chuyển đổi số"
    ]
  },
  {
    category: "Marketing & Tăng trưởng",
    items: [
      "Performance Marketing (Đa nền tảng)",
      "Search Engine Optimization (SEO & ASO)",
      "Conversion Rate Optimization (CRO)"
    ]
  },
  {
    category: "Dữ liệu & Chiến lược",
    items: [
      "Data Analytics & Tracking (GA4, Mixpanel)",
      "Marketing Automation & CRM",
      "UI/UX Strategy & User Journey Mapping"
    ]
  }
];

const WORKING_PROCESS = [
  {
    step: "01",
    title: "Khảo sát nhu cầu",
    description: "Lắng nghe mục tiêu, khó khăn của doanh nghiệp và thu thập dữ liệu đầu vào cần thiết để có bức tranh tổng thể."
  },
  {
    step: "02",
    title: "Phân tích & Tư vấn",
    description: "Lên chiến lược, thiết kế luồng (User Journey) và tư vấn giải pháp/kiến trúc phù hợp nhất với bài toán."
  },
  {
    step: "03",
    title: "Triển khai & Tối ưu",
    description: "Thực thi kế hoạch chi tiết, liên tục đo lường và tinh chỉnh dựa trên dữ liệu hiệu suất thực tế."
  },
  {
    step: "04",
    title: "Bàn giao & Đào tạo",
    description: "Bàn giao hệ thống, báo cáo và đào tạo đội ngũ nội bộ để doanh nghiệp tự tin làm chủ nền tảng/quy trình."
  }
];

const TECH_STACK = [
  {
    category: "Phát triển Web & Ứng dụng",
    technologies: ["React", "Next.js", "Vite", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "PostgreSQL"]
  },
  {
    category: "AI & Tự động hoá",
    technologies: ["n8n", "Make", "OpenAI", "Claude", "Gemini", "LangChain", "Dify", "Flowise"]
  },
  {
    category: "Marketing & Dữ liệu",
    technologies: ["Google Analytics 4", "GTM", "Facebook Pixel", "Mixpanel", "ActiveCampaign", "HubSpot"]
  }
];

const TESTIMONIALS = [
  {
    content: "Hữu đã giúp chúng tôi xây dựng hệ thống AI tự động hóa chăm sóc khách hàng, giảm 40% chi phí vận hành chỉ trong 2 tháng triển khai.",
    author: "Trần Anh Quân",
    role: "CEO, TechViet Startup",
  },
  {
    content: "Sự thấu hiểu sâu sắc về cả kỹ thuật và tư duy kinh doanh giúp các giải pháp của Hữu luôn bám sát mục tiêu tăng trưởng của doanh nghiệp.",
    author: "Nguyễn Lan Anh",
    role: "CMO, E-com Group",
  },
  {
    content: "Làm việc chuyên nghiệp, quy trình rõ ràng. Giao diện thiết kế không chỉ đẹp mắt mà còn tối ưu tỷ lệ chuyển đổi (CRO) rất tốt.",
    author: "Hoàng Minh",
    role: "Founder, Creative Agency",
  }
];

export default function About() {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .limit(3)
          .order('created_at', { ascending: false });
        setRecentBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

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
        url="https://nguyentronghuu.com/about"
        keywords="giới thiệu Nguyễn Trọng Hữu, kinh nghiệm công nghệ, AI Automation, tư vấn chuyển đổi số"
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Giới thiệu', url: 'https://nguyentronghuu.com/about' },
        ]}
      />

      {/* Intro Section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-100">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={FADE_UP}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <div className="w-full max-w-[350px] lg:max-w-[400px] mx-auto">
             <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 relative shadow-xl">
               <img 
                 src="https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png" 
                 alt="Nguyễn Trọng Hữu - Chuyên gia Công nghệ & AI Automation" 
                 className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
               />
               <div className="absolute bottom-6 right-6">
                 <span className="text-2xl md:text-3xl text-zinc-700/80 italic" style={{ fontFamily: "'Dancing Script', 'Pacifico', cursive" }}>Trọng Hữu</span>
               </div>
             </div>
          </div>
          <div className="w-full lg:pt-8">
            <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium uppercase tracking-widest mb-8 rounded-full border border-zinc-200">Câu chuyện & Triết lý</span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-zinc-900 leading-tight mb-8">
              "Công nghệ chỉ thực sự tỏa sáng khi nó giải quyết đúng nỗi đau của bài toán doanh nghiệp."
            </h1>
            <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-6">
              Với xuất phát điểm kết hợp giữa tư duy hệ thống và thấu hiểu trải nghiệm số, mình tin rằng bất cứ nền tảng ứng dụng hay giải pháp AI nào cũng cần được xây dựng xoay quanh người dùng.
            </p>
            <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
              Mình tập trung vào việc tư vấn và kiến trúc phần mềm, phát triển các giải pháp Web, Mobile App chất lượng cao cùng các công cụ tự động hóa, trí tuệ nhân tạo (AI Automation) - biến những ý tưởng phức tạp thành những quy trình triển khai đơn giản, mang lại hiệu quả thực tế cho khách hàng.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-zinc-50 border-b border-zinc-100">
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
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Chặng đường</h2>
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Kinh nghiệm làm việc</h3>
            </div>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="lg:col-span-8 space-y-12 md:space-y-16"
          >
            {EXPERIENCES.map((exp, idx) => (
              <motion.div key={idx} variants={STAGGER_ITEM} className="relative pl-8 md:pl-10">
                <div className="absolute left-0 top-2 w-3 h-3 bg-zinc-200 rounded-full"></div>
                <div className="absolute left-[5px] top-5 w-[1px] h-full bg-zinc-100 last:hidden"></div>
                
                <span className="text-sm font-medium text-zinc-400 block mb-2">{exp.period}</span>
                <h4 className="text-xl md:text-2xl font-serif text-zinc-900 mb-2">{exp.role}</h4>
                <p className="text-sm md:text-base font-medium text-zinc-800 mb-4">{exp.company}</p>
                <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Working Process Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Cách thức làm việc</h2>
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Quy trình triển khai</h3>
            </div>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-16 relative"
          >
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-zinc-200"></div>

            {WORKING_PROCESS.map((process, idx) => (
              <motion.div key={idx} variants={STAGGER_ITEM} className="relative z-10 flex flex-col items-start md:items-center md:text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-lg font-serif font-semibold text-zinc-900">{process.step}</span>
                </div>
                <h4 className="text-xl md:text-2xl font-serif text-zinc-900 mb-3">{process.title}</h4>
                <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Tech Stack Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Công cụ</h2>
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Công nghệ sử dụng</h3>
            </div>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {TECH_STACK.map((group, idx) => (
              <motion.div key={idx} variants={STAGGER_ITEM}>
                <h4 className="text-xl md:text-2xl font-serif text-zinc-900 mb-6">{group.category}</h4>
                <div className="flex flex-wrap gap-3">
                  {group.technologies.map((tech, techIdx) => (
                    <span 
                      key={techIdx} 
                      className="px-4 py-2 bg-white text-zinc-800 text-sm font-medium rounded-full border border-zinc-200 hover:border-zinc-400 transition-colors shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Năng lực cốt lõi</h2>
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Chuyên môn & Giải pháp</h3>
            </div>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16"
          >
            {EXPERTISE_AREAS.map((group, idx) => (
              <motion.div 
                key={idx} 
                variants={STAGGER_ITEM} 
                className="group relative pt-8"
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors duration-500"></div>
                
                <div className="flex flex-col h-full">
                  <div className="flex items-baseline space-x-4 mb-8">
                    <span className="text-3xl md:text-4xl font-serif text-zinc-300 group-hover:text-zinc-900 transition-colors duration-500">
                      0{idx + 1}.
                    </span>
                    <h4 className="text-xl md:text-2xl font-serif text-zinc-900">{group.category}</h4>
                  </div>
                  
                  <ul className="space-y-4">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-zinc-600 group-hover:text-zinc-900 transition-colors duration-300 text-sm md:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-amber-500 mt-2 mr-4 flex-shrink-0 transition-colors duration-300"></span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Khách hàng nói gì</h2>
              <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Đánh giá từ đối tác</h3>
            </div>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={STAGGER}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={idx} 
                variants={STAGGER_ITEM} 
                className="bg-white p-8 rounded-xl shadow-sm border border-zinc-100"
              >
                <div className="flex text-amber-500 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-700 italic leading-relaxed mb-6 text-sm md:text-base">"{t.content}"</p>
                <div>
                  <h4 className="text-lg font-serif text-zinc-900">{t.author}</h4>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 border-t border-zinc-100 text-center flex flex-col items-center px-6 md:px-0"
          >
            <h3 className="text-2xl md:text-4xl font-serif text-zinc-900 mb-6">Sẵn sàng nâng tầm hệ thống của bạn?</h3>
            <p className="text-sm md:text-base text-zinc-600 mb-8 max-w-xl mx-auto leading-relaxed">
               Dù bạn cần một chiến lược Digital Marketing toàn diện hay muốn xây dựng hệ thống AI tự động hóa, mình luôn sẵn sàng lắng nghe và đồng hành.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center space-x-3 bg-zinc-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-zinc-800 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span>Kết nối ngay</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Recent Blogs Section */}
      {recentBlogs.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              variants={FADE_UP}
              className="lg:col-span-4"
            >
              <div className="lg:sticky lg:top-32">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Bài viết & Chia sẻ</h2>
                <h3 className="text-2xl md:text-4xl font-serif text-zinc-900">Góc nhìn chuyên môn</h3>
              </div>
            </motion.div>
            
            <div className="lg:col-span-8">
              <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 md:mx-0 md:px-0">
                {recentBlogs.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col space-y-4 w-[300px] sm:w-[320px] md:w-auto flex-shrink-0 snap-center"
                  >
                    <div className="w-full aspect-[16/10] overflow-hidden rounded-sm bg-zinc-100">
                      <img 
                        src={post.cover_image || 'https://via.placeholder.com/600x400'} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{post.category}</span>
                      <h4 className="text-lg font-serif text-zinc-900 mt-1 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {post.excerpt || post.seo_description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 text-left md:text-center lg:text-left">
                <Link 
                  to="/blog"
                  className="inline-flex items-center space-x-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Xem tất cả bài viết</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
