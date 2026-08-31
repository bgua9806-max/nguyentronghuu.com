import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Shield, Mail, Loader2, Save, 
  Users, UserPlus, Check, X, ShieldAlert, Edit3, 
  Trash2, ToggleLeft, ToggleRight, CheckCircle2, Eye, EyeOff,
  LayoutDashboard, PenTool, Library, Cpu, Settings as SettingsIcon, Minus,
  Copy, ExternalLink, RefreshCw, Sparkles, Terminal, Code, ArrowRight, Play
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'crm' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

interface RolePermission {
  module: string;
  name: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  publish?: boolean;
  export?: boolean;
}

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Nguyễn Trọng Hữu',
    email: 'nguyentronghuu1905@gmail.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: 'Vừa xong',
    createdAt: '2026-01-15'
  },
  {
    id: '2',
    name: 'Biên Tập Viên Nội Dung',
    email: 'content.editor@nguyentronghuu.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2 giờ trước',
    createdAt: '2026-03-10'
  },
  {
    id: '3',
    name: 'Chuyên Viên Tư Vấn CRM',
    email: 'crm.support@nguyentronghuu.com',
    role: 'crm',
    status: 'active',
    lastLogin: 'Hôm qua',
    createdAt: '2026-04-05'
  }
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, RolePermission[]> = {
  super_admin: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', view: true, create: true, edit: true, delete: true, export: true },
    { module: 'posts', name: 'Quản lý Bài viết', view: true, create: true, edit: true, delete: true, publish: true },
    { module: 'projects', name: 'Quản lý Dự án', view: true, create: true, edit: true, delete: true },
    { module: 'services', name: 'Quản lý Dịch vụ', view: true, create: true, edit: true, delete: true },
    { module: 'contacts', name: 'Khách hàng & CRM', view: true, create: true, edit: true, delete: true, export: true },
    { module: 'email', name: 'Cấu hình Email Marketing', view: true, create: true, edit: true, delete: true },
    { module: 'settings', name: 'Cài đặt & Phân quyền', view: true, create: true, edit: true, delete: true }
  ],
  editor: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', view: true, create: false, edit: false, delete: false, export: false },
    { module: 'posts', name: 'Quản lý Bài viết', view: true, create: true, edit: true, delete: true, publish: true },
    { module: 'projects', name: 'Quản lý Dự án', view: true, create: true, edit: true, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', view: true, create: true, edit: true, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', view: false, create: false, edit: false, delete: false, export: false },
    { module: 'email', name: 'Cấu hình Email Marketing', view: false, create: false, edit: false, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', view: false, create: false, edit: false, delete: false }
  ],
  crm: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', view: true, create: false, edit: false, delete: false, export: true },
    { module: 'posts', name: 'Quản lý Bài viết', view: false, create: false, edit: false, delete: false, publish: false },
    { module: 'projects', name: 'Quản lý Dự án', view: false, create: false, edit: false, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', view: false, create: false, edit: false, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', view: true, create: true, edit: true, delete: false, export: true },
    { module: 'email', name: 'Cấu hình Email Marketing', view: true, create: false, edit: true, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', view: false, create: false, edit: false, delete: false }
  ],
  viewer: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', view: true, create: false, edit: false, delete: false, export: false },
    { module: 'posts', name: 'Quản lý Bài viết', view: true, create: false, edit: false, delete: false, publish: false },
    { module: 'projects', name: 'Quản lý Dự án', view: true, create: false, edit: false, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', view: true, create: false, edit: false, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', view: false, create: false, edit: false, delete: false, export: false },
    { module: 'email', name: 'Cấu hình Email Marketing', view: false, create: false, edit: false, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', view: false, create: false, edit: false, delete: false }
  ]
};

