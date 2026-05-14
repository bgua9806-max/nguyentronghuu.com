import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Bold, Italic, List, Link as LinkIcon, Type, Eye, Globe, Hash, Sparkles, ArrowDownRight, X, ExternalLink, Calendar, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  
  const [category, setCategory] = useState('Marketing');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('published');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // WYSIWYG formatting helpers
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

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        const url = data.publicUrl;
        executeCommand('insertImage', url);
      }
      
      toast.success(`Đã tải ${files.length} ảnh lên thành công!`);
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

  // Initialize iframe when data finishes loading
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
          body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; cursor: text; padding: 16px; margin: 0; color: #3f3f46; font-size: 1.125rem; line-height: 1.75; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          img { max-width: 100%; border-radius: 4px; cursor: pointer; transition: outline 0.15s; }
          img:hover { outline: 2px solid #f59e0b; outline-offset: 2px; }
          img.selected-img { outline: 3px solid #f59e0b; outline-offset: 3px; }
          h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
          p { margin-bottom: 1em; }
          a { color: #d97706; text-decoration: underline; }
          ul, ol { padding-left: 20px; margin-bottom: 1em; }
          .img-toolbar { position: absolute; display: flex; gap: 4px; flex-wrap: wrap; max-width: 320px; background: #18181b; padding: 6px 8px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 999; }
          .img-toolbar button { background: transparent; border: 1px solid #3f3f46; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
          .img-toolbar button:hover { background: #f59e0b; color: #18181b; border-color: #f59e0b; }
          .img-toolbar .tb-sep { width: 1px; background: #3f3f46; align-self: stretch; margin: 0 2px; }
          .img-toolbar .tb-label { color: #a1a1aa; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: 100%; padding: 2px 2px 0; }
          .img-grid { display: flex; gap: 8px; margin: 16px 0; }
          .img-grid img { flex: 1; min-width: 0; margin: 0; object-fit: cover; height: auto; }
        `;
        doc.head.appendChild(style);

        // Hàm gom ảnh liền kề thành gallery grid
        const wrapInGrid = (clickedImg: HTMLElement, cols: number) => {
          // Tìm tất cả ảnh liền kề (cùng parent hoặc kế nhau)
          const parent = clickedImg.parentElement!;
          const allImages: HTMLElement[] = [];
          
          // Thu thập ảnh từ parent
          let node: any = clickedImg;
          // Lùi về trước tìm ảnh liền kề
          while (node.previousElementSibling) {
            const prev = node.previousElementSibling;
            if (prev.tagName === 'IMG') { allImages.unshift(prev); node = prev; }
            else if (prev.tagName === 'P' && prev.querySelector('img')) { allImages.unshift(prev.querySelector('img')!); node = prev; }
            else if (prev.tagName === 'BR') { node = prev; }
            else break;
          }
          allImages.push(clickedImg);
          // Tiến về sau tìm ảnh liền kề
          node = clickedImg;
          while (node.nextElementSibling) {
            const next = node.nextElementSibling;
            if (next.tagName === 'IMG') { allImages.push(next); node = next; }
            else if (next.tagName === 'P' && next.querySelector('img')) { allImages.push(next.querySelector('img')!); node = next; }
            else if (next.tagName === 'BR') { node = next; }
            else break;
          }

          // Tạo grid container
          const grid = doc.createElement('div');
          grid.className = 'img-grid';
          grid.contentEditable = 'false';

          // Di chuyển ảnh vào grid (lấy theo số cột)
          const imagesToUse = allImages.slice(0, cols);
          
          // Chèn grid vào trước ảnh đầu tiên
          const firstImgParent = imagesToUse[0].parentElement?.tagName === 'P' ? imagesToUse[0].parentElement : imagesToUse[0];
          parent.insertBefore(grid, firstImgParent);

          imagesToUse.forEach(img => {
            // Xóa thẻ P bọc ngoài nếu có
            if (img.parentElement?.tagName === 'P') {
              img.parentElement.remove();
            } else {
              img.remove();
            }
            (img as HTMLImageElement).style.width = '';
            (img as HTMLImageElement).style.height = '';
            img.classList.remove('selected-img');
            grid.appendChild(img);
          });

          setContent(doc.body.innerHTML);
        };

        // Xử lý click ảnh để hiện thanh điều chỉnh
        doc.addEventListener('click', (e: any) => {
          const oldToolbar = doc.querySelector('.img-toolbar');
          if (oldToolbar) oldToolbar.remove();
          doc.querySelectorAll('.selected-img').forEach((img: any) => img.classList.remove('selected-img'));

          const target = e.target as HTMLElement;
          if (target.tagName === 'IMG') {
            target.classList.add('selected-img');
            
            const toolbar = doc.createElement('div');
            toolbar.className = 'img-toolbar';
            toolbar.contentEditable = 'false';

            // Label: Kích thước
            const sizeLabel = doc.createElement('span');
            sizeLabel.className = 'tb-label';
            sizeLabel.textContent = 'Kích thước';
            toolbar.appendChild(sizeLabel);
            
            const sizes = [
              { label: '25%', value: '25%' },
              { label: '50%', value: '50%' },
              { label: '75%', value: '75%' },
              { label: '100%', value: '100%' },
            ];
            
            sizes.forEach(size => {
              const btn = doc.createElement('button');
              btn.textContent = size.label;
              btn.addEventListener('click', (ev: any) => {
                ev.stopPropagation();
                (target as HTMLImageElement).style.width = size.value;
                (target as HTMLImageElement).style.height = 'auto';
                toolbar.remove();
                target.classList.remove('selected-img');
                setContent(doc.body.innerHTML);
              });
              toolbar.appendChild(btn);
            });

            // Label: Bố cục
            const layoutLabel = doc.createElement('span');
            layoutLabel.className = 'tb-label';
            layoutLabel.textContent = 'Bố cục lưới';
            toolbar.appendChild(layoutLabel);

            [2, 3, 4].forEach(cols => {
              const btn = doc.createElement('button');
              btn.textContent = `${cols} cột`;
              btn.addEventListener('click', (ev: any) => {
                ev.stopPropagation();
                toolbar.remove();
                wrapInGrid(target, cols);
              });
              toolbar.appendChild(btn);
            });

            // Nút tách lưới (nếu đang trong grid)
            if (target.parentElement?.classList.contains('img-grid')) {
              const ungridBtn = doc.createElement('button');
              ungridBtn.textContent = 'Tách lưới';
              ungridBtn.addEventListener('click', (ev: any) => {
                ev.stopPropagation();
                const gridEl = target.parentElement!;
                const imgs = Array.from(gridEl.querySelectorAll('img'));
                imgs.forEach(img => {
                  (img as HTMLImageElement).style.width = '';
                  gridEl.parentElement!.insertBefore(img, gridEl);
                });
                gridEl.remove();
                toolbar.remove();
                setContent(doc.body.innerHTML);
              });
              toolbar.appendChild(ungridBtn);
            }

            // Separator + Xóa
            const sep = doc.createElement('span');
            sep.className = 'tb-sep';
            toolbar.appendChild(sep);
            
            const delBtn = doc.createElement('button');
            delBtn.textContent = 'Xóa';
            delBtn.style.borderColor = '#ef4444';
            delBtn.style.color = '#fca5a5';
            delBtn.addEventListener('click', (ev: any) => {
              ev.stopPropagation();
              target.remove();
              toolbar.remove();
              setContent(doc.body.innerHTML);
            });
            toolbar.appendChild(delBtn);

            // Vị trí toolbar
            toolbar.style.top = `${target.offsetTop - 70}px`;
            toolbar.style.left = `${target.offsetLeft}px`;
            target.parentElement?.insertBefore(toolbar, target);
          }
        });

        // Sync nội dung khi gõ
        const handleInput = () => {
          setContent(doc.body.innerHTML);
        };
        doc.body.addEventListener('input', handleInput);

        // Xử lý Ctrl+Z / Ctrl+Y bên trong iframe
        const handleKeydown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            doc.execCommand('undo');
            setContent(doc.body.innerHTML);
          }
          if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            doc.execCommand('redo');
            setContent(doc.body.innerHTML);
          }
        };
        doc.addEventListener('keydown', handleKeydown);
        
        return () => {
          doc.body.removeEventListener('input', handleInput);
          doc.removeEventListener('keydown', handleKeydown);
        };
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
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setSeoTitle(data.seo_title || '');
        setSeoDesc(data.seo_description || '');
        setCategory(data.category || 'Marketing');
        setCoverImage(data.cover_image || '');
        setStatus(data.status || 'published');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Không thể tải dữ liệu bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const getAutoDescription = () => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    try {
      setIsSaving(true);
      const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const postData = {
        title,
        slug: finalSlug,
        content,
        excerpt: getAutoDescription(),
        seo_title: seoTitle.trim() || title,
        seo_description: seoDesc.trim() || getAutoDescription(),
        category,
        cover_image: coverImage,
        status,
        updated_at: new Date().toISOString()
      };

      let error;
      if (id) {
        const { error: updateError } = await supabase.from('posts').update(postData).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('posts').insert([postData]);
        error = insertError;
      }

      if (error) {
        if (error.code === '23505') throw new Error('Đường dẫn (slug) đã tồn tại. Vui lòng sửa lại đường dẫn.');
        throw error;
      }
      
      // Tự động ping Google Indexing API nếu trạng thái là published
      if (status === 'published') {
        try {
          fetch('/api/request-indexing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: `https://nguyentronghuu.com/blog/${finalSlug}` })
          }).catch(err => console.error('Lỗi khi gọi Indexing API:', err));
        } catch (e) {
          console.error(e);
        }
      }
      
      toast.success(id ? 'Đã cập nhật bài viết' : 'Đã tạo bài viết mới');
      if (!id) navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải dữ liệu bài viết...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500 pb-28">
      {/* Top Header Actions */}
      <div className="sticky top-[76px] z-20 -mx-4 flex items-center justify-between border-b border-white/40 bg-[#f7f4ef]/80 px-4 py-4 backdrop-blur-2xl sm:px-0 sm:mx-0 sm:bg-[#f7f4ef]/90">
        <button 
          onClick={() => navigate('/admin/posts')}
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
            <span className="hidden sm:inline">Lưu & Xuất bản</span>
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
                placeholder="Nhập tiêu đề ấn tượng..." 
                className="w-full resize-none border-none p-0 font-serif text-3xl sm:text-4xl font-bold leading-tight text-zinc-950 placeholder:text-zinc-200 focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-2 text-sm mt-3 text-zinc-500">
                <span className="font-medium hidden sm:inline">nguyentronghuu.com/blog/</span>
                <span className="font-medium sm:hidden">.../blog/</span>
                <input 
                  type="text" 
                  value={slug}
                  className="bg-transparent border-b border-zinc-300 focus:border-amber-500 focus:outline-none text-zinc-900 flex-1 py-1 transition-colors"
                  placeholder="nhap-duong-dan-bai-viet"
                  onChange={(e) => setSlug(e.target.value)}
                />
                <button className="p-1.5 hover:bg-zinc-100 rounded-sm transition-colors text-zinc-400" title="Copy link">
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-zinc-100" />

            {/* Rich Text Toolbar */}
            <div className="space-y-4">
              <div className="sticky top-[150px] z-10 flex items-center gap-1 overflow-x-auto rounded-sm border border-zinc-200 bg-white/80 p-2 backdrop-blur-md shadow-sm">
                <button onClick={() => executeCommand('formatBlock', 'H3')} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Tiêu đề"><Type size={18} /></button>
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button onClick={() => executeCommand('bold')} className="rounded-sm p-2 font-bold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="In đậm"><Bold size={18} /></button>
                <button onClick={() => executeCommand('italic')} className="rounded-sm p-2 italic text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="In nghiêng"><Italic size={18} /></button>
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button onClick={() => executeCommand('insertUnorderedList')} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Danh sách"><List size={18} /></button>
                <button onClick={() => { const url = prompt('Nhập link:'); if(url) executeCommand('createLink', url); }} className="rounded-sm p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-950" title="Chèn liên kết"><LinkIcon size={18} /></button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploadingImage}
                  className={`rounded-sm p-2 transition-all ${isUploadingImage ? 'text-amber-500 animate-pulse' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'}`} 
                  title="Tải ảnh lên"
                >
                  {isUploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                </button>
                
                <div className="mx-1 h-5 w-px bg-zinc-200" />
                <button className="flex items-center gap-2 rounded-sm bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600 transition-all hover:bg-amber-100">
                  <Sparkles size={14} />
                  AI Writing
                </button>
              </div>
              
              <iframe
                ref={iframeRef}
                title="Visual Editor"
                className="min-h-[500px] w-full border border-zinc-200 rounded-sm bg-zinc-50/50"
              />
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
                   <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-red-500' : 'text-zinc-400'}`}>{seoTitle.length} / 60 ký tự</span>
                </div>
                <input 
                  type="text" 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "Tiêu đề hiển thị trên kết quả tìm kiếm..."}
                  className="w-full rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Meta Description</label>
                   <span className={`text-[10px] ${seoDesc.length > 160 ? 'text-red-500' : 'text-zinc-400'}`}>{seoDesc.length} / 160 ký tự</span>
                </div>
                <textarea 
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder={content ? getAutoDescription() : "Mô tả ngắn gọn nội dung bài viết để thu hút click..."}
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
                       <span className="text-[10px] text-zinc-500">https://nguyentronghuu.com › blog › {slug || 'bai-viet'}</span>
                     </div>
                   </div>
                   <h4 className="text-[#1a0dab] text-lg cursor-pointer hover:underline truncate mb-1">{seoTitle || title || 'Tiêu đề hiển thị trên kết quả tìm kiếm'}</h4>
                   <p className="text-sm text-[#4d5156] line-clamp-2">{seoDesc || (content ? getAutoDescription() : 'Mô tả ngắn gọn nội dung bài viết để thu hút click từ người dùng...')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Quick Help / AI Tips */}
          <div className="relative overflow-hidden rounded-sm bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl shadow-zinc-900/20">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10">
               <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500/20 text-amber-400">
                 <Sparkles size={20} />
               </div>
               <h4 className="mb-2 font-serif text-lg">AI Assistant</h4>
               <p className="text-sm leading-relaxed text-zinc-400">
                 Tiêu đề của bạn hơi ngắn. Hãy thử thêm các từ khóa như "Hiệu quả", "Tự động hóa" để tăng 45% tỷ lệ click.
               </p>
               <button className="mt-5 text-[11px] font-bold uppercase tracking-widest text-amber-400 transition-colors hover:text-amber-300">
                 Áp dụng gợi ý
               </button>
            </div>
          </div>

          {/* Publishing Settings */}
          <div className="rounded-sm border border-zinc-100 bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
            <h3 className="font-serif text-xl text-zinc-950">Phân loại</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Chuyên mục</label>
                <div className="relative">
                   <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none rounded-sm border border-zinc-200 bg-zinc-50/50 px-4 py-3 pr-10 text-sm font-medium transition-all focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10">
                     <option value="Marketing">Marketing</option>
                     <option value="AI Agent">AI Agent</option>
                     <option value="UX & Growth">UX & Growth</option>
                     <option value="Content Strategy">Content Strategy</option>
                     <option value="Workflow Automation">Workflow Automation</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400">
                      <ArrowDownRight size={16} />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Thẻ (Tags)</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 rounded-sm bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    #AI_Agent <button className="hover:text-red-500 ml-1">&times;</button>
                  </span>
                  <span className="flex items-center gap-1 rounded-sm bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    #Automation <button className="hover:text-red-500 ml-1">&times;</button>
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Ảnh đại diện</label>
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
                <span className={`rounded-sm border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer select-none transition-colors ${status === 'published' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-amber-100 bg-amber-50 text-amber-600'}`} onClick={() => setStatus(s => s === 'published' ? 'draft' : 'published')}>
                  {status === 'published' ? 'Đã đăng' : 'Bản nháp'}
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
                <h3 className="font-serif text-xl font-bold text-zinc-900">Xem trước</h3>
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold tracking-widest rounded-sm border border-zinc-200">Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 py-2 rounded-sm hover:bg-zinc-100 transition-colors">
                  <ExternalLink size={14} /> Mở tab mới
                </button>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <h1 className="font-serif text-4xl font-bold leading-tight text-zinc-900 mb-6">{title || 'Tiêu đề bài viết...'}</h1>
              <div className="flex items-center gap-4 text-sm text-zinc-500 mb-10 pb-10 border-b border-zinc-100">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Hôm nay</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="font-medium text-zinc-900">Nguyễn Trọng Hữu</span>
              </div>
              <div className="prose prose-zinc max-w-none text-lg text-zinc-700 leading-relaxed">
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="text-zinc-400 italic">Nội dung bài viết sẽ hiển thị ở đây...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
