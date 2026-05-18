import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft, Share2, Loader2, Code2, Bot, Cpu, LineChart } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, any> = {
  Code2,
  Bot,
  Cpu,
  LineChart
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareText, setShareText] = useState("Chia sẻ dịch vụ");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        navigate('/services');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchService();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Đã chép link!");
    setTimeout(() => setShareText("Chia sẻ dịch vụ"), 2000);
  };

  const IconComponent = iconMap[service.icon_name] || Cpu;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-28 pb-20 md:pt-40 md:pb-32 px-5 md:px-12 lg:px-8 max-w-5xl mx-auto min-h-screen"
    >
      <SEO 
        title={service.seo_title || service.title} 
        description={service.seo_description || `Chi tiết dịch vụ: ${service.title}`}
        type="article"
        image={service.cover_image}
        url={window.location.href}
      />

      <Link 
        to="/services"
        className="inline-flex items-center space-x-2 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all mb-8 md:mb-16"
      >
        <ArrowLeft size={16} />
        <span>Trở lại Dịch vụ</span>
      </Link>

      <motion.div
        variants={STAGGER}
        initial="initial"
        animate="whileInView"
      >
        <motion.div variants={STAGGER_ITEM} className="mb-10 md:mb-12 text-center md:text-left flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-amber-600" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-4 md:mb-6 leading-tight">
              {service.title}
            </h1>
            {service.description && (
               <p className="text-base md:text-xl text-zinc-600 leading-relaxed max-w-3xl">
                 {service.description}
               </p>
            )}
          </div>
        </motion.div>

        {service.cover_image && (
          <motion.div variants={STAGGER_ITEM} className="w-full mb-12 md:mb-24 rounded-sm overflow-hidden bg-zinc-50">
              <img src={service.cover_image} alt={service.title} width="1200" height="675" className="w-full h-auto max-h-[60vh] object-cover" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
            <div className="lg:col-span-8 space-y-10 md:space-y-16">
                <motion.div variants={STAGGER_ITEM} className="prose md:prose-lg prose-zinc max-w-none text-base md:text-lg text-zinc-700 leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-a:text-amber-600">
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: service.content.replace(/font-family:[^;"]*;?/gi, '').replace(/line-height:[^;"]*;?/gi, '').replace(/font-size:[^;"]*;?/gi, '').replace(/background-color:[^;"]*;?/gi, '') }} />
                  ) : (
                    <p className="italic text-zinc-500">Đang cập nhật chi tiết dịch vụ...</p>
                  )}
                </motion.div>
            </div>
            
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
                <div className="bg-zinc-50 p-6 sm:p-8 rounded-sm border border-zinc-100">
                  <h4 className="font-serif text-xl md:text-2xl text-zinc-900 mb-3 md:mb-4">Cần tư vấn giải pháp này?</h4>
                  <p className="text-sm md:text-base text-zinc-600 mb-6 md:mb-8 leading-relaxed">Để lại thông tin, mình sẽ liên hệ và trao đổi chi tiết về yêu cầu của bạn.</p>
                  <Link to="/contact" className="flex items-center justify-center w-full py-3.5 bg-zinc-900 text-white rounded-sm font-bold active:scale-95 md:hover:bg-amber-500 md:hover:text-zinc-950 transition-all shadow-xl shadow-black/10">
                    Liên hệ tư vấn
                  </Link>
                </div>
            </div>
        </div>

        <motion.div variants={STAGGER_ITEM} className="mt-12 md:mt-16 pt-8 border-t border-zinc-200">
           <button 
             onClick={handleShare}
             className="flex items-center space-x-2 px-5 py-3 md:px-4 md:py-2 rounded-sm md:rounded-full border border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 transition-all w-full md:w-auto justify-center"
           >
             <Share2 size={18} />
             <span className="font-bold">{shareText}</span>
           </button>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
