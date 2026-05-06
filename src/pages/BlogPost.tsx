import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '../data';
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, Send } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { id } = useParams();
  const activePost = BLOG_POSTS.find(post => post.id === Number(id));
  
  const [likes, setLikes] = useState(12);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{name: string, text: string, date: string}[]>([
    { name: "Khách", text: "Bài viết rất hữu ích, cảm ơn bạn đã chia sẻ!", date: "Hôm qua" }
  ]);
  const [shareText, setShareText] = useState("Chia sẻ");

  if (!activePost) {
    return <Navigate to="/blog" replace />;
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Đã chép link!");
    setTimeout(() => setShareText("Chia sẻ"), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setComments([
      ...comments,
      {
        name: "Người dùng mới",
        text: commentText,
        date: "Vừa xong"
      }
    ]);
    setCommentText("");
  };

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
        description={`Đọc bài viết về ${activePost.title} trên blog của Nguyễn Trọng Hữu`}
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

      <div className="text-zinc-700 leading-relaxed text-lg md:text-xl font-serif mb-16">
        {activePost.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-8">{paragraph}</p>
        ))}
      </div>

      {/* Interactions Section */}
      <section className="border-t border-zinc-200 pt-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                isLiked 
                ? 'bg-zinc-900 text-white border-zinc-900' 
                : 'bg-transparent text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-white" : ""} />
              <span className="font-medium">{likes}</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="font-medium">{comments.length}</span>
            </button>
          </div>
          
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
          >
            <Share2 size={18} />
            <span className="font-medium">{shareText}</span>
          </button>
        </div>

        {/* Comments Area */}
        <div className="mb-10">
          <h3 className="text-2xl font-serif text-zinc-900 mb-8">Bình luận ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-10 block">
            <div className="relative">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Để lại bình luận của bạn..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 resize-y text-zinc-900 placeholder:text-zinc-400"
              />
              <div className="absolute right-3 bottom-4">
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-zinc-900 text-white p-2 rounded-sm hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-8">
            {comments.map((comment, idx) => (
              <div key={idx} className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold flex-shrink-0">
                  {comment.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-zinc-900">{comment.name}</h4>
                    <span className="text-zinc-300">•</span>
                    <span className="text-sm text-zinc-500">{comment.date}</span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.article>
  );
}
