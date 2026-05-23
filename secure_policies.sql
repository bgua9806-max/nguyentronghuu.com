-- Kịch Bản Bảo Mật Cơ Sở Dữ Liệu Supabase (Row Level Security - RLS)
-- Nguyễn Trọng Hữu Portfolio

--------------------------------------------------
-- 1. BẢNG BÀI VIẾT (posts)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Public posts are viewable by everyone." ON public.posts;
DROP POLICY IF EXISTS "Allow all operations for now on posts" ON public.posts;

-- Thiết lập lại RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Cho phép khách đọc bài viết đã xuất bản
CREATE POLICY "Public select posts" ON public.posts 
    FOR SELECT USING (status = 'published');

-- Cho phép Admin (Authenticated User) toàn quyền thao tác (Select, Insert, Update, Delete)
CREATE POLICY "Admin full access on posts" ON public.posts 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 2. BẢNG DỰ ÁN (projects)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Public projects are viewable by everyone." ON public.projects;
DROP POLICY IF EXISTS "Allow all operations for now on projects" ON public.projects;

-- Thiết lập lại RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Cho phép khách đọc dự án đã hoàn thành
CREATE POLICY "Public select projects" ON public.projects 
    FOR SELECT USING (status = 'completed');

-- Cho phép Admin toàn quyền thao tác
CREATE POLICY "Admin full access on projects" ON public.projects 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 3. BẢNG DỊCH VỤ (services)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Public services are viewable by everyone." ON public.services;
DROP POLICY IF EXISTS "Allow all operations for now on services" ON public.services;

-- Thiết lập lại RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Cho phép khách đọc dịch vụ đã xuất bản
CREATE POLICY "Public select services" ON public.services 
    FOR SELECT USING (status = 'published');

-- Cho phép Admin toàn quyền thao tác
CREATE POLICY "Admin full access on services" ON public.services 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 4. BẢNG LIÊN HỆ (contacts)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Cho phép đọc contacts" ON public.contacts;
DROP POLICY IF EXISTS "Cho phép tạo contacts" ON public.contacts;
DROP POLICY IF EXISTS "Cho phép sửa contacts" ON public.contacts;
DROP POLICY IF EXISTS "Cho phép xóa contacts" ON public.contacts;

-- Thiết lập lại RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Cho phép khách vãng lai gửi liên hệ từ Form
CREATE POLICY "Guest insert contacts" ON public.contacts 
    FOR INSERT WITH CHECK (true);

-- Cho phép Admin đọc, sửa và xóa liên hệ từ CRM
CREATE POLICY "Admin full access on contacts" ON public.contacts 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 5. BẢNG CÀI ĐẶT HỆ THỐNG (system_settings)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Cho phép đọc system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Cho phép cập nhật system_settings" ON public.system_settings;

-- Thiết lập lại RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Cho phép khách đọc cài đặt (để gửi thư bằng SMTP templates)
CREATE POLICY "Public select settings" ON public.system_settings 
    FOR SELECT USING (true);

-- Cho phép Admin sửa đổi cài đặt
CREATE POLICY "Admin full access on settings" ON public.system_settings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 6. BẢNG BÌNH LUẬN (comments)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Cho phép đọc bình luận" ON public.comments;
DROP POLICY IF EXISTS "Cho phép đăng bình luận" ON public.comments;
DROP POLICY IF EXISTS "Cho phép xóa bình luận" ON public.comments;

-- Thiết lập lại RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc bình luận
CREATE POLICY "Public select comments" ON public.comments 
    FOR SELECT USING (true);

-- Cho phép mọi người đăng bình luận mới
CREATE POLICY "Guest insert comments" ON public.comments 
    FOR INSERT WITH CHECK (true);

-- Cho phép Admin quản lý bình luận (Sửa, Xóa)
CREATE POLICY "Admin manage comments" ON public.comments 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


--------------------------------------------------
-- 7. CHÍNH SÁCH BỘ LƯU TRỮ HÌNH ẢNH (storage.objects)
--------------------------------------------------
-- Xóa các policy lỏng lẻo cũ
DROP POLICY IF EXISTS "Cho phép mọi người tải ảnh lên" ON storage.objects;
DROP POLICY IF EXISTS "Cho phép mọi người xem ảnh" ON storage.objects;
DROP POLICY IF EXISTS "Cho phép sửa ảnh" ON storage.objects;
DROP POLICY IF EXISTS "Cho phép xóa ảnh" ON storage.objects;

-- Cho phép khách đọc/xem hình ảnh trong bucket 'blog-images'
CREATE POLICY "Public select storage images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

-- Chỉ cho phép Admin đã đăng nhập tải ảnh lên, chỉnh sửa và xóa ảnh
CREATE POLICY "Admin write storage images" 
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');
