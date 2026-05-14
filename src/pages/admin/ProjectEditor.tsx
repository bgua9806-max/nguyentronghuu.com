import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon, Type, Eye, Globe, Hash, Sparkles, ArrowDownRight, X, ExternalLink, Calendar, Copy, Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function ProjectEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [link, setLink] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [category, setCategory] = useState('Website');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('completed');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const executeCommand = (command: string, value?: string) => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      doc.execCommand(command, false, value);
      setContent(doc.body.innerHTML);
      iframeRef.current?.contentWindow?.focus();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingImage(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        executeCommand('insertImage', data.publicUrl);
      }
      toast.success(`Đã tải ${files.length} ảnh lên!`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_cover.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setCoverImage(data.publicUrl);
      toast.success('Đã tải ảnh đại diện lên thành công!');
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Lỗi khi tải ảnh đại diện lên');
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Initialize WYSIWYG iframe
  useEffect(() => {
    if (iframeRef.current && !isLoading) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(content || '<p><br></p>');
        doc.close();
        doc.designMode = 'on';
        const style = doc.createElement('style');
        style.textContent = `
          body { font-family: ui-sans-serif, system-ui, sans-serif; cursor: text; padding: 16px; margin: 0; color: #3f3f46; font-size: 1.125rem; line-height: 1.75; }
          img { max-width: 100%; border-radius: 4px; cursor: pointer; transition: outline 0.15s; }
          img:hover { outline: 2px solid #f59e0b; outline-offset: 2px; }
          img.selected-img { outline: 3px solid #f59e0b; outline-offset: 3px; }
          h1,h2,h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-family: ui-serif, Georgia, serif; }
          p { margin-bottom: 1em; } a { color: #d97706; text-decoration: underline; }
          ul,ol { padding-left: 20px; margin-bottom: 1em; }
          .img-toolbar { position:absolute; display:flex; gap:4px; flex-wrap:wrap; max-width:320px; background:#18181b; padding:6px 8px; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,.3); z-index:999; }
          .img-toolbar button { background:transparent; border:1px solid #3f3f46; color:#fff; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer; transition:all .15s; }
          .img-toolbar button:hover { background:#f59e0b; color:#18181b; border-color:#f59e0b; }
          .img-toolbar .tb-label { color:#a1a1aa; font-size:9px; font-weight:700; text-transform:uppercase; width:100%; padding:2px 2px 0; }
          .img-grid { display:flex; gap:8px; margin:16px 0; }
          .img-grid img { flex:1; min-width:0; margin:0; object-fit:cover; height:auto; }
        `;
        doc.head.appendChild(style);

        // Image click toolbar
        doc.addEventListener('click', (e: any) => {
          const old = doc.querySelector('.img-toolbar'); if (old) old.remove();
          doc.querySelectorAll('.selected-img').forEach((i: any) => i.classList.remove('selected-img'));
          const t = e.target as HTMLElement;
          if (t.tagName === 'IMG') {
            t.classList.add('selected-img');
            const tb = doc.createElement('div'); tb.className = 'img-toolbar'; tb.contentEditable = 'false';
            const sl = doc.createElement('span'); sl.className = 'tb-label'; sl.textContent = 'Kích thước'; tb.appendChild(sl);
            ['25%','50%','75%','100%'].forEach(s => { const b = doc.createElement('button'); b.textContent = s; b.addEventListener('click', (ev: any) => { ev.stopPropagation(); (t as HTMLImageElement).style.width = s; (t as HTMLImageElement).style.height = 'auto'; tb.remove(); t.classList.remove('selected-img'); setContent(doc.body.innerHTML); }); tb.appendChild(b); });
            const ll = doc.createElement('span'); ll.className = 'tb-label'; ll.textContent = 'Bố cục'; tb.appendChild(ll);
            [2,3,4].forEach(cols => { const b = doc.createElement('button'); b.textContent = `${cols} cột`; b.addEventListener('click', (ev: any) => { ev.stopPropagation(); tb.remove(); /* grid logic */ const parent = t.parentElement!; const imgs: HTMLElement[] = []; let node: any = t; while(node.previousElementSibling) { const p = node.previousElementSibling; if(p.tagName==='IMG'){imgs.unshift(p);node=p;} else break; } imgs.push(t); node=t; while(node.nextElementSibling) { const n = node.nextElementSibling; if(n.tagName==='IMG'){imgs.push(n);node=n;} else break; } const grid = doc.createElement('div'); grid.className='img-grid'; grid.contentEditable='false'; const use = imgs.slice(0,cols); const first = use[0]; parent.insertBefore(grid, first); use.forEach(img => { img.remove(); (img as HTMLImageElement).style.width=''; img.classList.remove('selected-img'); grid.appendChild(img); }); setContent(doc.body.innerHTML); }); tb.appendChild(b); });
            const db = doc.createElement('button'); db.textContent = 'Xóa'; db.style.borderColor = '#ef4444'; db.style.color = '#fca5a5'; db.addEventListener('click', (ev: any) => { ev.stopPropagation(); t.remove(); tb.remove(); setContent(doc.body.innerHTML); }); tb.appendChild(db);
            tb.style.top = `${t.offsetTop - 70}px`; tb.style.left = `${t.offsetLeft}px`; t.parentElement?.insertBefore(tb, t);
          }
        });

        const handleInput = () => setContent(doc.body.innerHTML);
        doc.body.addEventListener('input', handleInput);
        const handleKeydown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.key === 'z') { e.preventDefault(); doc.execCommand('undo'); setContent(doc.body.innerHTML); }
          if (e.ctrlKey && e.key === 'y') { e.preventDefault(); doc.execCommand('redo'); setContent(doc.body.innerHTML); }
        };
        doc.addEventListener('keydown', handleKeydown);

        const handlePaste = (e: ClipboardEvent) => {
          e.preventDefault();
          const html = e.clipboardData?.getData('text/html');
          const text = e.clipboardData?.getData('text/plain');

          if (html) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.replace(/<!--[\s\S]*?-->/g, '');

            const cleanNode = (node: any) => {
              if (node.nodeType === 3) return; 
              if (node.nodeType === 1) {
                const tag = node.tagName.toLowerCase();
                
                const keepAttrs = ['href', 'src', 'alt'];
                const attrsToKeep: Record<string, string> = {};
                
                let isBold = false;
                let isItalic = false;
                
                if (node.style) {
                   const fw = node.style.fontWeight;
                   const fs = node.style.fontStyle;
                   if (fw === 'bold' || fw === '700' || fw === '800' || fw === '900') isBold = true;
                   if (fs === 'italic') isItalic = true;
                }

                keepAttrs.forEach(attr => {
                  if (node.hasAttribute(attr)) {
                    attrsToKeep[attr] = node.getAttribute(attr);
                  }
                });

                while (node.attributes.length > 0) {
                  node.removeAttribute(node.attributes[0].name);
                }

                Object.keys(attrsToKeep).forEach(attr => {
                  node.setAttribute(attr, attrsToKeep[attr]);
                });

                if (['span', 'meta', 'font', 'style', 'script'].includes(tag)) {
                   if (['style', 'script', 'meta'].includes(tag)) {
                      node.remove();
                      return;
                   }
                   if (isBold) {
                      const strong = document.createElement('strong');
                      strong.innerHTML = node.innerHTML;
                      node.replaceWith(strong);
                      node = strong;
                   } else if (isItalic) {
                      const em = document.createElement('em');
                      em.innerHTML = node.innerHTML;
                      node.replaceWith(em);
                      node = em;
                   } else {
                      const fragment = document.createDocumentFragment();
                      while (node.firstChild) {
                        fragment.appendChild(node.firstChild);
                      }
                      node.replaceWith(fragment);
                      return;
                   }
                }

                Array.from(node.childNodes).forEach(cleanNode);
              }
            };

            Array.from(tempDiv.childNodes).forEach(cleanNode);

            const emptyP = tempDiv.querySelectorAll('p:empty, h1:empty, h2:empty, h3:empty');
            emptyP.forEach((el: any) => el.remove());

            doc.execCommand('insertHTML', false, tempDiv.innerHTML);
          } else if (text) {
            const paragraphs = text.split('\n').map(p => p.trim()).filter(p => p !== '').map(p => `<p>${p}</p>`).join('');
            doc.execCommand('insertHTML', false, paragraphs);
          }
        };
        doc.addEventListener('paste', handlePaste);

        return () => { doc.body.removeEventListener('input', handleInput); doc.removeEventListener('keydown', handleKeydown); doc.removeEventListener('paste', handlePaste); };
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (title && !id && !slug) {
      setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  }, [title]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setClient(data.client || '');
        setYear(data.year || '');
        setLink(data.link || '');
        setContent(data.content || '');
        setSeoTitle(data.seo_title || '');
        setSeoDesc(data.seo_description || '');
        setCategory(data.category || 'Website');
        setCoverImage(data.cover_image || '');
        setStatus(data.status || 'completed');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Không thể tải dữ liệu dự án');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên dự án');
      return;
    }
    
    try {
      setIsSaving(true);
      const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const projectData = {
        title,
        slug: finalSlug,
        client,
        year,
        link,
        content,
        seo_title: seoTitle,
        seo_description: seoDesc,
        category,
        cover_image: coverImage,
        status,
        updated_at: new Date().toISOString()
      };

      let error;
      if (id) {
        const { error: updateError } = await supabase.from('projects').update(projectData).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert([projectData]);
        error = insertError;
      }

      if (error) {
        if (error.code === '23505') throw new Error('Đường dẫn (slug) đã tồn tại. Vui lòng sửa lại đường dẫn.');
        throw error;
      }
      
      // Tự động ping Google Indexing API nếu trạng thái là completed
      if (status === 'completed') {
        try {
          fetch('/api/request-indexing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: `https://nguyentronghuu.com/projects/${finalSlug}` })
          }).catch(err => console.error('Lỗi khi gọi Indexing API:', err));
        } catch (e) {
          console.error(e);
        }
      }
      
      toast.success(id ? 'Đã cập nhật dự án' : 'Đã tạo dự án mới');
      if (!id) navigate('/admin/projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu dự án');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải dữ liệu dự án...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Top Header Actions */}
      <div className="sticky top-0 z-30 -mx-4 flex items-center justify-between border-b border-white/40 bg-[#f7f4ef]/80 px-4 py-4 backdrop-blur-2xl sm:px-0 sm:mx-0 sm:bg-[#f7f4ef]/90">
        <button 
          onClick={() => navigate('/admin/projects')}
          className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white shadow-sm transition-all group-hover:-translate-x-0.5 group-hover:border-zinc-300">
            <ArrowLeft size={16} />
          </div>
          Quay lại
        </button>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3 sm:px-4 py-2 text-sm font-bold text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-950 active:scale-95"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-sm bg-zinc-950 px-4 sm:px-6 py-2 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">Lưu Dự án</span>
            <span className="sm:hidden">Lưu</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Editor Area */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            {/* Title Input & Slug */}
            <div>
              <textarea 
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên dự án hoặc Case Study..." 
                className="w-full resize-none border-none p-0 font-serif text-3xl sm:text-4xl font-bold leading-tight text-zinc-950 placeholder:text-zinc-200 focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-2 text-sm mt-3 text-zinc-500">
                <span className="font-medium hidden sm:inline">nguyentronghuu.com/projects/</span>
                <span className="font-medium sm:hidden">.../projects/</span>
                <input 
                  type="text" 
                  value={slug}
                  className="bg-transparent border-b border-zinc-300 focus:border-amber-500 focus:outline-none text-zinc-900 flex-1 py-1 transition-colors"
                  placeholder="duong-dan-du-an"
                  onChange={(e) => setSlug(e.target.value)}
                />
                <button className="p-1.5 hover:bg-zinc-100 rounded-sm transition-colors text-zinc-400" title="Copy link">
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-zinc-100" />

            {/* Project specific inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Khách hàng / Đối tác</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Tên công ty / Brand..."
                    className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                  />
                  <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Link sản phẩm (Live)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                  />
                  <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-zinc-100" />

            {/* WYSIWYG Toolbar */}
            <div className="space-y-4">
              <div className="sticky top-20 z-10 flex items-center gap-1 overflow-x-auto rounded-sm border border-zinc-200 bg-white/80 p-2 backdrop-blur-md shadow-sm">
                <button onClick={() => executeCommand('formatBlock', 'H3')} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Tiêu đề"><Type size={18} /></button>
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button onClick={() => executeCommand('bold')} className="rounded-sm p-2 font-bold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="In đậm"><Bold size={18} /></button>
                <button onClick={() => executeCommand('italic')} className="rounded-sm p-2 italic text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="In nghiêng"><Italic size={18} /></button>
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button onClick={() => executeCommand('insertUnorderedList')} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Danh sách"><List size={18} /></button>
                <button onClick={() => { const url = prompt('Nhập link:'); if(url) executeCommand('createLink', url); }} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Chèn liên kết"><LinkIcon size={18} /></button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} className={`rounded-sm p-2 transition-all ${isUploadingImage ? 'text-amber-500 animate-pulse' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'}`} title="Tải ảnh lên">
                  {isUploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                </button>
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button className="flex items-center gap-2 rounded-sm bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600 transition-all hover:bg-amber-100">
                  <Sparkles size={14} />
                  AI Writing
                </button>
              </div>
              
              <iframe ref={iframeRef} title="Visual Editor" className="min-h-[400px] w-full border border-zinc-200 rounded-sm bg-zinc-50/50" />
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={20} className="text-zinc-400" />
              <h3 className="font-serif text-xl text-zinc-950">Cấu hình SEO</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">SEO Title</label>
                   <span className="text-[10px] text-zinc-400">0 / 60 ký tự</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm..."
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Meta Description</label>
                   <span className="text-[10px] text-zinc-400">0 / 160 ký tự</span>
                </div>
                <textarea 
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Mô tả ngắn gọn dự án để thu hút click..."
                  className="w-full resize-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              {/* Google Search Preview */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-4">Google Preview</label>
                <div className="bg-white border border-zinc-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold font-serif text-zinc-900 border border-zinc-200">H</div>
                     <div className="flex flex-col">
                       <span className="text-xs text-zinc-900 font-medium">Nguyễn Trọng Hữu</span>
                       <span className="text-[10px] text-zinc-500">https://nguyentronghuu.com › projects › {slug || 'ten-du-an'}</span>
                     </div>
                   </div>
                   <h4 className="text-[#1a0dab] text-lg cursor-pointer hover:underline truncate mb-1">{seoTitle || title || 'Dự án: ' + title}</h4>
                   <p className="text-sm text-[#4d5156] line-clamp-2">{seoDesc || 'Case study triển khai dự án...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6 lg:col-span-4">

          {/* Publishing Settings */}
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <h3 className="font-serif text-xl text-zinc-950">Phân loại Dự án</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Lĩnh vực</label>
                <div className="relative">
                   <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pr-10 text-sm font-medium transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10">
                     <option value="Automation">Automation</option>
                     <option value="AI Chatbot">AI Chatbot</option>
                     <option value="ERP/System">Hệ thống (ERP/CRM)</option>
                     <option value="Website">Website</option>
                     <option value="E-Commerce / Social Media">E-Commerce / Social Media</option>
                     <option value="Editorial / Content Marketing">Content Marketing</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400">
                      <ArrowDownRight size={16} />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Năm triển khai</label>
                <div className="relative">
                   <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full appearance-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pr-10 text-sm font-medium transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10">
                     <option value="2026">2026</option>
                     <option value="2025">2025</option>
                     <option value="2024">2024</option>
                     <option value="2023">2023</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400">
                      <ArrowDownRight size={16} />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Tech Stack (Tags)</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-sm bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    #React <button className="hover:text-red-500 ml-1">&times;</button>
                  </span>
                  <span className="flex items-center gap-1 rounded-sm bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    #NodeJS <button className="hover:text-red-500 ml-1">&times;</button>
                  </span>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Nhập và ấn Enter..."
                    className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                  />
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Ảnh Thumbnail</label>
                <div className="group relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-400 transition-all focus-within:border-amber-400 focus-within:bg-amber-50/50">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      {isUploadingCover ? <Loader2 size={32} className="animate-spin text-amber-500" /> : <ImageIcon size={32} strokeWidth={1.5} className="group-focus-within:text-amber-500 transition-colors" />}
                    </div>
                  )}
                  <input 
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Dán URL ảnh hoặc click upload..."
                    className="absolute bottom-4 w-10/12 text-center rounded-sm border border-zinc-200 bg-white/90 backdrop-blur px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm z-10"
                  />
                  <input 
                    type="file" 
                    ref={coverInputRef} 
                    onChange={handleCoverImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div 
                    className="absolute inset-0 z-0 cursor-pointer" 
                    onClick={() => coverInputRef.current?.click()}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-zinc-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Trạng thái</span>
                <span className={`rounded-sm border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer select-none transition-colors ${status === 'completed' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-amber-100 bg-amber-50 text-amber-600'}`} onClick={() => setStatus(s => s === 'completed' ? 'in-progress' : 'completed')}>
                  {status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Hiển thị</span>
                <span className="text-sm font-bold text-zinc-950">Công khai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Drawer */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-zinc-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl font-bold text-zinc-900">Xem trước Dự án</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <h1 className="font-serif text-4xl font-bold leading-tight text-zinc-900 mb-6">{title || 'Tên dự án...'}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-10 pb-10 border-b border-zinc-100">
                <span className="flex items-center gap-1.5"><Briefcase size={14} /> Khách hàng: {client || '...'}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Năm: {year}</span>
              </div>
              <div className="prose prose-zinc max-w-none text-lg text-zinc-700 leading-relaxed">
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <p className="text-zinc-400 italic">Nội dung case study hiển thị ở đây...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
