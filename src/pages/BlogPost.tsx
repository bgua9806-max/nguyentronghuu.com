import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [shareText, setShareText] = useState("Chia sẻ");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (error) throw error;
        setPost(data);
        setLikes(data.likes || 0);

        // Lấy danh sách bình luận
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', data.id)
          .order('created_at', { ascending: false });
          
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleLike = async () => {
    if (!post) return;
    
    try {
      const newLikes = isLiked ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setIsLiked(!isLiked);

      // Lưu lên Supabase
      await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', post.id);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Đã chép link!");
    setTimeout(() => setShareText("Chia sẻ"), 2000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    
    const newComment = {
      post_id: post.id,
      parent_id: replyingTo,
      name: "Khách truy cập", // Tạm thời để tên Khách vì chưa có hệ thống Auth
      content: commentText,
      created_at: new Date().toISOString(),
      is_admin: false
    };

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select()
        .single();

      if (error) throw error;

      // Cập nhật lại UI lập tức
      if (data) {
        setComments([...comments, data]);
      }
      setCommentText("");
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
        title={post.seo_title || post.title} 
        description={post.seo_description || `Đọc bài viết về ${post.title} trên blog của Nguyễn Trọng Hữu`}
        type="article"
        image={post.cover_image}
        url={window.location.href}
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
          <span className="uppercase tracking-widest">{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 leading-tight mb-12">
          {post.title}
        </h1>
        <div className="w-full aspect-[21/9] md:aspect-[16/9] overflow-hidden bg-zinc-100 rounded-sm">
          <img src={post.cover_image || 'https://via.placeholder.com/1200x600'} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="text-zinc-700 leading-relaxed text-lg md:text-xl font-serif mb-16 prose prose-lg prose-zinc max-w-none prose-img:rounded-sm prose-img:shadow-md prose-a:text-amber-600">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="mb-8 italic text-zinc-400">Nội dung đang được cập nhật...</p>
        )}
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
          
          <form onSubmit={handleCommentSubmit} className="mb-10 block bg-zinc-50 p-6 rounded-sm border border-zinc-200">
            {replyingTo && (
              <div className="flex items-center justify-between mb-4 bg-zinc-200/50 px-3 py-2 rounded-sm text-sm">
                <span className="text-zinc-600">
                  Đang trả lời: <span className="font-medium text-zinc-900">{comments.find(c => c.id === replyingTo)?.name || 'Bình luận'}</span>
                </span>
                <button type="button" onClick={() => setReplyingTo(null)} className="text-zinc-500 hover:text-zinc-900">
                  Hủy
                </button>
              </div>
            )}
            <div className="relative">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Để lại bình luận của bạn..."
                className="w-full bg-white border border-zinc-200 rounded-sm px-4 py-4 min-h-[100px] focus:outline-none focus:border-amber-500 resize-y text-zinc-900 placeholder:text-zinc-400 transition-colors"
              />
              <div className="flex justify-end mt-4">
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-amber-500 text-zinc-950 font-bold px-6 py-2.5 rounded-sm hover:bg-amber-600 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send size={16} /> Gửi bình luận
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-8">
            {comments.filter(c => c && !c.parent_id).map((comment) => (
              <div key={comment.id} className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${comment.is_admin ? 'bg-amber-100 text-amber-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {comment.is_admin ? 'H' : (comment.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-zinc-900">{comment.name || 'Khách'}</h4>
                      {comment.is_admin && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">AUTHOR</span>}
                      <span className="text-zinc-300">•</span>
                      <span className="text-sm text-zinc-500">{comment.created_at ? new Date(comment.created_at).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed mb-2">
                      {comment.content}
                    </p>
                    <button 
                      onClick={() => { setReplyingTo(comment.id); setCommentText(''); }}
                      className="text-xs font-semibold text-zinc-500 hover:text-amber-600 transition-colors uppercase tracking-widest"
                    >
                      Trả lời
                    </button>
                  </div>
                </div>

                {/* Sub-comments (Replies) */}
                {comments.filter(reply => reply && reply.parent_id === comment.id).length > 0 && (
                  <div className="ml-14 space-y-6 mt-2 border-l-2 border-zinc-100 pl-6">
                    {comments.filter(reply => reply && reply.parent_id === comment.id).map(reply => (
                      <div key={reply.id} className="flex space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${reply.is_admin ? 'bg-amber-100 text-amber-700' : 'bg-zinc-200 text-zinc-500'}`}>
                          {reply.is_admin ? 'H' : (reply.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-zinc-900">{reply.name || 'Khách'}</h4>
                            {reply.is_admin && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">AUTHOR</span>}
                            <span className="text-zinc-300">•</span>
                            <span className="text-sm text-zinc-500">{reply.created_at ? new Date(reply.created_at).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                          </div>
                          <p className="text-zinc-700 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.article>
  );
}
