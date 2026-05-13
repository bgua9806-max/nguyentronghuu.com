import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Save, Code, Layout, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmailSettings() {
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [currentHtml, setCurrentHtml] = useState('');
  const [subject, setSubject] = useState('');
  const [templateType, setTemplateType] = useState('email_template_customer_reply');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchTemplate();
  }, [templateType]);

  const fetchTemplate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', templateType)
        .single();
        
      if (data && data.value) {
        setSubject(data.value.subject || '');
        setCurrentHtml(data.value.htmlBody || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'visual' && iframeRef.current && !isLoading) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(currentHtml);
        doc.close();
        doc.designMode = 'on';

        const style = doc.createElement('style');
        style.textContent = `
          body { font-family: sans-serif; cursor: text; padding: 16px; margin: 0; color: #18181b; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        `;
        doc.head.appendChild(style);

        const handleInput = () => {
          const docHTML = doc.body.innerHTML;
          setCurrentHtml(docHTML);
        };
        doc.body.addEventListener('input', handleInput);
        
        return () => {
          doc.body.removeEventListener('input', handleInput);
        };
      }
    }
  }, [viewMode, isLoading]); 

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { subject, htmlBody: currentHtml };
      const { error } = await supabase
        .from('system_settings')
        .upsert({ key: templateType, value: payload });

      if (error) throw error;
      toast.success('Đã lưu cấu hình Email');
    } catch (error) {
      toast.error('Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-none space-y-6 animate-in fade-in duration-500 pb-28">
      <div className="flex justify-between items-center">
         <div>
           <h2 className="font-serif text-3xl text-zinc-950">Quản trị Email Động</h2>
           <p className="mt-1 text-sm text-zinc-500">Thiết kế mẫu email tự động gửi cho khách hàng</p>
         </div>
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="flex items-center gap-2 rounded-sm bg-zinc-950 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 disabled:opacity-50"
         >
           {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
           Lưu cấu hình
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Editor Area */}
        <div className="bg-white border border-zinc-200 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
           <div className="flex justify-between items-center bg-zinc-50 border-b border-zinc-200 px-4 py-3">
             <select 
               value={templateType} 
               onChange={(e) => setTemplateType(e.target.value)}
               className="bg-white border border-zinc-200 rounded-sm px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-amber-500"
             >
               <option value="email_template_customer_reply">Thư Cảm ơn (Gửi Khách)</option>
               <option value="email_template_admin_contact">Thông báo (Gửi Admin)</option>
             </select>
             
             <div className="flex bg-zinc-200/50 p-1 rounded-sm">
               <button 
                 onClick={() => setViewMode('visual')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${viewMode === 'visual' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
               >
                 <Layout size={14} /> Trực quan
               </button>
               <button 
                 onClick={() => setViewMode('code')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${viewMode === 'code' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
               >
                 <Code size={14} /> Mã HTML
               </button>
             </div>
           </div>

           <div className="p-6 space-y-4 flex-1 flex flex-col">
             <div className="space-y-1">
               <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tiêu đề Email (Subject)</label>
               <input 
                 type="text" 
                 value={subject}
                 onChange={(e) => setSubject(e.target.value)}
                 className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-amber-500 text-lg font-medium"
                 placeholder="Nhập tiêu đề email..."
               />
             </div>

             <div className="flex-1 min-h-[400px] border border-zinc-200 rounded-sm overflow-hidden mt-4">
               {isLoading ? (
                 <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                   <Loader2 className="animate-spin text-zinc-400" size={24} />
                 </div>
               ) : viewMode === 'visual' ? (
                 <iframe 
                   ref={iframeRef}
                   className="w-full min-h-[400px] bg-white border-none"
                   title="Visual Editor"
                 />
               ) : (
                 <textarea 
                   value={currentHtml}
                   onChange={(e) => setCurrentHtml(e.target.value)}
                   className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-zinc-950 text-emerald-400 resize-none focus:outline-none"
                   placeholder="Nhập mã HTML..."
                 />
               )}
             </div>
           </div>
        </div>

        {/* Instructions Sidebar */}
        <div className="space-y-6">
           <div className="bg-zinc-950 text-white p-6 rounded-sm shadow-xl">
             <h3 className="font-serif text-lg mb-4 text-amber-400 flex items-center gap-2"><Mail size={18}/> Biến Số Khả Dụng</h3>
             <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Bạn có thể chèn các biến số này vào Tiêu đề hoặc Nội dung thư. Hệ thống sẽ tự động thay thế bằng dữ liệu thật khi gửi.</p>
             <ul className="space-y-3 font-mono text-xs">
               <li className="flex justify-between border-b border-white/10 pb-2"><span className="text-emerald-400">{`{{name}}`}</span> <span className="text-zinc-500">Tên khách</span></li>
               <li className="flex justify-between border-b border-white/10 pb-2"><span className="text-emerald-400">{`{{email}}`}</span> <span className="text-zinc-500">Email khách</span></li>
               <li className="flex justify-between border-b border-white/10 pb-2"><span className="text-emerald-400">{`{{phone}}`}</span> <span className="text-zinc-500">SĐT khách</span></li>
               <li className="flex justify-between"><span className="text-emerald-400">{`{{message}}`}</span> <span className="text-zinc-500">Nội dung tin nhắn</span></li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
