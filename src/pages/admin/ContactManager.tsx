import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar, CheckCircle2, Clock3, Inbox, RefreshCw, MessageSquareText } from 'lucide-react';
import toast from 'react-hot-toast';

type ContactStatus = 'all' | 'new' | 'resolved';

export default function ContactManager() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus>('all');

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async (refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setContacts(data || []);
      if (refresh) toast.success('Đã cập nhật danh sách khách hàng');
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    try {
      const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setContacts(current => current.map(contact => contact.id === id ? { ...contact, status: newStatus } : contact));
      toast.success(newStatus === 'resolved' ? 'Đã đánh dấu xử lý xong' : 'Đã chuyển về chờ xử lý');
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const searchable = `${contact.name || ''} ${contact.email || ''} ${contact.phone || ''} ${contact.message || ''}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase()) && (statusFilter === 'all' || contact.status === statusFilter);
  });
  const newCount = contacts.filter(contact => contact.status === 'new').length;
  const resolvedCount = contacts.filter(contact => contact.status === 'resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-sm border border-zinc-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-zinc-950 text-white"><Inbox size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">CRM Inbox</p>
                <h2 className="font-serif text-2xl text-zinc-950">Yêu cầu tư vấn</h2>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">Theo dõi đầy đủ nhu cầu, thông tin liên hệ và trạng thái xử lý của khách hàng gửi từ website.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            {[['Tổng', contacts.length], ['Chờ xử lý', newCount], ['Đã xử lý', resolvedCount]].map(([label, value]) => (
              <div key={String(label)} className="rounded-sm border border-zinc-100 bg-zinc-50/70 px-4 py-3">
                <p className="font-serif text-2xl text-zinc-950">{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-sm border border-zinc-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
            <input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Tìm tên, email, số điện thoại, nội dung..." className="min-h-11 w-full rounded-sm border border-zinc-200 bg-zinc-50/60 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as ContactStatus)} aria-label="Lọc khách hàng theo trạng thái" className="min-h-11 flex-1 rounded-sm border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 outline-none focus:border-amber-500 sm:flex-none">
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Chờ xử lý</option>
              <option value="resolved">Đã xử lý</option>
            </select>
            <button onClick={() => fetchContacts(true)} disabled={isRefreshing} className="flex h-11 w-11 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950 disabled:opacity-50" aria-label="Làm mới danh sách">
              <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-zinc-400"><RefreshCw className="animate-spin text-amber-500" /><p className="text-sm">Đang tải yêu cầu...</p></div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-300"><MessageSquareText size={26} /></span>
            <h3 className="mt-5 font-serif text-2xl text-zinc-950">Không tìm thấy yêu cầu</h3>
            <p className="mt-2 text-sm text-zinc-500">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredContacts.map(contact => (
              <article key={contact.id} className="grid gap-5 p-5 transition-colors hover:bg-zinc-50/60 lg:grid-cols-[minmax(190px,0.8fr)_minmax(250px,1.25fr)_minmax(190px,0.8fr)] lg:items-center lg:p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 font-serif text-sm text-white">{String(contact.name || 'K').charAt(0).toUpperCase()}</span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-zinc-950">{contact.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400"><Calendar size={12} /> {new Date(contact.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-zinc-500">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-zinc-950"><Mail size={13} /> <span className="truncate">{contact.email}</span></a>
                    {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-zinc-950"><Phone size={13} /> {contact.phone}</a>}
                  </div>
                </div>
                <div className="rounded-sm border border-zinc-100 bg-zinc-50/60 p-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">{contact.message}</p>
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${contact.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {contact.status === 'resolved' ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                    {contact.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}
                  </span>
                  <button onClick={() => updateStatus(contact.id, contact.status)} className="rounded-sm border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950">
                    {contact.status === 'resolved' ? 'Mở lại' : 'Hoàn tất'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
