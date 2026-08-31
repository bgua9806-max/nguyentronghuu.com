import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  PenTool, Library, Settings, LogOut, LayoutDashboard, Search, Bell, 
  Sparkles, Home, Users, Mail, CheckCircle2, Cpu, Loader2, MessageSquare, 
  Shield, Check, CheckCheck, Clock, ArrowRight, Inbox
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import logoUrl from '../assets/images/logo3.png';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AdminNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  unread: boolean;
  type: 'contact' | 'system' | 'email' | 'post';
  link: string;
}

const DEFAULT_SYSTEM_NOTIFICATIONS: AdminNotification[] = [
  { 
    id: 'sys-1', 
    title: 'Hệ thống Email tự động', 
    desc: 'Hệ thống đã sẵn sàng gửi email xác nhận và chăm sóc tự động cho khách hàng mới.', 
    time: '30 phút trước', 
    timestamp: Date.now() - 30 * 60 * 1000, 
    unread: false, 
    type: 'email', 
    link: '/admin/email' 
  },
  { 
    id: 'sys-2', 
    title: 'Bảo mật & Phân quyền', 
    desc: 'Cấu hình phân quyền truy cập RBAC và bảo vệ phiên đăng nhập đã được kích hoạt.', 
    time: '2 giờ trước', 
    timestamp: Date.now() - 2 * 60 * 60 * 1000, 
    unread: false, 
    type: 'system', 
    link: '/admin/settings' 
  }
];

