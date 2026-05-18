import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon, Type, Eye, Globe, Copy, Loader2, Code2, Bot, LineChart, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function ServiceEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Cpu');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('published');
  
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
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
          body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; cursor: text; padding: 16px; margin: 0; color: #3f3f46; font-size: 1.125rem; line-height: 1.75; }
          img { max-width: 100%; border-radius: 4px; cursor: pointer; transition: outline 0.15s; }
          img:hover { outline: 2px solid #f59e0b; outline-offset: 2px; }
          img.selected-img { outline: 3px solid #f59e0b; outline-offset: 3px; }
          h1,h2,h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-family: "Playfair Display", ui-serif, Georgia, serif; font-weight: normal; }
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
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setContent(data.content || '');
        setIconName(data.icon_name || 'Cpu');
        setSeoTitle(data.seo_title || '');
        setSeoDesc(data.seo_description || '');
        setCoverImage(data.cover_image || '');
        setStatus(data.status || 'published');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Không thể tải dữ liệu dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên dịch vụ');
      return;
    }
    
    try {
      setIsSaving(true);
      const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const serviceData = {
        title,
        slug: finalSlug,
        description,
        content,
        icon_name: iconName,
        seo_title: seoTitle,
        seo_description: seoDesc,
        cover_image: coverImage,
        status,
        updated_at: new Date().toISOString()
      };

      let error;
      if (id) {
        const { error: updateError } = await supabase.from('services').update(serviceData).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('services').insert([serviceData]);
        error = insertError;
      }

      if (error) {
        if (error.code === '23505') throw new Error('Đường dẫn (slug) đã tồn tại.');
        throw error;
      }
      
      toast.success(id ? 'Đã cập nhật dịch vụ' : 'Đã tạo dịch vụ mới');
      if (!id) navigate('/admin/services');
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500 pb-28">
      <div className="sticky top-0 z-30 -mx-4 flex items-center justify-between border-b border-white/40 bg-[#f7f4ef]/80 px-4 py-4 backdrop-blur-2xl sm:px-0 sm:mx-0 sm:bg-[#f7f4ef]/90">
        <button 
          onClick={() => navigate('/admin/services')}
          className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 bg-white shadow-sm transition-all group-hover:-translate-x-0.5 group-hover:border-zinc-300">
            <ArrowLeft size={16} />
          </div>
          Quay lại
        </button>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-sm bg-zinc-950 px-4 sm:px-6 py-2 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">Lưu Dịch vụ</span>
            <span className="sm:hidden">Lưu</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <div>
              <textarea 
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên dịch vụ..." 
                className="w-full resize-none border-none p-0 font-serif text-4xl sm:text-5xl font-bold leading-tight text-zinc-950 placeholder:text-zinc-200 focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-2 text-sm mt-3 text-zinc-500">
                <span className="font-medium hidden sm:inline">nguyentronghuu.com/services/</span>
                <span className="font-medium sm:hidden">.../services/</span>
                <input 
                  type="text" 
                  value={slug}
                  className="bg-transparent border-b border-zinc-300 focus:border-amber-500 focus:outline-none text-zinc-900 flex-1 py-1 transition-colors"
                  placeholder="duong-dan-dich-vu"
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="h-px w-full bg-zinc-100" />
            
            <div className="space-y-2">
               <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Mô tả ngắn (Hiển thị trang ngoài)</label>
               <textarea 
                 rows={3}
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 py-3 px-4 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
               />
            </div>

            <div className="h-px w-full bg-zinc-100" />

            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Bài viết chi tiết Dịch vụ</label>
              <div className="sticky top-20 z-10 flex items-center gap-1 overflow-x-auto rounded-sm border border-zinc-200 bg-white/80 p-2 backdrop-blur-md shadow-sm">
                <button onClick={() => executeCommand('formatBlock', 'H3')} className="rounded-sm p-2 text-zinc-500 hover:bg-zinc-100"><Type size={18} /></button>
                <button onClick={() => executeCommand('bold')} className="rounded-sm p-2 font-bold text-zinc-500 hover:bg-zinc-100"><Bold size={18} /></button>
                <button onClick={() => executeCommand('italic')} className="rounded-sm p-2 italic text-zinc-500 hover:bg-zinc-100"><Italic size={18} /></button>
                <button onClick={() => executeCommand('insertUnorderedList')} className="rounded-sm p-2 text-zinc-500 hover:bg-zinc-100"><List size={18} /></button>
                <button onClick={() => { const url = prompt('Nhập link:'); if(url) executeCommand('createLink', url); }} className="rounded-sm p-2 text-zinc-500 hover:bg-zinc-100"><LinkIcon size={18} /></button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="rounded-sm p-2 text-zinc-500 hover:bg-zinc-100">
                  {isUploadingImage ? <Loader2 size={18} className="animate-spin text-amber-500" /> : <ImageIcon size={18} />}
                </button>
              </div>
              <iframe ref={iframeRef} title="Visual Editor" className="min-h-[500px] w-full border border-zinc-200 rounded-sm bg-zinc-50/50" />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <h3 className="font-serif text-xl text-zinc-950">Thông tin bổ sung</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Biểu tượng (Icon)</label>
                <select value={iconName} onChange={(e) => setIconName(e.target.value)} className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm">
                  <option value="Code2">Phát triển Web/App</option>
                  <option value="Bot">AI Automation</option>
                  <option value="Cpu">Kiến trúc Hệ thống</option>
                  <option value="LineChart">Marketing & Growth</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Ảnh Bài viết (Hero Image)</label>
                <div className="group relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-400">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      {isUploadingCover ? <Loader2 size={32} className="animate-spin text-amber-500" /> : <ImageIcon size={32} />}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={coverInputRef} 
                    onChange={handleCoverImageUpload} 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-zinc-100 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">Trạng thái</span>
                  <span className={`rounded-sm border px-2.5 py-1 text-[10px] font-bold uppercase cursor-pointer ${status === 'published' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`} onClick={() => setStatus(s => s === 'published' ? 'draft' : 'published')}>
                    {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <h3 className="font-serif text-xl text-zinc-950">SEO</h3>
            <div className="space-y-4">
              <input type="text" placeholder="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full rounded-sm border border-zinc-200 px-4 py-2 text-sm" />
              <textarea placeholder="SEO Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full rounded-sm border border-zinc-200 px-4 py-2 text-sm" rows={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
