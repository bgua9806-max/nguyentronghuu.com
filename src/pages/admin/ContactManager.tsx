import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactManager() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-zinc-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-sm font-semibold text-zinc-600">
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Liên hệ</th>
              <th className="p-4">Nội dung / Tin nhắn</th>
              <th className="p-4">Ngày gửi</th>
              <th className="p-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">Chưa có khách hàng nào liên hệ.</td>
              </tr>
            ) : contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-zinc-900">{contact.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-zinc-600 flex items-center gap-2 mb-1">
                    <Mail size={14} /> {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="text-sm text-zinc-600 flex items-center gap-2">
                      <Phone size={14} /> {contact.phone}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <p className="text-sm text-zinc-700 max-w-xs line-clamp-2" title={contact.message}>{contact.message}</p>
                </td>
                <td className="p-4">
                  <div className="text-sm text-zinc-600 flex items-center gap-2">
                    <Calendar size={14} /> {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => updateStatus(contact.id, contact.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      contact.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {contact.status === 'resolved' ? <><CheckCircle size={14}/> Đã xử lý</> : <><Clock size={14}/> Chờ xử lý</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
