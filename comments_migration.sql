-- 1. Thêm cột 'likes' vào bảng 'posts' để lưu tổng lượt thích
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 2. Tạo bảng 'comments' để lưu bình luận đa tầng
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Khóa ngoại để lưu phản hồi
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bật bảo mật RLS cho bảng comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 4. Cho phép tất cả mọi người được đọc bình luận
CREATE POLICY "Cho phép đọc bình luận" ON public.comments
    FOR SELECT USING (true);

-- 5. Cho phép tất cả mọi người được đăng bình luận mới
CREATE POLICY "Cho phép đăng bình luận" ON public.comments
    FOR INSERT WITH CHECK (true);

-- 6. Cho phép Admin xóa bình luận
CREATE POLICY "Cho phép xóa bình luận" ON public.comments
    FOR DELETE USING (true);

-- 7. Thêm cột admin_reply để đánh dấu bình luận của chủ website (Tùy chọn)
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
