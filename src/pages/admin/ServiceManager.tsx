import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter, ExternalLink, AlertCircle, Loader2, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function ServiceManager() {
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Lỗi tải danh sách dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceToDelete);
        
      if (error) throw error;
      
      toast.success('Đã xóa dịch vụ thành công');
      setServices(services.filter(s => s.id !== serviceToDelete));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Lỗi khi xóa dịch vụ');
    } finally {
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 transition-transform hover:scale-110 pointer-events-none blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-100 text-amber-600">
                <Cpu size={20} />
             </div>
             <h2 className="font-serif text-2xl text-zinc-950">Quản lý Dịch vụ</h2>
          </div>
          <p className="text-sm text-zinc-500 pl-13">Có <strong className="text-zinc-900">{services.length}</strong> dịch vụ trên hệ thống.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm dịch vụ..." 
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm transition-all"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          
          <Link 
            to="/admin/services/new"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-950 text-white rounded-sm hover:bg-amber-500 hover:text-zinc-950 transition-all text-sm font-semibold shadow-lg shadow-black/10 active:scale-95"
          >
            <Plus size={18} />
            Thêm dịch vụ
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-zinc-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Loader2 size={32} className="text-amber-500 animate-spin mb-4" />
            <p className="text-sm text-zinc-500">Đang tải dữ liệu...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
              <Cpu size={32} className="text-zinc-300" />
            </div>
            <h3 className="font-serif text-2xl text-zinc-900 mb-2">Chưa có dịch vụ nào</h3>
            <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
              Thêm các bài viết mô tả dịch vụ để khách hàng hiểu rõ hơn về giải pháp của bạn.
            </p>
            <Link 
              to="/admin/services/new"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-950 text-white rounded-sm hover:bg-amber-500 hover:text-zinc-950 transition-all text-sm font-semibold shadow-xl shadow-black/10 hover:shadow-amber-500/20 active:scale-95"
            >
              <Plus size={18} />
              Thêm dịch vụ mới
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-[0.15em] text-[10px] border-b border-zinc-100">
                  <th className="px-8 py-5">Tên Dịch vụ</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-sm border border-zinc-100 bg-zinc-50 overflow-hidden shrink-0 relative flex items-center justify-center text-zinc-400">
                          {service.cover_image ? (
                             <img src={service.cover_image} alt="" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                          ) : (
                             <Cpu size={24} />
                          )}
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-sm" />
                        </div>
                        <div className="max-w-[280px] lg:max-w-md">
                          <div className="font-semibold text-sm text-zinc-900 mb-1 truncate group-hover:text-amber-600 transition-colors">{service.title}</div>
                          <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-3">
                            <Link to={`/services/${service.slug}`} target="_blank" className="flex items-center gap-1 hover:text-zinc-900 transition-colors"><ExternalLink size={12} /> Live Preview</Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm border ${
                        service.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                      }`}>
                        {service.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/services/edit/${service.id}`} 
                          className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-400 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 shadow-sm" 
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button 
                          onClick={() => setServiceToDelete(service.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white text-zinc-400 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 shadow-sm" 
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {serviceToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-sm shadow-2xl shadow-black/20 p-6 w-full max-w-sm m-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-serif text-xl text-zinc-950">Xác nhận xóa</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-6 pl-13">
              Bạn có chắc chắn muốn xóa dịch vụ này không? Mọi dữ liệu liên quan sẽ bị xóa.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Xóa dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
