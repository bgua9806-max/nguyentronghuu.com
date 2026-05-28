import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Code2, Bot, LineChart, Cpu, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { optimizeImageUrl } from '../lib/imageUtils';
import { FADE_UP, STAGGER, STAGGER_ITEM } from '../data';

const iconMap: Record<string, any> = {
  Code2,
  Bot,
  Cpu,
  LineChart
};

const SERVICES = [
  {
    id: "web-app",
    icon: <Code2 className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Thiết kế Website & Phát triển App",
    description: "Chúng tôi thiết kế website cao cấp chuẩn SEO, xây dựng các hệ thống web app và mobile app tối ưu trải nghiệm người dùng (UI/UX) và tích hợp các giải pháp AI thông minh.",
    features: [
      "Thiết kế Website cao cấp & chuẩn SEO",
      "Phát triển Web App / SaaS Enterprise",
      "Ứng dụng Mobile đa nền tảng (iOS/Android)",
      "Website tích hợp tính năng AI thông minh"
    ]
  },
  {
    id: "ai-automation",
    icon: <Bot className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Hệ thống AI & Tự động hoá doanh nghiệp",
    description: "Thiết kế và triển khai các luồng tự động hóa công việc kết hợp AI Agents giúp doanh nghiệp tối ưu hóa chi phí vận hành, loại bỏ 80% tác vụ lặp lại và tăng tốc quy trình.",
    features: [
      "AI Chatbot tư vấn khách hàng đa kênh",
      "Workflow Automation (n8n, Make, Zapier)",
      "AI Agents tự động vận hành (Social/Sales)",
      "Trích xuất dữ liệu hóa đơn thông minh (AI OCR)"
    ]
  },
  {
    id: "system-architecture",
    icon: <Cpu className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Tư vấn & Kiến trúc Hệ thống Công nghệ",
    description: "Cung cấp giải pháp quy hoạch tổng thể công nghệ cho doanh nghiệp. Lựa chọn công nghệ phù hợp với mô hình kinh doanh để đảm bảo khả năng bảo mật, tính ổn định và scale linh hoạt.",
    features: [
      "Đánh giá & Tối ưu hóa hệ thống hiện tại (Audit)",
      "Tư vấn giải pháp kiến trúc & Tech Stack",
      "Thiết kế hạ tầng Cloud Auto-scaling & DevOps",
      "Bảo mật thông tin & Quản trị rủi ro hệ thống"
    ]
  },
  {
    id: "marketing-growth",
    icon: <LineChart className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Chiến lược Marketing & Growth Dữ liệu",
    description: "Xây dựng phễu chuyển đổi toàn diện, từ việc thu hút khách hàng tiềm năng đến chốt đơn. Tối ưu trải nghiệm chuyển đổi (CRO) và kiểm soát ngân sách dựa trên dữ liệu thực tế.",
    features: [
      "Tối ưu tỷ lệ chuyển đổi (CRO) trang đích",
      "Thiết lập đo lường Tracking GA4/GTM/Conversion API",
      "Xây dựng phễu Marketing & Lead Gen tự động",
      "Vận hành và tối ưu quảng cáo Performance Marketing"
    ]
  }
];

export default function Services() {
  const [dbServices, setDbServices] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          setDbServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayServices = dbServices.length > 0 
    ? dbServices.map(s => {
        const matchedService = SERVICES.find(item => item.id === s.slug);
        return {
          id: s.slug,
          icon: s.icon_name,
          title: s.title,
          description: s.description,
          features: matchedService ? matchedService.features : [],
          slug: s.slug,
          cover_image: s.cover_image
        };
      })
    : SERVICES.map(s => ({ ...s, slug: s.id, icon: s.id === 'web-app' ? 'Code2' : s.id === 'ai-automation' ? 'Bot' : s.id === 'system-architecture' ? 'Cpu' : 'LineChart', cover_image: null }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-50 min-h-screen pb-24"
    >
      <SEO 
        title="Dịch vụ" 
        description="Khám phá các dịch vụ & giải pháp công nghệ: Web/App Development, AI Automation, System Architecture và Growth Strategy từ Nguyễn Trọng Hữu." 
        url="https://nguyentronghuu.com/services"
        keywords="dịch vụ công nghệ, thiết kế web, lập trình app, AI Automation, n8n, tư vấn chuyển đổi số"
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Dịch vụ', url: 'https://nguyentronghuu.com/services' },
        ]}
      />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-48 md:pb-32 px-5 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial="initial"
          animate="whileInView"
          variants={STAGGER}
          className="max-w-3xl"
        >
          <motion.h1 variants={STAGGER_ITEM} className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-6">
            Giải pháp & Dịch vụ
          </motion.h1>
          <motion.h2 
            variants={STAGGER_ITEM} 
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-8"
          >
            Giải quyết bài toán <br className="hidden md:block"/>
            bằng <span className="italic text-zinc-500">công nghệ.</span>
          </motion.h2>
          <motion.p variants={STAGGER_ITEM} className="text-base md:text-lg text-zinc-600 max-w-2xl leading-relaxed">
            Mình không chỉ cung cấp dịch vụ, mà mang đến các giải pháp tổng thể được thiết kế riêng biệt để giải quyết trọn vẹn nỗi đau của doanh nghiệp bạn.
          </motion.p>
        </motion.div>
      </section>

      {/* Services List Section */}
      <section className="py-16 md:py-24 px-5 md:px-12 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : displayServices.map((service, idx) => {
              const IconComponent = iconMap[service.icon as string] || Cpu;
              return (
              <motion.div 
                key={service.id}
                initial="initial"
                whileInView="whileInView"
                variants={FADE_UP}
                viewport={{ once: true, margin: "-100px" }}
                className="h-full"
              >
                <Link to={`/services/${service.slug}`} className="group flex flex-col h-full block">
                {service.cover_image ? (
                  <div className="w-full aspect-[16/10] rounded-sm bg-zinc-100 mb-8 overflow-hidden group-hover:shadow-xl transition-all relative">
                    <img src={optimizeImageUrl(service.cover_image, 600)} alt={service.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="mb-6 md:mb-8 w-14 h-14 md:w-20 md:h-20 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-500 ease-out shrink-0">
                    <IconComponent className="w-7 h-7 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-serif text-zinc-900 mb-3 md:mb-4 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start text-sm md:text-base text-zinc-700">
                        <CheckCircle2 className="w-5 h-5 text-zinc-300 mr-3 mt-0.5 flex-shrink-0 group-hover:text-amber-500 transition-colors duration-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                </Link>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* Philosophy/Approach Section */}
      <section className="py-20 md:py-24 px-5 md:px-12 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-6">Cam kết chất lượng</h2>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-8">
              "Công nghệ chỉ thực sự có giá trị khi nó tạo ra sự tăng trưởng hoặc tiết kiệm tài nguyên cho doanh nghiệp."
            </h3>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Mọi giải pháp mình xây dựng đều tuân thủ nguyên tắc: Đơn giản trong sử dụng, Mở rộng trong kiến trúc và Đo lường được bằng hiệu quả thực tế.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-5 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 mb-6 leading-tight">
              Sẵn sàng bắt đầu dự án mới?
            </h2>
            <p className="text-base text-zinc-600 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
              Hãy chia sẻ bài toán của bạn. Chúng ta sẽ cùng nhau thảo luận và tìm ra giải pháp tối ưu nhất.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center space-x-3 bg-zinc-900 text-white px-8 py-4 w-full md:w-auto rounded-sm text-sm font-bold active:scale-95 md:hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10"
            >
              <span>Liên hệ ngay</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
