import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Folder, Users, Activity, Eye, TrendingUp, Clock, MessageSquare, Settings, ArrowUpRight, ArrowDownRight, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalPosts: 0,
    totalProjects: 0,
    totalViews: 0,
    subscribers: 1580,
  });
  
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*');
        
      if (postsError) throw postsError;
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id');
        
      if (projectsError) throw projectsError;
      
      const posts = postsData || [];
      const projects = projectsData || [];
      
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      
      // Top 3 posts by views
      const sortedPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
      
      setStatsData({
        totalPosts: posts.length,
        totalProjects: projects.length,
        totalViews: totalViews,
        subscribers: 1580
      });
      
      setTopPosts(sortedPosts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Lỗi tải dữ liệu tổng quan');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Tổng bài viết', value: statsData.totalPosts.toString(), icon: FileText, change: '+12%', trend: 'up' },
    { label: 'Dự án hoàn thành', value: statsData.totalProjects.toString(), icon: Folder, change: '+5%', trend: 'up' },
    { label: 'Lượt xem', value: statsData.totalViews.toLocaleString(), icon: Activity, change: '+24%', trend: 'up' },
    { label: 'Subscribers', value: statsData.subscribers.toLocaleString(), icon: Users, change: '-2%', trend: 'down' },
  ];

  const recentActivity = [
    { action: 'Đã xuất bản bài viết', target: 'Lộ trình triển khai AI Agent...', time: '2 giờ trước', icon: FileText },
    { action: 'Thêm dự án mới', target: 'Hệ thống quản lý khách sạn...', time: '5 giờ trước', icon: Folder },
    { action: 'Cập nhật SEO', target: 'Trang chủ portfolio', time: '1 ngày trước', icon: Eye },
    { action: 'Phản hồi khách hàng', target: 'Nguyễn Văn A - Tư vấn AI', time: '1 ngày trước', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-sm bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-zinc-100">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-zinc-50 transition-transform group-hover:scale-150" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 transition-transform group-hover:scale-110 group-hover:bg-amber-500 group-hover:shadow-amber-500/20">
                <stat.icon size={22} strokeWidth={1.5} />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${stat.trend === 'up' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-50 text-zinc-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            
            <div className="relative mt-5">
              <div className="text-3xl font-serif text-zinc-950 tracking-tight">{stat.value}</div>
              <div className="mt-1 text-sm font-medium text-zinc-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h3 className="font-serif text-2xl text-zinc-950">Lưu lượng truy cập</h3>
                <p className="mt-1 text-sm text-zinc-500">Thống kê dữ liệu 30 ngày qua</p>
              </div>
              <div className="flex rounded-sm bg-zinc-50 p-1 border border-zinc-100">
                <button className="rounded-sm bg-white px-4 py-1.5 text-xs font-bold text-zinc-950 shadow-sm border border-zinc-200">Tuần</button>
                <button className="rounded-sm px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors">Tháng</button>
              </div>
            </div>
            
            {/* Minimalist Chart Visualization */}
            <div className="relative h-64 w-full flex items-end justify-between gap-1 sm:gap-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-zinc-100">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-full border-t border-zinc-100/50" />
                ))}
              </div>
              
              {[40, 65, 45, 80, 55, 90, 70, 85, 50, 75, 95, 60].map((height, i) => (
                <div key={i} className="group relative flex-1 z-10 flex flex-col justify-end h-full">
                  <div 
                    className="w-full bg-zinc-100 group-hover:bg-amber-400 rounded-t-md transition-all duration-500 ease-out relative overflow-hidden" 
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-sm bg-zinc-950 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-all group-hover:-top-12 group-hover:opacity-100">
                    {height * 120}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              <span>01 May</span>
              <span>10 May</span>
              <span>20 May</span>
              <span>30 May</span>
            </div>
          </div>

          <div className="rounded-sm border border-zinc-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 sm:p-8">
              <h3 className="font-serif text-xl text-zinc-950">Bài viết hiệu suất cao</h3>
              <Link to="/admin/posts" className="group flex items-center gap-1 text-xs font-bold text-amber-600 transition-colors hover:text-amber-700 uppercase tracking-wider">
                Xem tất cả <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <div className="divide-y divide-zinc-50">
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
              ) : topPosts.map((post) => (
                <div key={post.id} className="group flex items-center justify-between p-6 sm:px-8 transition-colors hover:bg-zinc-50/50">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50 sm:block relative">
                       <img src={post.cover_image || 'https://via.placeholder.com/100'} alt="" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-sm" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-semibold text-zinc-900 mb-1 group-hover:text-amber-600 transition-colors">{post.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <span className="text-zinc-600">{post.category}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-300" />
                        <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right ml-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">{new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                    <span className="inline-block rounded-sm bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-900 border border-zinc-200 shadow-sm">{post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Activity & Quick Actions */}
        <div className="space-y-8">
           <div className="rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
            <h3 className="mb-6 font-serif text-xl flex items-center gap-2">
              Thao tác nhanh
              <Sparkles size={18} className="text-amber-400" />
            </h3>
            <div className="space-y-3 relative z-10">
              <Link to="/admin/posts/new" className="group flex items-center gap-4 rounded-sm bg-white/5 p-4 transition-all hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-[0.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Viết bài mới</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Tạo bài viết chuẩn SEO</div>
                </div>
              </Link>
              <Link to="/admin/projects/new" className="group flex items-center gap-4 rounded-sm bg-white/5 p-4 transition-all hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-[0.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-800 text-zinc-300">
                  <Folder size={18} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Thêm dự án</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Cập nhật case study mới</div>
                </div>
              </Link>
              <button className="w-full text-left group flex items-center gap-4 rounded-sm bg-white/5 p-4 transition-all hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-[0.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-500/20 text-zinc-300">
                  <Settings size={18} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Cài đặt hệ thống</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Cấu hình SEO & Profile</div>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <h3 className="mb-8 font-serif text-xl text-zinc-950 flex items-center gap-2">
              <Clock size={20} className="text-zinc-400" />
              Nhật ký hệ thống
            </h3>
            <div className="relative space-y-6 before:absolute before:bottom-0 before:left-[19px] before:top-2 before:w-px before:bg-zinc-100">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="relative flex gap-5">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-white border border-zinc-100 text-zinc-500 shadow-sm">
                    <item.icon size={16} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-zinc-900">{item.action}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.target}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full rounded-sm bg-zinc-50 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200/50">
              Xem toàn bộ nhật ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
