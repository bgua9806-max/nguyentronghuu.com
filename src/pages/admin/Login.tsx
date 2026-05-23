import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import logoUrl from '../../assets/images/logo3.webp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect to admin if session already exists
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success('Đăng nhập thành công!');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Sai tài khoản hoặc mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-sm p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <img 
              src={logoUrl} 
              alt="Hữu Logo" 
              width="152"
              height="46"
              className="h-10 w-auto object-contain mb-4 invert brightness-125"
            />
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
              Hệ thống Quản trị 
              <Sparkles size={12} className="text-amber-500" />
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email đăng nhập</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none transition-colors text-sm"
                  placeholder="admin@example.com"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mật khẩu</label>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none transition-colors text-sm"
                  placeholder="••••••••"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-bold py-3.5 rounded-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98] group mt-8 shadow-lg shadow-black/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-zinc-500" />
                  <span className="text-xs uppercase tracking-widest">Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-widest">Đăng nhập</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Nguyễn Trọng Hữu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
