import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PenTool, Library, Settings, LogOut, LayoutDashboard, Search, Bell, Sparkles, Home, Users, Mail, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import logoUrl from '../assets/images/logo3.png';

export default function AdminLayout() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Liên hệ mới', desc: 'Có yêu cầu tư vấn AI Automation từ anh Tuấn Anh.', time: '5 phút trước', unread: true },
    { id: 2, title: 'Hệ thống tự động', desc: 'Nodemailer vừa gửi xong 150 email chăm sóc khách hàng tự động.', time: '1 giờ trước', unread: true },
    { id: 3, title: 'Báo cáo Traffic', desc: 'Website vừa đạt mốc 2.500 lượt xem tự nhiên trong tuần.', time: 'Hôm qua', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bài viết', path: '/admin/posts', icon: PenTool },
    { name: 'Dự án', path: '/admin/projects', icon: Library },
    { name: 'Khách hàng', path: '/admin/contacts', icon: Users },
    { name: 'Cấu hình Email', path: '/admin/email', icon: Mail },
    { name: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  const currentPage = navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Quản trị';

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      document.body.style.zoom = "90%";
      document.documentElement.style.setProperty('--ui-zoom', "0.9");
    } else {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', "1");
    }

    return () => {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', "1");
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh/var(--ui-zoom,1))] bg-[#f7f4ef] text-zinc-900 lg:flex admin-crm-shell">
      <aside className="hidden lg:fixed lg:top-0 lg:left-0 lg:z-40 lg:flex lg:w-[292px] lg:flex-col border-r border-white/10 bg-zinc-950 text-zinc-300 overflow-hidden h-[calc(100vh/var(--ui-zoom,1))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.16),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative flex h-full flex-col p-5">
          <Link to="/" className="group mb-10 mt-2 flex items-center justify-start px-2 transition-all active:scale-[0.98]">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-[46px] w-auto object-contain transition-transform duration-300 transform group-hover:scale-[1.02] origin-left" 
              style={{
                filter: 'invert(1) brightness(1.5)',
                mixBlendMode: 'screen'
              }}
            />
          </Link>



          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex min-h-12 items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-xl shadow-black/20'
                      : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Icon size={19} className={isActive ? 'text-amber-600' : 'text-zinc-500 group-hover:text-amber-200'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            <Link to="/" className="flex min-h-11 items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]">
              <Home size={18} /> Xem website
            </Link>
            <button className="flex min-h-11 w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm font-semibold text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]">
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:pl-[292px]">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-[#f7f4ef]/80 backdrop-blur-2xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <h1 className="truncate font-serif text-2xl text-zinc-950 sm:text-3xl">{currentPage}</h1>
            </div>

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 shadow-sm transition-all hover:shadow-md active:scale-95 ${showNotifications ? 'bg-zinc-100 text-zinc-900' : 'bg-white text-zinc-600'}`} 
                aria-label="Thông báo CRM"
              >
                <Bell size={18} className={showNotifications ? 'fill-zinc-900' : ''} />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl bg-white p-4 shadow-2xl border border-zinc-100 origin-top-right z-50"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                      <h3 className="font-serif text-lg text-zinc-900">Thông báo</h3>
                      <button className="text-xs font-medium text-amber-600 hover:text-amber-700">Đánh dấu đã đọc</button>
                    </div>
                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {notifications.map(notif => (
                        <div key={notif.id} className="flex items-start gap-3 group cursor-pointer">
                          <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notif.unread ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400'}`}>
                            <Bell size={14} className={notif.unread ? 'fill-amber-600/20' : ''} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${notif.unread ? 'text-zinc-900' : 'text-zinc-600'}`}>{notif.title}</p>
                            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                            <p className="text-[10px] text-zinc-400 mt-1">{notif.time}</p>
                          </div>
                          {notif.unread && <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
                      <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Xem tất cả thông báo</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/90 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-20px_60px_rgba(24,24,27,0.12)] backdrop-blur-2xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex min-h-14 flex-col items-center justify-center rounded-sm text-[11px] font-bold transition-all active:scale-95 ${isActive ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-300' : 'text-zinc-500'}`}>
                <Icon size={19} className="mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
