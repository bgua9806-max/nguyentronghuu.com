import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Folder, Users, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Tổng bài viết', value: '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Dự án', value: '12', icon: Folder, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Lượt xem (tháng)', value: '12.4k', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Đăng ký nhận tin', value: '1,420', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-zinc-900 font-serif">Bài viết gần đây</h3>
            <Link to="/admin/posts" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-zinc-50 last:border-0">
                <div>
                  <div className="font-medium text-zinc-900 mb-1">Cách tối ưu hóa phễu chuyển đổi {i}</div>
                  <div className="text-xs text-zinc-500">Đăng ngày 06/05/2026 • Marketing</div>
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Đã xuất bản</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-zinc-900 font-serif">Hành động nhanh</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/posts/new" className="flex flex-col items-center justify-center p-6 border border-zinc-200 border-dashed rounded-xl hover:bg-zinc-50 transition-colors group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <span className="font-medium text-zinc-900">Viết bài mới</span>
            </Link>
            <Link to="/admin/projects/new" className="flex flex-col items-center justify-center p-6 border border-zinc-200 border-dashed rounded-xl hover:bg-zinc-50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Folder size={24} />
              </div>
              <span className="font-medium text-zinc-900">Thêm dự án</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
