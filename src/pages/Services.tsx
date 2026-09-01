import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Code2, Bot, LineChart, Cpu, Loader2, FileSpreadsheet, Sparkles, MessageSquareText, Share2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { optimizeImageUrl } from '../lib/imageUtils';
import { FADE_UP, STAGGER, STAGGER_ITEM } from '../data';

const iconMap: Record<string, any> = {
  Code2,
  Bot,
  Cpu,
  LineChart,
  FileSpreadsheet,
  Sparkles,
  MessageSquareText,
  Share2,
  Zap
};

const SERVICES = [
  {
    id: "chatgpt-ads-agent-automation",
    icon: <Zap className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Tự Động Hóa Ads với AI Agent Trong ChatGPT",
    description: "Xây dựng hệ thống AI Agent kết nối trực tiếp tài khoản Ads với ChatGPT. Tự động đọc bài đăng mới trên Fanpage, nhận diện từ khóa đưa vào Campaign theo rule, kéo chỉ số realtime và hỏi đáp điều khiển chiến dịch 100% bằng ngôn ngữ tự nhiên.",
    features: [
      "Tự động đọc bài viết mới trên Page, nhận diện từ khóa & đưa vào Campaign theo quy tắc",
      "Hỏi đáp & điều khiển Ads trực tiếp qua ChatGPT: 'Hôm nay ads thế nào?', 'Nhóm nào nên scale?'",
      "Kéo trực tiếp chỉ số realtime CTR, CPM, CPC, Lead, ROAS & phát hiện nhóm lãng phí ngân sách",
      "Đề xuất creative, target, tự động ngắt camp lỗi & báo cáo định kỳ về Telegram / ChatGPT"
    ]
  },
  {
    id: "multi-channel-auto-posting",
    icon: <Share2 className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Setup Hệ thống Tự Động Đăng Bài Đa Kênh",
    description: "Xây dựng hệ thống tự động hóa phân phối nội dung đa nền tảng (Facebook, TikTok, YouTube Shorts, Reels, Threads, Zalo, LinkedIn). Quản lý tập trung từ Sheets/Notion, AI tối ưu định dạng và đăng tải 24/7.",
    features: [
      "Tạo 1 lần - AI tự động phân phối lên Facebook, TikTok, YouTube Shorts, Reels, Threads, Zalo",
      "Quản lý nội dung tập trung trên Google Sheets, Notion hoặc Web Dashboard",
      "AI GPT-4o / Gemini tự động viết lại caption, hashtag theo chuẩn từng kênh",
      "Lên lịch đăng bài thông minh theo khung giờ vàng, cơ chế Anti-ban an toàn"
    ]
  },
  {
    id: "zalo-ai-data-sync",
    icon: <MessageSquareText className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App",
    description: "Tự động lắng nghe đa nhóm Zalo cá nhân, dùng AI phân tích bóc tách các trường dữ liệu (SĐT, giá, vị trí, nhu cầu) điền thẳng vào Google Sheets và phát triển Web App tra cứu nhanh trong 1 giây.",
    features: [
      "Tự động quét tin nhắn 24/7 từ hàng chục nhóm Zalo cá nhân / hội nhóm",
      "AI GPT-4o / Gemini bóc tách chính xác SĐT, giá tiền, địa điểm, nhu cầu",
      "Tự động điền & đồng bộ dữ liệu vào Google Sheets theo thời gian thực",
      "Xây dựng Web App tra cứu chuyên nghiệp, lọc thông minh & gọi điện 1 chạm"
    ]
  },
  {
    id: "ai-ads-automation",
    icon: <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Chạy Ads với AI & Tự động hóa Chiến dịch",
    description: "Lên chiến dịch Ads bằng câu lệnh kết hợp bộ AI Skill chuyên sâu, tối ưu tệp Dataset & Lookalike AI, tự động giám sát sức khỏe chiến dịch và báo cáo định kỳ qua ChatGPT/Telegram.",
    features: [
      "Lên chiến dịch & viết hàng loạt biến thể Ad Copy bằng câu lệnh Prompt",
      "Tối ưu tệp First-party Data, nuôi Pixel & Lookalike AI siêu chuẩn xác",
      "Hệ thống AI Agent tự động giám sát CPA/ROAS & ngắt camp lỗi 24/7",
      "Tự động phân tích & báo cáo hiệu quả định kỳ qua ChatGPT API / Telegram"
    ]
  },
  {
    id: "google-sheets-automation",
    icon: <FileSpreadsheet className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={1.5} />,
    title: "Tự động hóa Google Sheets & Apps Script",
    description: "Xây dựng hệ thống tự động hóa quản lý, Mini CRM, đồng bộ Lead Marketing đa kênh và báo cáo tự động trên Google Sheets. Tiết kiệm 90% thời gian nhập liệu thủ công với chi phí tối ưu nhất cho SMEs.",
    features: [
      "Tự động gom & chia Lead từ Ads (Facebook, TikTok, Web) theo realtime",
      "Tự động xuất báo giá, hợp đồng PDF & gửi Email qua Gmail",
      "Cảnh báo & báo cáo doanh thu, KPI tự động vào Telegram/Zalo",
      "Xây dựng Mini CRM / ERP quản lý bán hàng, kho & tiến độ dự án"
    ]
  },
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
        title="Dịch vụ Web, App & AI Automation"
        description="Dịch vụ phát triển Web, Mobile App, AI Automation, kiến trúc hệ thống và tư vấn chuyển đổi số theo nhu cầu doanh nghiệp."
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
          <motion.p variants={STAGGER_ITEM} className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-6">
            Giải pháp & Dịch vụ
          </motion.p>
          <motion.h1
            variants={STAGGER_ITEM} 
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-8"
          >
            Giải quyết bài toán <br className="hidden md:block"/>
            bằng <span className="italic text-zinc-500">công nghệ.</span>
          </motion.h1>
          <motion.p variants={STAGGER_ITEM} className="text-base md:text-lg text-zinc-600 max-w-2xl leading-relaxed">
            Mình không chỉ cung cấp dịch vụ, mà mang đến các giải pháp tổng thể được thiết kế riêng biệt để giải quyết trọn vẹn nỗi đau của doanh nghiệp bạn.
          </motion.p>
        </motion.div>
      </section>

      {/* Services List Section */}
      <section className="py-16 md:py-24 px-5 md:px-12 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
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
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-xl hover:shadow-zinc-900/5 sm:p-7"
                >
                {service.cover_image ? (
                  <div className="relative mb-7 aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
                    <img src={optimizeImageUrl(service.cover_image, 600)} alt={service.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 md:grayscale md:group-hover:grayscale-0" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 shadow-sm backdrop-blur-sm">
                      Giải pháp {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="mb-7 flex items-start justify-between">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 transition-all duration-500 ease-out group-hover:scale-105 group-hover:bg-amber-100 group-hover:ring-amber-200 md:h-16 md:w-16">
                      <IconComponent className="h-7 w-7 text-zinc-900 md:h-8 md:w-8" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-xs text-zinc-400">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                )}
                <h3 className="mb-3 font-serif text-2xl leading-tight text-zinc-900 transition-colors group-hover:text-amber-700 md:text-3xl">
                  {service.title}
                </h3>
                <p className="mb-7 text-sm leading-relaxed text-zinc-600 md:text-base">
                  {service.description}
                </p>
                {service.features && service.features.length > 0 && (
                  <ul className="mb-8 space-y-3 border-t border-zinc-200 pt-6">
                    {service.features.slice(0, 3).map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start text-sm text-zinc-700">
                        <CheckCircle2 className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-5 text-sm font-semibold text-zinc-900">
                  <span>Xem giải pháp</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 transition-all duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
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
