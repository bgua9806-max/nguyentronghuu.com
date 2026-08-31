import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import logoUrl from '../../assets/images/logo3.webp';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setIsChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setHasSession(true);
      setIsChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error('Mật khẩu mới cần có ít nhất 8 ký tự.');
      return;
    }
    if (password !== confirmation) {
      toast.error('Hai mật khẩu chưa trùng khớp.');
      return;
    }
    try {
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Đã cập nhật mật khẩu. Vui lòng đăng nhập lại.');
      await supabase.auth.signOut();
      navigate('/admin/login', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật mật khẩu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-24">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <img src={logoUrl} alt="Nguyễn Trọng Hữu" className="mx-auto h-10 w-auto invert brightness-125" />
        {isChecking ? (
          <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-amber-400" /></div>
        ) : !hasSession ? (
          <div className="py-10 text-center">
            <LockKeyhole className="mx-auto text-zinc-500" size={34} />
            <h1 className="mt-5 font-serif text-2xl text-white">Liên kết không còn hiệu lực</h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">Hãy yêu cầu một email khôi phục mật khẩu mới từ trang đăng nhập.</p>
            <Link to="/admin/login" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-zinc-950 hover:bg-amber-400">Về trang đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="text-center">
              <CheckCircle2 className="mx-auto text-emerald-400" size={32} />
              <h1 className="mt-4 font-serif text-2xl text-white">Tạo mật khẩu mới</h1>
              <p className="mt-2 text-sm text-zinc-500">Dùng tối thiểu 8 ký tự và không dùng lại mật khẩu cũ.</p>
            </div>
            <div>
              <label htmlFor="new-password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Mật khẩu mới</label>
              <div className="relative mt-2">
                <input id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 pr-12 text-sm text-white outline-none focus:border-amber-400" required />
                <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nhập lại mật khẩu</label>
              <input id="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 text-sm text-white outline-none focus:border-amber-400" required />
            </div>
            <button disabled={isSaving} className="flex min-h-13 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-zinc-950 transition hover:bg-amber-400 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" size={17} /> : 'Cập nhật mật khẩu'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
