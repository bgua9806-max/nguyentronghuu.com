-- Chèn dữ liệu mẫu vào bảng contacts (Khách hàng)
INSERT INTO public.contacts (name, email, phone, message, status, created_at)
VALUES
  ('Trần Văn Đạt', 'dat.tran@example.com', '0912345678', 'Chào Hữu, mình đang quan tâm đến dịch vụ xây dựng AI Agent cho doanh nghiệp mảng Retail. Bạn có thể tư vấn thêm không?', 'new', NOW() - INTERVAL '2 hours'),
  
  ('Nguyễn Thị Mai', 'mai.nguyen@example.com', '0987654321', 'Mình thấy portfolio của bạn rất ấn tượng. Công ty mình đang tìm kiếm một đối tác thiết kế UI/UX hệ thống ERP. Hy vọng có thể hợp tác.', 'new', NOW() - INTERVAL '1 day'),
  
  ('Hoàng Công Phát', 'phat.hoang@example.com', '0901112233', 'Dự án Maison Vie của bạn làm khá tốt, mình muốn xin báo giá cho một dự án F&B tương tự.', 'resolved', NOW() - INTERVAL '3 days'),
  
  ('Lê Hải Yến', 'yen.le@example.com', '0933445566', 'Cho mình hỏi về quy trình triển khai Automation Workflow cho phòng Sale với n8n nhé.', 'new', NOW() - INTERVAL '5 hours'),
  
  ('Phạm Tuấn Anh', 'anh.pham@example.com', '0977889900', 'Bên mình cần tích hợp Supabase và Stripe cho một ứng dụng SaaS mới, bạn có nhận kèo này không?', 'resolved', NOW() - INTERVAL '5 days');
