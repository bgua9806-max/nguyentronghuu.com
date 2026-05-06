import React from 'react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '../data';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { id } = useParams();
  const activePost = BLOG_POSTS.find(post => post.id === Number(id));

  if (!activePost) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-3xl mx-auto min-h-screen"
    >
      <SEO 
        title={activePost.title} 
        description={activePost.excerpt || `Đọc bài viết về ${activePost.title} trên blog của Nguyễn Trọng Hữu`}
        type="article"
        image={activePost.img}
      />

      <Link 
        to="/blog"
        className="inline-flex items-center space-x-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft size={16} />
        <span>Trở lại Bài viết</span>
      </Link>

      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-6 text-sm font-medium text-zinc-500">
          <span className="uppercase tracking-widest">{activePost.category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span>{activePost.date}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 leading-tight mb-12">
          {activePost.title}
        </h1>
        <div className="w-full aspect-[21/9] md:aspect-[16/9] overflow-hidden bg-zinc-100 rounded-sm">
          <img src={activePost.img} alt={activePost.title} className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="text-zinc-700 leading-relaxed text-lg md:text-xl font-serif">
        {activePost.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-8">{paragraph}</p>
        ))}
      </div>
    </motion.article>
  );
}
