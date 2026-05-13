import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FADE_UP } from '../data';
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:py-32 bg-white px-6 md:px-12 min-h-screen"
    >
      <SEO 
        title="Bài viết" 
        description="Đọc các bài viết, phân tích, và góc nhìn về giải pháp công nghệ, AI Automation và Digital Marketing từ Nguyễn Trọng Hữu." 
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            variants={FADE_UP}
            className="max-w-2xl"
          >
            <span className="block text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">Góc nhìn & Phân tích</span>
            <h1 className="text-3xl md:text-4xl font-serif text-zinc-900 leading-tight">
              Chia sẻ những đúc kết từ thực chiến về Digital Marketing, tăng trưởng và trải nghiệm khách hàng.
            </h1>
          </motion.div>
        </div>

        <div className="border-t border-zinc-200">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center text-zinc-500">Chưa có bài viết nào được xuất bản.</div>
          ) : posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } }
              }}
            >
              <Link 
                to={`/blog/${post.slug}`}
                className="group w-full text-left flex flex-col md:flex-row md:items-center justify-between py-10 md:py-12 border-b border-zinc-200 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 lg:gap-24 w-full">
                  <div className="md:hidden w-full aspect-[21/9] bg-zinc-100 overflow-hidden rounded-sm mb-2">
                    <img src={post.cover_image || 'https://via.placeholder.com/800x400'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  
                  <span className="hidden md:block w-32 text-sm font-medium text-zinc-400 shrink-0">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  
                  <div className="hidden md:block w-32 aspect-[4/3] bg-zinc-100 shrink-0 overflow-hidden rounded-sm">
                    <img src={post.cover_image || 'https://via.placeholder.com/400x300'} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4 md:hidden">
                       <span className="text-xs font-medium text-zinc-400">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                       <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                       <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{post.category}</span>
                    </div>
                    
                    <h4 className="text-2xl md:text-3xl font-serif text-zinc-900 mb-3 group-hover:text-zinc-600 transition-colors">
                      {post.title}
                    </h4>
                    
                    <span className="hidden md:block text-xs font-medium text-zinc-500 uppercase tracking-widest">{post.category}</span>
                  </div>
                  <div className="hidden md:flex shrink-0 w-14 h-14 items-center justify-center relative overflow-hidden rounded-full border border-zinc-200 group-hover:border-zinc-900 transition-colors duration-300">
                      <span className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                      <ArrowRight size={24} className="relative z-10 text-zinc-900 group-hover:text-white transform -rotate-45 group-hover:rotate-0 transition-all duration-500 ease-out" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
