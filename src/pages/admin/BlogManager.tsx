import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function BlogManager() {
  const posts = [
    { id: 1, title: 'Cách tối ưu hóa phễu chuyển đổi cho B2B', date: '06/05/2026', category: 'Marketing', views: 1240, status: 'published' },
    { id: 2, title: 'Vai trò của UI/UX trong chiến dịch Marketing', date: '02/05/2026', category: 'Design', views: 890, status: 'published' },
    { id: 3, title: 'Xây dựng chiến lược nội dung cho năm 2026', date: '28/04/2026', category: 'Content', views: 0, status: 'draft' },
  ];

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
        <Link 
          to="/admin/posts/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Viết bài mới
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Chuyên mục</th>
              <th className="px-6 py-4">Ngày đăng</th>
              <th className="px-6 py-4">Lượt xem</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{post.title}</td>
                <td className="px-6 py-4 text-zinc-500">{post.category}</td>
                <td className="px-6 py-4 text-zinc-500">{post.date}</td>
                <td className="px-6 py-4 text-zinc-500">{post.views}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/admin/posts/edit/${post.id}`} className="inline-flex p-2 text-zinc-400 hover:text-blue-600 transition-colors" title="Sửa">
                    <Edit2 size={16} />
                  </Link>
                  <button className="inline-flex p-2 text-zinc-400 hover:text-red-600 transition-colors" title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
