import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, ExternalLink, Calendar, PenTool, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function BlogManager() {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredPosts = posts.filter((post) => {
    const haystack = `${post.title || ''} ${post.category || ''}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Lỗi tải danh sách bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postToDelete);
        
      if (error) throw error;
      
      toast.success('Đã xóa bài viết thành công');
      setPosts(posts.filter(p => p.id !== postToDelete));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Lỗi khi xóa bài viết');
    } finally {
      setPostToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Overview Card */}
      <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-zinc-50 transition-transform hover:scale-110 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-100 text-amber-600">
                <PenTool size={20} />
             </div>
             <h2 className="font-serif text-2xl text-zinc-950">Quản lý Bài viết</h2>
          </div>
          <p className="text-sm text-zinc-500 pl-13">Có <strong className="text-zinc-900">{posts.length}</strong> bài viết trên hệ thống.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
            aria-label="Lọc bài viết theo trạng thái"
            className="min-h-11 rounded-sm border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 outline-none transition-colors focus:border-amber-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Bản nháp</option>
          </select>
          
          <Link 
            to="/admin/posts/new"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-950 text-white rounded-sm hover:bg-amber-500 hover:text-zinc-950 transition-all text-sm font-semibold shadow-lg shadow-black/10 active:scale-95"
          >
            <Plus size={18} />
            Viết bài mới
          </Link>
        </div>
      </div>

      {/* Posts Table Card or Empty State */}
      <div className="bg-white rounded-sm border border-zinc-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Loader2 size={32} className="text-amber-500 animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Đang tải dữ liệu...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
              <PenTool size={32} className="text-zinc-300" />
            </div>
            <h3 className="font-serif text-2xl text-zinc-900 mb-2">{posts.length === 0 ? 'Chưa có bài viết nào' : 'Không tìm thấy bài viết'}</h3>
            <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
              {posts.length === 0 ? 'Hãy bắt đầu xây dựng nội dung cho website của bạn bằng cách tạo bài viết đầu tiên.' : 'Thử thay đổi từ khóa hoặc bộ lọc trạng thái.'}
            </p>
            {posts.length === 0 && <Link
              to="/admin/posts/new"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-950 text-white rounded-sm hover:bg-amber-500 hover:text-zinc-950 transition-all text-sm font-semibold shadow-xl shadow-black/10 hover:shadow-amber-500/20 active:scale-95"
            >
              <Plus size={18} />
              Viết bài mới ngay
            </Link>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-[0.15em] text-[10px] border-b border-zinc-100">
                    <th className="px-8 py-5">Bài viết</th>
                    <th className="px-8 py-5">Chuyên mục</th>
                    <th className="px-8 py-5 text-center">Lượt xem</th>
                    <th className="px-8 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {paginatedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-sm border border-zinc-100 bg-zinc-50 overflow-hidden shrink-0 relative">
                            <img src={post.cover_image || 'https://via.placeholder.com/150'} alt="" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-sm" />
                          </div>
                          <div className="max-w-[280px] lg:max-w-md">
                            <div className="font-semibold text-sm text-zinc-900 mb-1 truncate group-hover:text-amber-600 transition-colors">{post.title}</div>
                            <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-3">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-300" />
                              <Link to={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-1 hover:text-zinc-900 transition-colors"><ExternalLink size={12} /> Xem trước</Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 bg-zinc-100/80 text-zinc-600 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 text-zinc-900 font-bold text-sm bg-white border border-zinc-100 shadow-sm px-3 py-1 rounded-sm">
                          <Eye size={14} className="text-zinc-400" />
                          {(post.views || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm border ${
                          post.status === 'published' 
                            ? 'bg-zinc-100 text-zinc-900 border-emerald-100' 
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/admin/posts/edit/${post.id}`} 
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-400 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 shadow-sm" 
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button 
                            onClick={() => setPostToDelete(post.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-400 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 shadow-sm" 
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-8 py-5 border-t border-zinc-100 flex justify-between items-center bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Hiển thị <span className="text-zinc-900">{filteredPosts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredPosts.length)}</span> trên <span className="text-zinc-900">{filteredPosts.length}</span></span>
              <div className="flex gap-2">
                <button onClick={() => setPage(value => Math.max(1, value - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-zinc-200 text-zinc-900 rounded-sm text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
                <button onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-zinc-200 text-zinc-900 rounded-sm text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40">Sau</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-sm shadow-2xl shadow-black/20 p-6 w-full max-w-sm m-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-serif text-xl text-zinc-950">Xác nhận xóa</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-6 pl-13">
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
