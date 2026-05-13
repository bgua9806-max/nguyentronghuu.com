-- 1. Tạo bảng 'contacts' để lưu trữ thông tin khách hàng liên hệ (Mini CRM)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- Trạng thái: 'new' (Mới), 'contacted' (Đã liên hệ), 'resolved' (Hoàn tất)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bật bảo mật RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. Phân quyền: Ai cũng có thể xem (Tạm thời để Admin xem, nhưng chưa có Auth nên để true)
CREATE POLICY "Cho phép đọc contacts" ON public.contacts FOR SELECT USING (true);

-- 4. Phân quyền: Khách vãng lai có thể gửi liên hệ (Thêm mới)
CREATE POLICY "Cho phép tạo contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- 5. Phân quyền: Admin có thể cập nhật trạng thái (Đã liên hệ)
CREATE POLICY "Cho phép sửa contacts" ON public.contacts FOR UPDATE USING (true);

-- 6. Phân quyền: Admin có thể xóa liên hệ
CREATE POLICY "Cho phép xóa contacts" ON public.contacts FOR DELETE USING (true);
