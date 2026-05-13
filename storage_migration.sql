-- 1. Tạo một bucket mới tên là 'blog-images' (Đặt chế độ public = true để ai cũng xem được ảnh)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Cho phép mọi người đều có thể tải ảnh lên (Tạm thời mở public vì chưa cài Auth)
CREATE POLICY "Cho phép mọi người tải ảnh lên" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'blog-images');

-- 3. Cho phép mọi người xem ảnh
CREATE POLICY "Cho phép mọi người xem ảnh" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

-- 4. Cho phép sửa ảnh
CREATE POLICY "Cho phép sửa ảnh" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'blog-images');

-- 5. Cho phép xóa ảnh
CREATE POLICY "Cho phép xóa ảnh" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'blog-images');
