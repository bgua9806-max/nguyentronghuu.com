import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PenTool, Library, Settings, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bài viết', path: '/admin/posts', icon: PenTool },
    { name: 'Dự án', path: '/admin/projects', icon: Library },
    { name: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link to="/" className="text-xl font-serif text-white tracking-tight hover:text-zinc-400 transition-colors">
            Hữu<span className="text-zinc-500">.</span> Admin
          </Link>
        </div>
        
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-zinc-800 text-white font-medium' 
                        : 'hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center px-8">
          <h2 className="text-xl font-medium text-zinc-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Quản trị'}
          </h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
