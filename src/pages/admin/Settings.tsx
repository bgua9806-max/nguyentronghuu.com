import React from 'react';
import { User, Lock, Bell, Globe, Sparkles, Shield, Mail } from 'lucide-react';

export default function Settings() {
  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="font-serif text-3xl text-zinc-950">Cài đặt Hệ thống</h2>
           <p className="mt-1 text-sm text-zinc-500">Quản lý cấu hình, bảo mật và hồ sơ cá nhân</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <nav className="flex flex-col gap-2 sticky top-28">
            <button className="flex items-center gap-3 rounded-sm bg-white px-4 py-3 text-sm font-bold text-zinc-950 shadow-sm border border-zinc-200 text-left transition-all">
              <User size={18} className="text-amber-500" />
              Hồ sơ cá nhân
            </button>
            <button className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 text-left transition-all">
              <Shield size={18} />
              Bảo mật
            </button>
            <button className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 text-left transition-all">
              <Bell size={18} />
              Thông báo
            </button>
            <button className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 text-left transition-all">
              <Globe size={18} />
              SEO & Website
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-8 lg:col-span-9">
          
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-8">
             <div className="border-b border-zinc-100 pb-6">
                <h3 className="font-serif text-xl text-zinc-950">Thông tin cơ bản</h3>
                <p className="mt-1 text-sm text-zinc-500">Sẽ được hiển thị công khai trên website.</p>
             </div>

             <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-xl shadow-black/5 ring-1 ring-zinc-200 relative group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200" alt="Avatar" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                       Đổi ảnh
                    </div>
                  </div>
                  <button className="text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 transition-colors">Đổi Avatar</button>
                </div>

                <div className="flex-1 space-y-5">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Họ và tên</label>
                        <input 
                          type="text" 
                          defaultValue="Nguyễn Trọng Hữu"
                          className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Chức danh</label>
                        <input 
                          type="text" 
                          defaultValue="Senior AI Agent Engineer"
                          className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                        />
                     </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Email liên hệ</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          defaultValue="contact@nguyentronghuu.com"
                          className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pl-10 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                        />
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mô tả ngắn (Bio)</label>
                      <textarea 
                        rows={4}
                        defaultValue="Chuyên gia xây dựng hệ thống tự động hóa và AI Agent đa nền tảng, giúp doanh nghiệp tối ưu nguồn lực và mở rộng quy mô kinh doanh không giới hạn."
                        className="w-full resize-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                      />
                   </div>
                </div>
             </div>

             <div className="flex justify-end pt-4 border-t border-zinc-100">
                <button className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95">
                  Lưu thay đổi
                </button>
             </div>
          </div>

          <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div>
                 <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400">
                   <Lock size={20} />
                 </div>
                 <h4 className="mb-1 font-serif text-lg">Xác thực 2 yếu tố (2FA)</h4>
                 <p className="text-sm text-zinc-400">
                   Bảo vệ tài khoản quản trị bằng mã xác nhận qua ứng dụng Authenticator.
                 </p>
               </div>
               <button className="shrink-0 rounded-sm bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-95">
                 Kích hoạt 2FA
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
