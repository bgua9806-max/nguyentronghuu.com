import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PenTool, Library, Settings, LogOut, LayoutDashboard, Search, Bell, Sparkles, Home, Users, Mail } from 'lucide-react';
import logoUrl from '../assets/images/logo3.png';

export default function AdminLayout() {
  const location = useLocation();

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
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[292px] lg:flex-col border-r border-white/10 bg-zinc-950 text-zinc-300 overflow-hidden">
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

            <button className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95" aria-label="Thông báo CRM">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>
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