function formatTimeAgo(dateString: string | number): string {
  const date = typeof dateString === 'number' ? new Date(dateString) : new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 172800) return 'Hôm qua';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('admin_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch real dynamic notifications from contacts & system
  useEffect(() => {
    if (!session) return;

    fetchRealNotifications();

    // Setup Supabase Realtime for instant notification when new contact lead arrives
    const channel = supabase
      .channel('public:contacts:realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contacts' },
        (payload) => {
          const newContact = payload.new;
          const newNotif: AdminNotification = {
            id: newContact.id || Date.now().toString(),
            title: `Liên hệ mới: ${newContact.name || 'Khách hàng'}`,
            desc: newContact.message 
              ? `${newContact.phone ? `(${newContact.phone}) ` : ''}${newContact.message.substring(0, 75)}...`
              : 'Đã gửi yêu cầu tư vấn trên website',
            time: 'Vừa xong',
            timestamp: Date.now(),
            unread: true,
            type: 'contact',
            link: '/admin/contacts'
          };

          setNotifications(prev => [newNotif, ...prev]);
          toast.success(`Khách hàng mới: ${newContact.name} vừa gửi lời nhắn!`, {
            duration: 5000,
            icon: '🔔'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, readNotifIds]);

  const fetchRealNotifications = async () => {
    try {
      const { data: contactsData, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const contactNotifs: AdminNotification[] = (contactsData || []).map(contact => {
        const isUnread = !readNotifIds.includes(contact.id) && contact.status === 'new';
        return {
          id: contact.id,
          title: `Khách hàng: ${contact.name}`,
          desc: contact.message 
            ? `${contact.phone ? `[${contact.phone}] ` : ''}${contact.message.substring(0, 80)}...`
            : 'Đã gửi form liên hệ tư vấn',
          time: formatTimeAgo(contact.created_at || Date.now()),
          timestamp: new Date(contact.created_at || Date.now()).getTime(),
          unread: isUnread,
          type: 'contact',
          link: '/admin/contacts'
        };
      });

      // Combine contact notifications with system announcements
      const merged = [...contactNotifs, ...DEFAULT_SYSTEM_NOTIFICATIONS].sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(merged);
    } catch (err) {
      console.warn('Could not fetch notifications from contacts, using defaults.', err);
      setNotifications(DEFAULT_SYSTEM_NOTIFICATIONS);
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const updatedReadIds = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updatedReadIds);
    localStorage.setItem('admin_read_notifs', JSON.stringify(updatedReadIds));
    
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('Đã đánh dấu đã đọc tất cả thông báo');
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    if (notif.unread) {
      const updatedReadIds = Array.from(new Set([...readNotifIds, notif.id]));
      setReadNotifIds(updatedReadIds);
      localStorage.setItem('admin_read_notifs', JSON.stringify(updatedReadIds));
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    }
    setShowNotifications(false);
    navigate(notif.link);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Đăng xuất thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đăng xuất');
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  const filteredNotifications = filterTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.unread);

  const getNotifIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'contact':
        return <Users size={14} className="text-zinc-950" />;
      case 'email':
        return <Mail size={14} className="text-zinc-950" />;
      case 'system':
        return <Shield size={14} className="text-zinc-950" />;
      case 'post':
        return <PenTool size={14} className="text-zinc-950" />;
      default:
        return <Bell size={14} className="text-zinc-950" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef]">
        <Loader2 className="w-8 h-8 text-zinc-950 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bài viết', path: '/admin/posts', icon: PenTool },
    { name: 'Dự án', path: '/admin/projects', icon: Library },
    { name: 'Dịch vụ', path: '/admin/services', icon: Cpu },
    { name: 'Khách hàng', path: '/admin/contacts', icon: Users },
    { name: 'Cấu hình Email', path: '/admin/email', icon: Mail },
    { name: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  const currentPage = navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Quản trị';
  const pageDescriptions: Record<string, string> = {
    Dashboard: 'Theo dõi nội dung, khách hàng và hiệu quả website.',
    'Bài viết': 'Biên tập và xuất bản nội dung chuẩn SEO.',
    'Dự án': 'Quản lý hồ sơ năng lực và case study.',
    'Dịch vụ': 'Cập nhật các giải pháp đang cung cấp.',
    'Khách hàng': 'Tiếp nhận và xử lý yêu cầu tư vấn.',
    'Cấu hình Email': 'Thiết kế nội dung email tự động.',
    'Cài đặt': 'Hồ sơ, tích hợp và bảo mật hệ thống.',
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-900 lg:flex admin-crm-shell">
      <aside className="hidden lg:fixed lg:top-0 lg:left-0 lg:z-40 lg:flex lg:w-[220px] lg:flex-col border-r border-white/10 bg-zinc-950 text-zinc-300 overflow-hidden h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.16),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative flex h-full flex-col p-3.5">
          <Link to="/" className="group mb-7 mt-1 flex items-center justify-start px-1.5 transition-all active:scale-[0.98]">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-[36px] w-auto object-contain transition-transform duration-300 transform group-hover:scale-[1.02] origin-left" 
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
                  className={`group flex min-h-10 items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-xl shadow-black/20'
                      : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-zinc-950' : 'text-zinc-500 group-hover:text-zinc-200'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
            <Link to="/" className="flex min-h-9 items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]">
              <Home size={15} /> Xem website
            </Link>
            <button 
              onClick={handleLogout}
              className="flex min-h-9 w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs font-semibold text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
            >
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:pl-[220px]">
        <header className="sticky top-0 z-50 border-b border-white/70 bg-[#f4f1eb]/85 backdrop-blur-2xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <h1 className="truncate font-serif text-2xl text-zinc-950 sm:text-3xl">{currentPage}</h1>
              <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block">{pageDescriptions[currentPage]}</p>
            </div>

            {/* NOTIFICATION BELL & DROPDOWN */}
            <div className="relative flex items-center gap-3" ref={notifRef}>
              <div className="hidden items-center gap-3 border-r border-zinc-200 pr-3 md:flex">
                <div className="text-right">
                  <p className="max-w-48 truncate text-xs font-semibold text-zinc-900">{session.user?.email || 'Quản trị viên'}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-400">Đang hoạt động</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 font-serif text-sm text-white ring-4 ring-white">
                  {(session.user?.email || 'A').charAt(0).toUpperCase()}
                </div>
              </div>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 shadow-sm transition-all hover:shadow-md active:scale-95 ${showNotifications ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-700'}`} 
                aria-label="Thông báo hệ thống"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white ring-2 ring-white px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-3 flex max-h-[calc(100vh-7rem)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-sm border border-zinc-200/80 bg-white p-5 shadow-2xl origin-top-right z-50 animate-in fade-in"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-zinc-950">Thông báo</h3>
                        {unreadCount > 0 && (
                          <span className="text-[11px] font-semibold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-sm border border-zinc-200">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck size={14} /> Đã đọc tất cả
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setFilterTab('all')}
                        className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
                          filterTab === 'all' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        Tất cả ({notifications.length})
                      </button>
                      <button
                        onClick={() => setFilterTab('unread')}
                        className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
                          filterTab === 'unread' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        Chưa đọc ({unreadCount})
                      </button>
                    </div>

                    {/* Notification List */}
                    <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {filteredNotifications.length === 0 ? (
                        <div className="py-10 text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                            <Inbox size={20} />
                          </div>
                          <p className="text-sm font-semibold text-zinc-700">Không có thông báo nào</p>
                          <p className="text-xs text-zinc-400">Mọi thông báo về khách hàng và hệ thống sẽ hiển thị tại đây.</p>
                        </div>
                      ) : (
                        filteredNotifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 rounded-sm border transition-all cursor-pointer flex items-start gap-3 group ${
                              notif.unread 
                                ? 'bg-zinc-50/80 border-zinc-300 shadow-sm hover:bg-zinc-100/70' 
                                : 'bg-white border-zinc-100 hover:bg-zinc-50/60'
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-zinc-100 border border-zinc-200/80">
                              {getNotifIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-sm truncate ${notif.unread ? 'font-bold text-zinc-950' : 'font-medium text-zinc-700'}`}>
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-zinc-400 shrink-0 flex items-center gap-1">
                                  <Clock size={10} /> {notif.time}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                {notif.desc}
                              </p>
                            </div>
                            {notif.unread && (
                              <div className="h-2 w-2 rounded-full bg-zinc-950 mt-1.5 shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer link */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <Link 
                        to="/admin/contacts" 
                        onClick={() => setShowNotifications(false)}
                        className="font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 transition-colors"
                      >
                        Quản lý khách hàng <ArrowRight size={13} />
                      </Link>
                      <button 
                        onClick={() => fetchRealNotifications()} 
                        className="text-zinc-400 hover:text-zinc-700 transition-colors"
                      >
                        Làm mới
                      </button>
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

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/90 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-20px_60px_rgba(24,24,27,0.12)] backdrop-blur-2xl lg:hidden">
        <div className="admin-scrollbar-none flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex min-h-14 min-w-[76px] flex-col items-center justify-center rounded-sm px-2 text-[10px] font-bold transition-all active:scale-95 ${isActive ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-300' : 'text-zinc-500'}`}>
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