const getModuleIcon = (module: string) => {
  switch (module) {
    case 'dashboard':
      return <LayoutDashboard size={14} className="text-zinc-700" />;
    case 'posts':
      return <PenTool size={14} className="text-zinc-700" />;
    case 'projects':
      return <Library size={14} className="text-zinc-700" />;
    case 'services':
      return <Cpu size={14} className="text-zinc-700" />;
    case 'contacts':
      return <Users size={14} className="text-zinc-700" />;
    case 'email':
      return <Mail size={14} className="text-zinc-700" />;
    case 'settings':
      return <SettingsIcon size={14} className="text-zinc-700" />;
    default:
      return <Shield size={14} className="text-zinc-700" />;
  }
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'mcp' | 'security'>('mcp');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile states
  const [name, setName] = useState('Nguyễn Trọng Hữu');
  const [title, setTitle] = useState('Senior AI Agent Engineer');
  const [email, setEmail] = useState('nguyentronghuu1905@gmail.com');
  const [bio, setBio] = useState('Chuyên gia xây dựng hệ thống tự động hóa và AI Agent đa nền tảng, giúp doanh nghiệp tối ưu nguồn lực và mở rộng quy mô kinh doanh không giới hạn.');
  const [avatar, setAvatar] = useState('https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png');
  const [isUploading, setIsUploading] = useState(false);

  // RBAC states
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [rolePermissions, setRolePermissions] = useState<Record<string, RolePermission[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<'super_admin' | 'editor' | 'crm' | 'viewer'>('editor');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'editor' | 'crm' | 'viewer'>('editor');

  // MCP & AI Agent states
  const [apiKey, setApiKey] = useState('nth_ai_agent_secret_2026');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingMcp, setIsTestingMcp] = useState(false);
  const [testPostTitle, setTestPostTitle] = useState('Ứng dụng AI Agent tự động hóa tiếp thị đa kênh 2026');
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile settings
      const { data: profileData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'profile_settings')
        .single();

      if (profileData && profileData.value) {
        setName(profileData.value.name || '');
        setTitle(profileData.value.title || '');
        setEmail(profileData.value.email || '');
        setBio(profileData.value.bio || '');
        setAvatar(profileData.value.avatar || '');
      }

      // Fetch permission settings
      const { data: permData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'admin_permissions_settings')
        .single();

      if (permData && permData.value) {
        if (permData.value.users) setAdminUsers(permData.value.users);
        if (permData.value.permissions) setRolePermissions(permData.value.permissions);
      }

      // Fetch MCP settings if any
      const { data: mcpData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'mcp_settings')
        .single();

      if (mcpData && mcpData.value && mcpData.value.apiKey) {
        setApiKey(mcpData.value.apiKey);
      }
    } catch (error) {
      console.warn('No custom settings found, using default values.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !title.trim() || !email.trim()) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = { name, title, email, bio, avatar };

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'profile_settings',
          value: payload,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Đã cập nhật cấu hình hồ sơ cá nhân!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt: ' + (error.message || 'Lỗi kết nối'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    try {
      setIsSaving(true);
      const payload = {
        users: adminUsers,
        permissions: rolePermissions,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'admin_permissions_settings',
          value: payload,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Đã lưu cấu hình phân quyền và tài khoản thành công!');
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast.error('Không thể lưu phân quyền: ' + (error.message || 'Lỗi kết nối'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMcpSettings = async () => {
    try {
      setIsSaving(true);
      const payload = {
        apiKey,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'mcp_settings',
          value: payload,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Đã lưu cấu hình MCP & API Key thành công!');
    } catch (error: any) {
      toast.error('Lỗi khi lưu cấu hình MCP: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const handleTestMcpPost = async () => {
    try {
      setIsTestingMcp(true);
      setTestResult(null);

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          title: testPostTitle,
          content: `<h2>${testPostTitle}</h2><p>Bài viết thử nghiệm được tạo tự động qua giao thức MCP và Serverless API của Nguyễn Trọng Hữu lúc ${new Date().toLocaleTimeString('vi-VN')}.</p><p>Hệ thống AI Agent đã kết nối thành công 100%.</p>`,
          category: 'AI AGENT',
          tags: ['AI Agent', 'MCP Automation', 'ChatGPT'],
          status: 'draft'
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Lỗi kết nối API');

      setTestResult(JSON.stringify(json, null, 2));
      toast.success('Thử nghiệm gọi MCP tạo bài thành công (Lưu dạng bản nháp)!');
    } catch (err: any) {
      setTestResult(`Lỗi: ${err.message}`);
      toast.error(`Thử nghiệm thất bại: ${err.message}`);
    } finally {
      setIsTestingMcp(false);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Vui lòng nhập đầy đủ họ tên và email');
      return;
    }

    const newUser: AdminUser = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
      lastLogin: 'Chưa đăng nhập',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...adminUsers, newUser];
    setAdminUsers(updated);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    toast.success(`Đã thêm thành viên "${newUserName}" thành công!`);
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = adminUsers.map(u => {
      if (u.id === userId) {
        if (u.role === 'super_admin' && u.email === 'nguyentronghuu1905@gmail.com') {
          toast.error('Không thể khóa tài khoản Super Admin chính.');
          return u;
        }
        const nextStatus: 'active' | 'inactive' = u.status === 'active' ? 'inactive' : 'active';
        toast.success(`Đã ${nextStatus === 'active' ? 'mở khóa' : 'tạm khóa'} tài khoản ${u.name}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setAdminUsers(updated);
  };

  const handleDeleteUser = (userId: string) => {
    const target = adminUsers.find(u => u.id === userId);
    if (target?.role === 'super_admin' && target?.email === 'nguyentronghuu1905@gmail.com') {
      toast.error('Không thể xóa tài khoản Super Admin chính.');
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${target?.name}" khỏi ban quản trị?`)) {
      setAdminUsers(adminUsers.filter(u => u.id !== userId));
      toast.success('Đã xóa tài khoản thành viên.');
    }
  };

  const handleTogglePermission = (role: string, moduleKey: string, permKey: 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'export') => {
    if (role === 'super_admin') {
      toast.error('Super Admin luôn sở hữu toàn quyền cao nhất.');
      return;
    }

    const currentPerms = rolePermissions[role] || [];
    const updatedPerms = currentPerms.map(item => {
      if (item.module === moduleKey) {
        return {
          ...item,
          [permKey]: !item[permKey]
        };
      }
      return item;
    });

    setRolePermissions({
      ...rolePermissions,
      [role]: updatedPerms
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setAvatar(data.publicUrl);
      toast.success('Đã tải ảnh đại diện mới lên!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error('Lỗi khi tải ảnh đại diện lên: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleBadge = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-950 text-amber-400 border border-amber-500/30"><Shield size={11} /> Super Admin</span>;
      case 'editor':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200"><Edit3 size={11} /> Editor</span>;
      case 'crm':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200"><Users size={11} /> CRM Specialist</span>;
      case 'viewer':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200"><Eye size={11} /> Viewer</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải cấu hình cài đặt...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl text-zinc-950">Cài đặt</h2>
          <p className="mt-1 text-sm text-zinc-500">Quản lý cấu hình, phân quyền, kết nối MCP AI Agent và bảo mật trang quản trị</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <nav className="flex flex-col gap-1.5 sticky top-28">
            <button 
              onClick={() => setActiveTab('mcp')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-left transition-all ${activeTab === 'mcp' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <Cpu size={17} className={activeTab === 'mcp' ? 'text-zinc-950' : 'text-zinc-400'} />
              Kết nối MCP & AI Agent
            </button>
            <button 
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-left transition-all ${activeTab === 'permissions' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <ShieldAlert size={17} className={activeTab === 'permissions' ? 'text-zinc-950' : 'text-zinc-400'} />
              Phân quyền & Tài khoản
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-left transition-all ${activeTab === 'profile' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <User size={17} className={activeTab === 'profile' ? 'text-zinc-950' : 'text-zinc-400'} />
              Hồ sơ cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold text-left transition-all ${activeTab === 'security' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <Lock size={17} className={activeTab === 'security' ? 'text-zinc-950' : 'text-zinc-400'} />
              Bảo mật (2FA)
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-8 lg:col-span-9">

          {/* TAB: MCP & AI AGENT (NEW) */}
          {activeTab === 'mcp' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Overview Banner */}
              <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-zinc-300 mb-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> MCP Server Status: Online (200 OK)
                    </div>
                    <h3 className="font-serif text-2xl text-white">Giao Thức MCP & AI Content Automation</h3>
                    <p className="mt-1 text-sm text-zinc-400 max-w-2xl leading-relaxed">
                      Kết nối website <strong className="text-white">nguyentronghuu.com</strong> với <strong>ChatGPT, Claude Desktop, Antigravity AI</strong> để tự động nghiên cứu, viết bài chuẩn SEO và xuất bản trực tiếp lên website.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href="https://nguyentronghuu.com/openapi.json"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-semibold border border-zinc-700 transition-colors"
                    >
                      <Code size={14} /> Xem OpenAPI JSON
                    </a>
                  </div>
                </div>
              </div>

              {/* 1. API KEY & ENDPOINTS */}
              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <h4 className="font-serif text-lg text-zinc-950">1. Thông tin Kết nối & Xác thực API Key</h4>
                  <p className="mt-0.5 text-xs text-zinc-500">Sử dụng các thông số này để nạp vào ChatGPT Plugins, Custom GPT Actions hoặc Claude Desktop.</p>
                </div>

                {/* API Key Box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mã khóa bí mật (Secret API Key) *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-mono text-zinc-900 transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(apiKey, 'API Key')}
                      className="px-4 py-2.5 rounded-sm bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Copy size={14} /> Sao chép
                    </button>
                    <button 
                      onClick={handleSaveMcpSettings}
                      disabled={isSaving}
                      className="px-4 py-2.5 rounded-sm bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                    >
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Lưu Key
                    </button>
                  </div>
                </div>

                {/* Endpoint Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-sm bg-zinc-50/70 border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                        <Terminal size={14} /> ChatGPT Plugin SSE Stream URL
                      </span>
                      <button 
                        onClick={() => copyToClipboard('https://nguyentronghuu.com/api/sse', 'SSE URL')}
                        className="text-xs text-zinc-600 hover:text-zinc-950 font-semibold flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <p className="font-mono text-xs text-zinc-700 bg-white p-2 rounded-sm border border-zinc-200 select-all truncate">
                      https://nguyentronghuu.com/api/sse
                    </p>
                    <p className="text-[11px] text-zinc-500">Dùng dán vào ô "URL máy chủ" khi tạo Plugin mới trên ChatGPT.</p>
                  </div>

                  <div className="p-4 rounded-sm bg-zinc-50/70 border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                        <Code size={14} /> OpenAPI Schema URL (Custom GPTs)
                      </span>
                      <button 
                        onClick={() => copyToClipboard('https://nguyentronghuu.com/openapi.json', 'OpenAPI URL')}
                        className="text-xs text-zinc-600 hover:text-zinc-950 font-semibold flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <p className="font-mono text-xs text-zinc-700 bg-white p-2 rounded-sm border border-zinc-200 select-all truncate">
                      https://nguyentronghuu.com/openapi.json
                    </p>
                    <p className="text-[11px] text-zinc-500">Dùng nhập vào nút "Import from URL" khi tạo Action trong Custom GPTs.</p>
                  </div>
                </div>
              </div>

              {/* 2. MCP AVAILABLE TOOLS TABLE */}
              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="border-b border-zinc-100 pb-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-lg text-zinc-950">2. Danh Sách Công Cụ MCP Khả Dụng (Active Tools)</h4>
                    <p className="mt-0.5 text-xs text-zinc-500">Các công cụ mà ChatGPT và AI Agent có thể gọi tự động trên website.</p>
                  </div>
                  <span className="text-xs font-semibold bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-sm border border-zinc-200">
                    6 công cụ đang bật
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        <th className="pb-3 font-bold">Phân hệ</th>
                        <th className="pb-3 font-bold">Tên công cụ (Tool Name)</th>
                        <th className="pb-3 font-bold">Mô tả chức năng</th>
                        <th className="pb-3 font-bold">Phương thức</th>
                        <th className="pb-3 font-bold text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {/* BÀI VIẾT */}
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Bài viết</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <PenTool size={12} />
                          </div>
                          create_post
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Tự động nghiên cứu, viết bài chuẩn SEO, định dạng HTML và xuất bản bài viết lên blog.
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">POST /api/posts</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Bài viết</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <Library size={12} />
                          </div>
                          get_posts
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Đọc danh sách các bài viết hiện có để tham khảo dàn bài và tránh viết trùng lặp chủ đề.
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">GET /api/posts</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>

                      {/* DỰ ÁN */}
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Dự án</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <Library size={12} />
                          </div>
                          create_project
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Tự động tạo hồ sơ dự án case study (khách hàng, năm, tech stack, bối cảnh, kết quả đạt được).
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">POST /api/projects</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Dự án</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <Library size={12} />
                          </div>
                          get_projects
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Đọc danh sách các dự án case study đã triển khai trên website.
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">GET /api/projects</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>

                      {/* DỊCH VỤ */}
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Dịch vụ</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <Cpu size={12} />
                          </div>
                          create_service
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Tự động tạo gói dịch vụ giải pháp công nghệ, quy trình triển khai, deliverables và FAQ.
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">POST /api/services</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-50/50">
                        <td className="py-3.5 font-semibold text-xs text-zinc-900">Dịch vụ</td>
                        <td className="py-3.5 font-mono font-bold text-xs text-zinc-950 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center">
                            <Cpu size={12} />
                          </div>
                          get_services
                        </td>
                        <td className="py-3.5 text-xs text-zinc-600">
                          Đọc danh sách các gói dịch vụ giải pháp hiện có trên website.
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">GET /api/services</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/60">Khả dụng</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. TEST CONSOLE */}
              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <h4 className="font-serif text-lg text-zinc-950">3. Trình Thử Nghiệm Gọi MCP Trực Tiếp (Test Console)</h4>
                  <p className="mt-0.5 text-xs text-zinc-500">Mô phỏng lại cuộc gọi từ ChatGPT để kiểm tra xem Serverless Function có tạo bài viết thành công hay không.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Tiêu đề bài viết mẫu</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={testPostTitle}
                        onChange={(e) => setTestPostTitle(e.target.value)}
                        className="flex-1 rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                      />
                      <button
                        onClick={handleTestMcpPost}
                        disabled={isTestingMcp}
                        className="px-5 py-2.5 rounded-sm bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isTestingMcp ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
                        Gửi lệnh test MCP
                      </button>
                    </div>
                  </div>

                  {testResult && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Kết quả phản hồi từ Server:</span>
                      <pre className="p-4 rounded-sm bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                        {testResult}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-100 pb-6">
                <h3 className="font-serif text-xl text-zinc-950">Thông tin cơ bản</h3>
                <p className="mt-1 text-sm text-zinc-500">Sẽ được lưu trữ vào hệ thống và phục vụ các hiển thị động.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-xl shadow-black/5 ring-1 ring-zinc-200 relative group cursor-pointer">
                    <img src={avatar} alt="Avatar" width="96" height="96" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase tracking-wider">
                      {isUploading ? 'Đang tải...' : 'Đổi ảnh'}
                    </div>
                    <input 
                      type="file" 
                      onChange={handleAvatarUpload} 
                      accept="image/*"
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ảnh đại diện</span>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Họ và tên *</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Chức danh *</label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Email liên hệ *</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pl-10 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mô tả ngắn (Bio)</label>
                    <textarea 
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full resize-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-100">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* TAB: PERMISSIONS & ROLE-BASED ACCESS CONTROL (RBAC) */}
          {activeTab === 'permissions' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-sm bg-white border border-zinc-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Tài khoản</span>
                    <Users size={16} className="text-zinc-400" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.length}</p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1">Đang hoạt động</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">Super Admin</span>
                    <Shield size={16} className="text-zinc-950" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'super_admin').length}</p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1">Toàn quyền hệ thống</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">Biên tập viên</span>
                    <Edit3 size={16} className="text-zinc-950" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'editor').length}</p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1">Quản lý bài & dự án</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">CSKH / CRM</span>
                    <Users size={16} className="text-zinc-950" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'crm').length}</p>
                  <p className="text-[11px] text-zinc-500 font-medium mt-1">Chăm sóc khách hàng</p>
                </div>
              </div>

              {/* 1. DANH SÁCH TÀI KHOẢN QUẢN TRỊ */}
              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
                  <div>
                    <h3 className="font-serif text-xl text-zinc-950">Danh sách tài khoản Quản trị viên</h3>
                    <p className="mt-1 text-sm text-zinc-500">Quản lý các tài khoản được phép truy cập và phân vai trò đăng nhập vào hệ thống.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 rounded-sm bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95"
                  >
                    <UserPlus size={15} /> Thêm thành viên
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        <th className="pb-3 font-bold">Thành viên</th>
                        <th className="pb-3 font-bold">Vai trò (Role)</th>
                        <th className="pb-3 font-bold">Trạng thái</th>
                        <th className="pb-3 font-bold">Đăng nhập gần nhất</th>
                        <th className="pb-3 font-bold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-zinc-900 text-white font-serif font-bold text-xs flex items-center justify-center border border-zinc-200">
                                {user.name.split(' ').pop()?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="py-4 pr-4">
                            {user.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span> Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span> Đã khóa
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4 text-xs text-zinc-500">
                            {user.lastLogin || 'Chưa ghi nhận'}
                          </td>
                          <td className="py-4 text-right space-x-1">
                            <button 
                              onClick={() => handleToggleUserStatus(user.id)}
                              title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-sm hover:bg-zinc-100"
                            >
                              {user.status === 'active' ? <ToggleRight size={18} className="text-zinc-900" /> : <ToggleLeft size={18} className="text-zinc-400" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              title="Xóa tài khoản"
                              className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors rounded-sm hover:bg-zinc-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. MA TRẬN PHÂN QUYỀN THEO VAI TRÒ (PERMISSION MATRIX GRID) */}
              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
                  <div>
                    <h3 className="font-serif text-xl text-zinc-950">Ma trận Phân quyền Chức năng (RBAC)</h3>
                    <p className="mt-1 text-sm text-zinc-500">Tùy biến quyền hạn (Xem, Thêm, Sửa, Xóa, Xuất bản) cho từng vai trò trên từng phân hệ.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-sm border border-zinc-200/60">
                    {(['super_admin', 'editor', 'crm', 'viewer'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRoleForMatrix(r)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                          selectedRoleForMatrix === r ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/60' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {r === 'super_admin' ? 'Super Admin' : r === 'editor' ? 'Editor' : r === 'crm' ? 'CRM' : 'Viewer'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        <th className="pb-3 font-bold">Phân hệ / Module</th>
                        <th className="pb-3 font-bold text-center">Xem (View)</th>
                        <th className="pb-3 font-bold text-center">Thêm (Create)</th>
                        <th className="pb-3 font-bold text-center">Sửa (Edit)</th>
                        <th className="pb-3 font-bold text-center">Xóa (Delete)</th>
                        <th className="pb-3 font-bold text-center">Xuất bản / Export</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {(rolePermissions[selectedRoleForMatrix] || []).map((perm) => (
                        <tr key={perm.module} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-sm bg-zinc-100/90 border border-zinc-200/70 flex items-center justify-center text-zinc-700 shadow-sm">
                                {getModuleIcon(perm.module)}
                              </div>
                              <span className="font-semibold text-zinc-900 text-sm">{perm.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'view')}
                              className="group p-1 inline-flex items-center justify-center focus:outline-none"
                            >
                              {perm.view ? (
                                <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                  <Check size={13} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-sm bg-zinc-100/80 border border-zinc-200 text-zinc-300 flex items-center justify-center transition-colors group-hover:border-zinc-300">
                                  <Minus size={12} strokeWidth={2} />
                                </div>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'create')}
                              className="group p-1 inline-flex items-center justify-center focus:outline-none"
                            >
                              {perm.create ? (
                                <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                  <Check size={13} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-sm bg-zinc-100/80 border border-zinc-200 text-zinc-300 flex items-center justify-center transition-colors group-hover:border-zinc-300">
                                  <Minus size={12} strokeWidth={2} />
                                </div>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'edit')}
                              className="group p-1 inline-flex items-center justify-center focus:outline-none"
                            >
                              {perm.edit ? (
                                <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                  <Check size={13} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-sm bg-zinc-100/80 border border-zinc-200 text-zinc-300 flex items-center justify-center transition-colors group-hover:border-zinc-300">
                                  <Minus size={12} strokeWidth={2} />
                                </div>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'delete')}
                              className="group p-1 inline-flex items-center justify-center focus:outline-none"
                            >
                              {perm.delete ? (
                                <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                  <Check size={13} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-sm bg-zinc-100/80 border border-zinc-200 text-zinc-300 flex items-center justify-center transition-colors group-hover:border-zinc-300">
                                  <Minus size={12} strokeWidth={2} />
                                </div>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'publish')}
                              className="group p-1 inline-flex items-center justify-center focus:outline-none"
                            >
                              {(perm.publish || perm.export) ? (
                                <div className="w-6 h-6 rounded-sm bg-zinc-950 text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                  <Check size={13} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-sm bg-zinc-100/80 border border-zinc-200 text-zinc-300 flex items-center justify-center transition-colors group-hover:border-zinc-300">
                                  <Minus size={12} strokeWidth={2} />
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-zinc-600" /> Cấu hình phân quyền được bảo vệ an toàn trên hệ thống.
                  </span>
                  <button 
                    onClick={handleSavePermissions}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Lưu Ma Trận Phân Quyền
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-800 text-zinc-200 border border-zinc-700">
                      <Lock size={18} />
                    </div>
                    <h4 className="mb-1 font-serif text-lg">Xác thực 2 yếu tố (2FA)</h4>
                    <p className="text-sm text-zinc-400">
                      Bảo vệ tài khoản quản trị bằng mã xác nhận qua ứng dụng Authenticator (Google / Microsoft).
                    </p>
                  </div>
                  <button 
                    onClick={() => toast.success('Tính năng 2FA sẽ được kích hoạt cùng ứng dụng xác thực.')}
                    className="shrink-0 rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-95"
                  >
                    Kích hoạt 2FA
                  </button>
                </div>
              </div>

              <div className="rounded-sm border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <h4 className="font-serif text-lg text-zinc-950">Chính sách bảo mật phiên đăng nhập</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Tự động ngắt phiên đăng nhập khi không hoạt động</p>
                      <p className="text-xs text-zinc-500">Tự động đăng xuất sau 30 phút không có thao tác để phòng ngừa truy cập trái phép.</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-sm">Đang bật</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Giới hạn số lần thử đăng nhập sai (Brute-force protection)</p>
                      <p className="text-xs text-zinc-500">Tạm khóa IP 15 phút nếu nhập sai mật khẩu quá 5 lần liên tiếp.</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-sm">Đang bật</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: THÊM THÀNH VIÊN MỚI */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-sm bg-zinc-100 text-zinc-800 border border-zinc-200/60">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-zinc-950">Thêm Thành Viên Quản Trị</h3>
                  <p className="text-xs text-zinc-500">Cấp tài khoản và vai trò truy cập trang Admin</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Họ và tên *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Email đăng nhập *</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mật khẩu khởi tạo</label>
                <input 
                  type="password" 
                  placeholder="•••••••• (Tự sinh nếu để trống)"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Vai trò (Role) *</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 cursor-pointer"
                >
                  <option value="editor">Biên Tập Viên (Editor) - Quản lý Bài viết & Dự án</option>
                  <option value="crm">Chuyên Viên CRM (CRM Specialist) - Quản lý Khách hàng</option>
                  <option value="viewer">Người Xem (Viewer) - Chỉ xem báo cáo</option>
                  <option value="super_admin">Super Admin - Toàn quyền quản trị</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button 
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="rounded-sm bg-zinc-950 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-md active:scale-95"
                >
                  Thêm thành viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
