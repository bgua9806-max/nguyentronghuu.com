import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Globe, Sparkles, Shield, Mail, Loader2, Save, 
  ImageIcon, Users, UserPlus, Check, X, ShieldAlert, Key, Edit3, 
  Trash2, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Eye, EyeOff
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
  icon: string;
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
    { module: 'dashboard', name: 'Dashboard & Báo cáo', icon: '📊', view: true, create: true, edit: true, delete: true, export: true },
    { module: 'posts', name: 'Quản lý Bài viết', icon: '✍️', view: true, create: true, edit: true, delete: true, publish: true },
    { module: 'projects', name: 'Quản lý Dự án', icon: '💼', view: true, create: true, edit: true, delete: true },
    { module: 'services', name: 'Quản lý Dịch vụ', icon: '⚙️', view: true, create: true, edit: true, delete: true },
    { module: 'contacts', name: 'Khách hàng & CRM', icon: '👥', view: true, create: true, edit: true, delete: true, export: true },
    { module: 'email', name: 'Cấu hình Email Marketing', icon: '✉️', view: true, create: true, edit: true, delete: true },
    { module: 'settings', name: 'Cài đặt & Phân quyền', icon: '🛡️', view: true, create: true, edit: true, delete: true }
  ],
  editor: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', icon: '📊', view: true, create: false, edit: false, delete: false, export: false },
    { module: 'posts', name: 'Quản lý Bài viết', icon: '✍️', view: true, create: true, edit: true, delete: true, publish: true },
    { module: 'projects', name: 'Quản lý Dự án', icon: '💼', view: true, create: true, edit: true, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', icon: '⚙️', view: true, create: true, edit: true, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', icon: '👥', view: false, create: false, edit: false, delete: false, export: false },
    { module: 'email', name: 'Cấu hình Email Marketing', icon: '✉️', view: false, create: false, edit: false, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', icon: '🛡️', view: false, create: false, edit: false, delete: false }
  ],
  crm: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', icon: '📊', view: true, create: false, edit: false, delete: false, export: true },
    { module: 'posts', name: 'Quản lý Bài viết', icon: '✍️', view: false, create: false, edit: false, delete: false, publish: false },
    { module: 'projects', name: 'Quản lý Dự án', icon: '💼', view: false, create: false, edit: false, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', icon: '⚙️', view: false, create: false, edit: false, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', icon: '👥', view: true, create: true, edit: true, delete: false, export: true },
    { module: 'email', name: 'Cấu hình Email Marketing', icon: '✉️', view: true, create: false, edit: true, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', icon: '🛡️', view: false, create: false, edit: false, delete: false }
  ],
  viewer: [
    { module: 'dashboard', name: 'Dashboard & Báo cáo', icon: '📊', view: true, create: false, edit: false, delete: false, export: false },
    { module: 'posts', name: 'Quản lý Bài viết', icon: '✍️', view: true, create: false, edit: false, delete: false, publish: false },
    { module: 'projects', name: 'Quản lý Dự án', icon: '💼', view: true, create: false, edit: false, delete: false },
    { module: 'services', name: 'Quản lý Dịch vụ', icon: '⚙️', view: true, create: false, edit: false, delete: false },
    { module: 'contacts', name: 'Khách hàng & CRM', icon: '👥', view: false, create: false, edit: false, delete: false, export: false },
    { module: 'email', name: 'Cấu hình Email Marketing', icon: '✉️', view: false, create: false, edit: false, delete: false },
    { module: 'settings', name: 'Cài đặt & Phân quyền', icon: '🛡️', view: false, create: false, edit: false, delete: false }
  ]
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'security'>('profile');
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
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20"><Shield size={12} /> Super Admin</span>;
      case 'editor':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20"><Edit3 size={12} /> Editor</span>;
      case 'crm':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"><Users size={12} /> CRM Specialist</span>;
      case 'viewer':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-600 border border-zinc-500/20"><Eye size={12} /> Viewer</span>;
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
          <h2 className="font-serif text-3xl text-zinc-950">Cài đặt Hệ thống</h2>
          <p className="mt-1 text-sm text-zinc-500">Quản lý cấu hình, phân quyền truy cập và bảo mật trang quản trị</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <nav className="flex flex-col gap-2 sticky top-28">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-bold text-left transition-all ${activeTab === 'profile' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <User size={18} className={activeTab === 'profile' ? 'text-amber-500' : 'text-zinc-400'} />
              Hồ sơ cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-bold text-left transition-all ${activeTab === 'permissions' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <ShieldAlert size={18} className={activeTab === 'permissions' ? 'text-amber-500' : 'text-zinc-400'} />
              Phân quyền & Tài khoản
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-bold text-left transition-all ${activeTab === 'security' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <Lock size={18} className={activeTab === 'security' ? 'text-amber-500' : 'text-zinc-400'} />
              Bảo mật (2FA)
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-8 lg:col-span-9">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-8 animate-in fade-in duration-300">
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
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Chức danh *</label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
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
                        className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pl-10 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
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
                      className="w-full resize-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-100">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PERMISSIONS & ROLE-BASED ACCESS CONTROL (RBAC) */}
          {activeTab === 'permissions' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-sm bg-white border border-zinc-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tài khoản</span>
                    <Users size={18} className="text-zinc-400" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.length}</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">Đang hoạt động</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Super Admin</span>
                    <Shield size={18} className="text-amber-500" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'super_admin').length}</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">Toàn quyền hệ thống</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Biên tập viên</span>
                    <Edit3 size={18} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'editor').length}</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">Quản lý bài & dự án</p>
                </div>
                <div className="p-5 rounded-sm bg-white border border-zinc-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">CSKH / CRM</span>
                    <Sparkles size={18} className="text-emerald-500" />
                  </div>
                  <p className="text-2xl font-serif text-zinc-950 mt-2">{adminUsers.filter(u => u.role === 'crm').length}</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">Chăm sóc khách hàng</p>
                </div>
              </div>

              {/* 1. DANH SÁCH TÀI KHOẢN QUẢN TRỊ */}
              <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
                  <div>
                    <h3 className="font-serif text-xl text-zinc-950">Danh sách tài khoản Quản trị viên</h3>
                    <p className="mt-1 text-sm text-zinc-500">Quản lý các tài khoản được phép truy cập và phân vai trò đăng nhập vào hệ thống.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 rounded-sm bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95"
                  >
                    <UserPlus size={16} /> Thêm thành viên
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
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
                              <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-serif font-bold text-xs flex items-center justify-center border border-zinc-200">
                                {user.name.split(' ').pop()?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="py-4 pr-4">
                            {user.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Đã khóa
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4 text-xs text-zinc-500">
                            {user.lastLogin || 'Chưa ghi nhận'}
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <button 
                              onClick={() => handleToggleUserStatus(user.id)}
                              title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              className="p-1.5 text-zinc-400 hover:text-amber-600 transition-colors rounded-sm hover:bg-zinc-100"
                            >
                              {user.status === 'active' ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} className="text-zinc-400" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              title="Xóa tài khoản"
                              className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors rounded-sm hover:bg-zinc-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. MA TRẬN PHÂN QUYỀN THEO VAI TRÒ (PERMISSION MATRIX GRID) */}
              <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-6">
                  <div>
                    <h3 className="font-serif text-xl text-zinc-950">Ma trận Phân quyền Chức năng (RBAC)</h3>
                    <p className="mt-1 text-sm text-zinc-500">Tùy biến quyền hạn (Xem, Thêm, Sửa, Xóa, Xuất bản) cho từng vai trò trên từng phân hệ.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-sm">
                    {(['super_admin', 'editor', 'crm', 'viewer'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRoleForMatrix(r)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all ${
                          selectedRoleForMatrix === r ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
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
                      <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
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
                          <td className="py-3.5 pr-4 font-semibold text-zinc-900 flex items-center gap-2.5">
                            <span className="text-base">{perm.icon}</span>
                            {perm.name}
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'view')}
                              className={`p-1 rounded transition-colors ${perm.view ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                            >
                              <Check size={16} />
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'create')}
                              className={`p-1 rounded transition-colors ${perm.create ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                            >
                              <Check size={16} />
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'edit')}
                              className={`p-1 rounded transition-colors ${perm.edit ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                            >
                              <Check size={16} />
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'delete')}
                              className={`p-1 rounded transition-colors ${perm.delete ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                            >
                              <Check size={16} />
                            </button>
                          </td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleTogglePermission(selectedRoleForMatrix, perm.module, 'publish')}
                              className={`p-1 rounded transition-colors ${(perm.publish || perm.export) ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                            >
                              <Check size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Cấu hình phân quyền được bảo vệ an toàn trên hệ thống.
                  </span>
                  <button 
                    onClick={handleSavePermissions}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Lưu Ma Trận Phân Quyền
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400">
                      <Lock size={20} />
                    </div>
                    <h4 className="mb-1 font-serif text-lg">Xác thực 2 yếu tố (2FA)</h4>
                    <p className="text-sm text-zinc-400">
                      Bảo vệ tài khoản quản trị bằng mã xác nhận qua ứng dụng Authenticator (Google / Microsoft).
                    </p>
                  </div>
                  <button 
                    onClick={() => toast.success('Tính năng 2FA sẽ được kích hoạt cùng ứng dụng xác thực.')}
                    className="shrink-0 rounded-sm bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-95"
                  >
                    Kích hoạt 2FA
                  </button>
                </div>
              </div>

              <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
                <h4 className="font-serif text-lg text-zinc-950">Chính sách bảo mật phiên đăng nhập</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Tự động ngắt phiên đăng nhập khi không hoạt động</p>
                      <p className="text-xs text-zinc-500">Tự động đăng xuất sau 30 phút không có thao tác để phòng ngừa truy cập trái phép.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Đang bật</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Giới hạn số lần thử đăng nhập sai (Brute-force protection)</p>
                      <p className="text-xs text-zinc-500">Tạm khóa IP 15 phút nếu nhập sai mật khẩu quá 5 lần liên tiếp.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Đang bật</span>
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
                <div className="p-2 rounded bg-amber-500/10 text-amber-600">
                  <UserPlus size={20} />
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
                <X size={20} />
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
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
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
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mật khẩu khởi tạo</label>
                <input 
                  type="password" 
                  placeholder="•••••••• (Tự sinh nếu để trống)"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Vai trò (Role) *</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
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
                  className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="rounded-sm bg-zinc-950 px-5 py-2 text-xs font-bold text-white hover:bg-amber-500 hover:text-zinc-950 transition-all shadow-md active:scale-95"
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

