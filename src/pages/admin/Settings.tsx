import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Sparkles, Shield, Mail, Loader2, Save, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile states
  const [name, setName] = useState('Nguyễn Trọng Hữu');
  const [title, setTitle] = useState('Senior AI Agent Engineer');
  const [email, setEmail] = useState('contact@nguyentronghuu.com');
  const [bio, setBio] = useState('Chuyên gia xây dựng hệ thống tự động hóa và AI Agent đa nền tảng, giúp doanh nghiệp tối ưu nguồn lực và mở rộng quy mô kinh doanh không giới hạn.');
  const [avatar, setAvatar] = useState('https://cdn.phototourl.com/free/2026-05-06-91632c77-a912-4327-9ae1-09b5b48abb43.png');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfileSettings();
  }, []);

  const fetchProfileSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'profile_settings')
        .single();

      if (data && data.value) {
        setName(data.value.name || '');
        setTitle(data.value.title || '');
        setEmail(data.value.email || '');
        setBio(data.value.bio || '');
        setAvatar(data.value.avatar || '');
      }
    } catch (error) {
      console.warn('No custom profile settings found, using default values.');
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
          <p className="mt-1 text-sm text-zinc-500">Quản lý cấu hình, bảo mật và hồ sơ cá nhân</p>
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
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-bold text-left transition-all ${activeTab === 'security' ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'}`}
            >
              <Shield size={18} className={activeTab === 'security' ? 'text-amber-500' : 'text-zinc-400'} />
              Bảo mật (2FA)
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-8 lg:col-span-9">
          {activeTab === 'profile' ? (
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
          ) : (
            <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20 animate-in fade-in duration-300">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400">
                    <Lock size={20} />
                  </div>
                  <h4 className="mb-1 font-serif text-lg">Xác thực 2 yếu tố (2FA)</h4>
                  <p className="text-sm text-zinc-400">
                    Bảo vệ tài khoản quản trị bằng mã xác nhận qua ứng dụng Authenticator (Google/Microsoft).
                  </p>
                </div>
                <button 
                  onClick={() => toast.success('Tính năng 2FA sẽ được bật sau khi đồng bộ cấu hình ứng dụng xác thực.')}
                  className="shrink-0 rounded-sm bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-95"
                >
                  Kích hoạt 2FA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
