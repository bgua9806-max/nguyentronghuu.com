import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const cleanPostHtml = (value = '') => value
  .replace(/\\n/g, '\n')
  .replace(/font-family:[^;"]*;?/gi, '')
  .replace(/line-height:[^;"]*;?/gi, '')
  .replace(/font-size:[^;"]*;?/gi, '')
  .replace(/<table([\s\S]*?)<\/table>/gi, (match) => {
    return `<div class="table-responsive-container">${match}</div>`;
  });

const headingSlug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()
  .replace(/<[^>]+>/g, ' ')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const preparePostContent = (value = '') => {
  const toc: { id: string; label: string; level: number }[] = [];
  const usedIds = new Map<string, number>();
  const html = cleanPostHtml(value).replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level, attributes, innerHtml) => {
    const label = String(innerHtml).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!label) return _match;
    const baseId = headingSlug(label) || `noi-dung-${toc.length + 1}`;
    const count = usedIds.get(baseId) || 0;
    usedIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    const cleanAttributes = String(attributes).replace(/\s+id=(['"])[\s\S]*?\1/gi, '');
    toc.push({ id, label, level: Number(level) });
    return `<h${level}${cleanAttributes} id="${id}">${innerHtml}</h${level}>`;
  });

  return { html, toc };
};

const formatDate = (value?: string) => value
  ? new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  : '';

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
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
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

        // Tăng số lượt xem bài viết (Views)
        const sessionKey = `viewed_${slug}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, 'true');
          try {
            // 1. Thử gọi hàm RPC Postgres
            const { error: rpcError } = await supabase.rpc('increment_post_views', { post_slug: slug });
            if (rpcError) {
              // 2. Fallback sang lệnh update trực tiếp
              await supabase
                .from('posts')
                .update({ views: ((data.views || 0) + 1) })
                .eq('id', data.id);
            }
          } catch (vErr) {
            console.warn('Could not increment views:', vErr);
          }
        }

        // Lấy danh sách bình luận
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', data.id)
          .order('created_at', { ascending: false });
          
        setComments(commentsData || []);
        // Lấy bài viết gợi ý (cùng trạng thái published, loại trừ bài hiện tại)
        const { data: relatedData } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3)
          .order('created_at', { ascending: false });
        
        setRelatedPosts(relatedData || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug, navigate]);

  useEffect(() => {
    if (!post) return;

    const updateProgress = () => {
      const content = document.getElementById('article-content');
      if (!content) return;
      const start = content.offsetTop - window.innerHeight * 0.2;
      const end = content.offsetTop + content.offsetHeight - window.innerHeight * 0.7;
      const distance = Math.max(end - start, 1);
      const progress = Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100));
      setReadingProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [post]);

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

  const preparedContent = preparePostContent(post.content || '');
  const readingMinutes = Math.max(1, Math.ceil(preparedContent.html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length / 220));

  return (
    <>
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div className="h-full bg-amber-500" style={{ width: `${readingProgress}%` }} />
    </div>
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mx-auto min-h-screen max-w-5xl px-4 sm:px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40 w-full overflow-hidden"
    >
      <SEO 
        title={post.seo_title || post.title} 
        description={post.seo_description || `Đọc bài viết về ${post.title} trên blog của Nguyễn Trọng Hữu`}
        type="article"
        image={post.cover_image}
        url={`https://nguyentronghuu.com/blog/${post.slug}`}
        keywords={`${post.category}, ${post.title}`}
        publishedTime={post.created_at}
        modifiedTime={post.updated_at || post.created_at}
        articleSection={post.category}
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Bài viết', url: 'https://nguyentronghuu.com/blog' },
          { name: post.title, url: `https://nguyentronghuu.com/blog/${post.slug}` },
        ]}
      />

      <Link 
        to="/blog"
        className="inline-flex items-center space-x-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-12 md:mb-16"
      >
        <ArrowLeft size={16} />
        <span>Trở lại Bài viết</span>
      </Link>

      <header className="mx-auto mb-12 max-w-3xl">
        <div className="flex items-center space-x-4 mb-6 text-sm font-medium text-zinc-500">
          <span className="uppercase tracking-widest">{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span>{formatDate(post.created_at)}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span>{readingMinutes} phút đọc</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-zinc-900 leading-tight mb-8 md:mb-12">
          {post.title}
        </h1>
        <div className="mb-10 flex items-center justify-between gap-5 border-y border-zinc-200 py-5">
          <Link to="/about" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 font-serif text-lg font-semibold text-white">H</span>
            <span>
              <span className="block text-xs text-zinc-500">Tác giả</span>
              <span className="block text-sm font-semibold text-zinc-900 transition-colors group-hover:text-amber-700">Nguyễn Trọng Hữu</span>
            </span>
          </Link>
          {post.updated_at && (
            <span className="text-right text-xs leading-relaxed text-zinc-500">
              Cập nhật<br/><strong className="font-semibold text-zinc-700">{formatDate(post.updated_at)}</strong>
            </span>
          )}
        </div>
        <div className="w-full flex justify-center bg-zinc-50 rounded-sm mb-12">
          <img src={post.cover_image || 'https://via.placeholder.com/1200x600'} alt={post.title} width="1200" height="675" className="w-full h-auto max-h-[70vh] object-contain rounded-sm" />
        </div>
      </header>

      {preparedContent.toc.length > 0 && (
        <details className="mx-auto mb-10 max-w-3xl rounded-xl border border-zinc-200 bg-zinc-50 p-5 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-zinc-900">Mục lục bài viết</summary>
          <nav className="mt-4 space-y-1 border-t border-zinc-200 pt-4" aria-label="Mục lục bài viết trên mobile">
            {preparedContent.toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={`block py-1.5 text-sm text-zinc-600 hover:text-amber-700 ${item.level === 3 ? 'pl-4' : ''}`}>{item.label}</a>
            ))}
          </nav>
        </details>
      )}

      <div className={`mb-16 grid w-full min-w-0 max-w-full gap-12 ${preparedContent.toc.length > 0 ? 'lg:grid-cols-[220px_minmax(0,1fr)]' : ''}`}>
        {preparedContent.toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto border-l border-zinc-200 pl-5" aria-label="Mục lục bài viết">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Mục lục</p>
              <div className="space-y-1">
                {preparedContent.toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={`block py-1.5 text-xs leading-relaxed text-zinc-500 transition-colors hover:text-amber-700 ${item.level === 3 ? 'pl-3' : 'font-semibold text-zinc-700'}`}>{item.label}</a>
                ))}
              </div>
            </nav>
          </aside>
        )}
        <div id="article-content" className="w-full min-w-0 max-w-full overflow-hidden prose prose-zinc max-w-none scroll-mt-32 font-serif text-base leading-relaxed text-zinc-700 prose-headings:scroll-mt-32 prose-img:rounded-sm prose-img:shadow-md prose-a:text-amber-600 md:prose-lg md:text-xl">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: preparedContent.html }} />
          ) : (
            <p className="mb-8 italic text-zinc-500">Nội dung đang được cập nhật...</p>
          )}
        </div>
      </div>

      {/* Interactions Section */}
      <section className="ml-auto max-w-3xl border-t border-zinc-200 pt-10">
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
          
          <form onSubmit={handleCommentSubmit} className="mb-12 relative group">
            {replyingTo && (
              <div className="flex items-center justify-between mb-4 bg-zinc-50 border border-zinc-100 px-4 py-3 rounded-sm text-sm">
                <span className="text-zinc-600">
                  Đang trả lời: <span className="font-medium text-zinc-900">{comments.find(c => c.id === replyingTo)?.name || 'Bình luận'}</span>
                </span>
                <button type="button" onClick={() => setReplyingTo(null)} className="text-zinc-500 hover:text-zinc-900 text-xs uppercase tracking-widest font-bold">
                  Hủy
                </button>
              </div>
            )}
            <div className="relative border border-zinc-200 bg-zinc-50 focus-within:bg-white focus-within:border-zinc-300 focus-within:shadow-md transition-all duration-300 rounded-lg p-2 md:p-3">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={2}
                className="w-full bg-transparent border-none px-3 py-2 min-h-[44px] focus:outline-none focus:ring-0 resize-y text-zinc-900 placeholder:text-zinc-400 text-sm md:text-base transition-colors"
              />
              <div className="flex justify-between items-center mt-1 border-t border-zinc-100/80 pt-2 px-2 pb-0.5">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                    ?
                  </div>
                  <span className="text-xs font-medium tracking-wide hidden sm:inline-block">Gửi ẩn danh</span>
                </div>
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-zinc-900 text-white font-medium px-5 py-2 rounded-md hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                  <Send size={14} className={!commentText.trim() ? "opacity-50" : ""} /> 
                  <span>Gửi bình luận</span>
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

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 pt-16 mt-16">
          <h3 className="text-2xl font-serif text-zinc-900 mb-8">Bài viết gợi ý</h3>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 md:mx-0 md:px-0">
            {relatedPosts.map((rp) => (
              <Link 
                key={rp.id} 
                to={`/blog/${rp.slug}`}
                className="group flex flex-col space-y-4 w-[300px] sm:w-[320px] md:w-auto flex-shrink-0 snap-center"
              >
                <div className="w-full aspect-video overflow-hidden rounded-sm bg-zinc-100">
                  <img 
                    src={rp.cover_image || 'https://via.placeholder.com/600x400'} 
                    alt={rp.title} 
                    width="600" height="338"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{rp.category}</span>
                  <h4 className="text-lg font-serif text-zinc-900 mt-1 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {rp.title}
                  </h4>
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {rp.excerpt || rp.seo_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.article>
    </>
  );
}
