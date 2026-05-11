import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon, Type } from 'lucide-react';

export default function PostEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/posts')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-zinc-200 text-zinc-700 bg-white rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium">
            Lưu nháp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium">
            <Save size={16} />
            Xuất bản
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-6">
        <div>
          <input 
            type="text" 
            placeholder="Tiêu đề bài viết..." 
            className="w-full text-3xl font-bold font-serif text-zinc-900 placeholder:text-zinc-300 border-none focus:outline-none focus:ring-0 px-0 mb-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Chuyên mục</label>
            <select className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm">
              <option value="">Chọn chuyên mục</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="content">Content</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Ảnh bìa</label>
            <div className="w-full px-4 py-2 border border-zinc-300 rounded-lg flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 cursor-pointer transition-colors text-sm">
              <ImageIcon size={18} />
              Tải ảnh lên
            </div>
          </div>
        </div>

        {/* Mock rich text editor */}
        <div className="border border-zinc-300 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-zinc-50 border-b border-zinc-300 p-2 flex items-center gap-1 overflow-x-auto">
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><Type size={16} /></button>
            <div className="w-px h-4 bg-zinc-300 mx-1"></div>
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><Bold size={16} /></button>
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><Italic size={16} /></button>
            <div className="w-px h-4 bg-zinc-300 mx-1"></div>
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><List size={16} /></button>
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><LinkIcon size={16} /></button>
            <button className="p-2 text-zinc-600 hover:bg-zinc-200 rounded transition-colors"><ImageIcon size={16} /></button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung bài viết (có thể nhập HTML/Markdown)..."
            className="w-full min-h-[400px] p-4 text-zinc-800 text-sm focus:outline-none resize-y"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
