-- 1. Create table cho Dịch Vụ (Services)
CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content text,
  icon_name text,
  cover_image text,
  seo_title text,
  seo_description text,
  status text DEFAULT 'published',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cấu hình bảo mật RLS (Row Level Security)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người đọc (SELECT) các dịch vụ đã xuất bản
CREATE POLICY "Public services are viewable by everyone." ON services FOR SELECT USING (status = 'published');

-- Tạm thời cho phép tất cả các thao tác (Insert/Update/Delete) trên Client 
CREATE POLICY "Allow all operations for now on services" ON services FOR ALL USING (true);

-- 3. Dữ liệu mẫu (Insert sample data)
INSERT INTO services (title, slug, description, content, icon_name, status, seo_title, seo_description)
VALUES 
  (
    'Phát triển Web & Mobile App', 
    'web-app', 
    'Xây dựng nền tảng số chất lượng cao, tối ưu hóa trải nghiệm người dùng (UI/UX) và tốc độ tải trang. Kiến trúc hệ thống mở rộng linh hoạt theo từng giai đoạn phát triển của doanh nghiệp.', 
    '<h2>Tại sao doanh nghiệp cần Web/App chuyên nghiệp?</h2><p>Trải nghiệm số quyết định phần lớn ấn tượng của khách hàng về thương hiệu...</p><h3>Các tiêu chuẩn của chúng tôi:</h3><ul><li>Hiệu năng cao</li><li>Chuẩn SEO</li><li>Tối ưu UI/UX</li></ul>', 
    'Code2', 
    'published',
    'Dịch vụ Phát triển Web & Mobile App Chuyên nghiệp',
    'Thiết kế và lập trình website, ứng dụng di động chuẩn quốc tế, tốc độ cao, tối ưu tỷ lệ chuyển đổi.'
  ),
  (
    'Hệ thống AI & Tự động hoá', 
    'ai-automation', 
    'Thiết kế và triển khai các luồng làm việc tự động hóa kết hợp Trí tuệ nhân tạo (AI) giúp tối ưu hóa chi phí vận hành, giảm tải khối lượng công việc lặp lại và gia tăng năng suất.', 
    '<h2>Giải phóng sức lao động bằng AI và Tự động hóa</h2><p>Giúp nhân viên của bạn tập trung vào sáng tạo thay vì lặp lại các thao tác copy-paste nhàm chán...</p>', 
    'Bot', 
    'published',
    'Tư vấn & Triển khai Hệ thống AI Automation',
    'Ứng dụng AI và Tự động hoá (Make, n8n) để tối ưu luồng vận hành, giảm tải 80% công việc tay chân.'
  ),
  (
    'Tư vấn & Kiến trúc Hệ thống', 
    'system-architecture', 
    'Cung cấp giải pháp quy hoạch tổng thể công nghệ cho doanh nghiệp. Lựa chọn công nghệ phù hợp với mô hình kinh doanh để đảm bảo khả năng bảo mật, tính ổn định và mở rộng.', 
    '<h2>Quy hoạch công nghệ dài hạn</h2><p>Mỗi doanh nghiệp là một bài toán riêng, chúng tôi giúp bạn chọn đúng công cụ, xây đúng nền tảng ngay từ ngày đầu...</p>', 
    'Cpu', 
    'published',
    'Tư vấn Kiến trúc Hệ thống Công nghệ (System Architecture)',
    'Giải pháp quy hoạch hệ thống, bảo mật dữ liệu, và định hình Tech Stack phù hợp cho startup và doanh nghiệp SME.'
  ),
  (
    'Chiến lược Marketing & Growth', 
    'marketing-growth', 
    'Xây dựng phễu chuyển đổi toàn diện, từ việc thu hút khách hàng tiềm năng đến khi ra quyết định mua hàng. Kết hợp dữ liệu (Data-driven) để đưa ra các quyết định.', 
    '<h2>Tăng trưởng nhờ Dữ liệu (Data-driven Growth)</h2><p>Biết rõ khách hàng đến từ đâu và rời đi ở bước nào để tối ưu từng điểm chạm...</p>', 
    'LineChart', 
    'published',
    'Chiến lược Growth Marketing & Phễu Chuyển đổi',
    'Giải pháp Performance Marketing kết hợp phân tích dữ liệu, mang lại khách hàng tiềm năng với chi phí tối ưu.'
  );
