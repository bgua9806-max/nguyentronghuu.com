-- 1. Tạo bảng system_settings để lưu cấu hình
CREATE TABLE IF NOT EXISTS public.system_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Bật bảo mật RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 3. Phân quyền (Cho phép Admin toàn quyền, tạm thời mở true)
CREATE POLICY "Cho phép đọc system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Cho phép cập nhật system_settings" ON public.system_settings FOR ALL USING (true);

-- 4. Chèn dữ liệu mẫu mặc định (Template Email)
INSERT INTO public.system_settings (key, value) VALUES
('email_template_admin_contact', '{"subject": "Thông báo: Khách hàng mới {{name}}", "htmlBody": "<h3>Có khách hàng vừa liên hệ trên website!</h3><p><strong>Tên:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>SĐT:</strong> {{phone}}</p><p><strong>Lời nhắn:</strong> {{message}}</p>"}'),
('email_template_customer_reply', '{"subject": "Cảm ơn bạn đã liên hệ - Nguyễn Trọng Hữu", "htmlBody": "<h3>Chào {{name}},</h3><p>Tôi đã nhận được lời nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất qua email <strong>{{email}}</strong> hoặc SĐT <strong>{{phone}}</strong>.</p><p>Chúc bạn một ngày tốt lành!</p><p>- Nguyễn Trọng Hữu</p>"}')
ON CONFLICT (key) DO NOTHING;
