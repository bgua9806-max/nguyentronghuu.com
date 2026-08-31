-- Thêm dịch vụ "Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App" vào Supabase
INSERT INTO public.services (
  title, 
  slug, 
  description, 
  content, 
  icon_name, 
  cover_image,
  status, 
  seo_title, 
  seo_description
)
VALUES (
  'Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App',
  'zalo-ai-data-sync',
  'Tự động lắng nghe đa nhóm Zalo cá nhân, dùng AI phân tích bóc tách các trường dữ liệu (SĐT, giá, vị trí, nhu cầu) điền thẳng vào Google Sheets và phát triển Web App tra cứu nhanh trong 1 giây.',
  '<h2>Giải Pháp Đột Phá: Biến Hàng Nghìn Tin Nhắn Nhóm Zalo Rời Rạc Thành Cơ Sở Dữ Liệu Tra Cứu Tập Trung</h2>
<p>Tại Việt Nam, <strong>Zalo</strong> là kênh giao dịch, trao đổi thông tin và săn tìm nguồn hàng/khách hàng sôi động nhất. Mỗi ngày, hàng trăm nhóm Zalo về Bất động sản, Vận tải - Logistics, Nông sản, Hàng sỉ, Cho thuê, Tuyển dụng... phát sinh hàng chục nghìn tin nhắn. Tuy nhiên, 95% doanh nghiệp đang đối mặt với những vấn đề nhức nhối:</p>
<ul>
  <li><strong>Trôi tin nhắn và bỏ lỡ cơ hội:</strong> Tin nhắn nhảy liên tục 24/7, người phụ trách không thể theo dõi hết, nguồn hàng giá tốt hoặc khách hàng cần mua gấp bị trôi mất chỉ sau vài phút.</li>
  <li><strong>Dữ liệu lộn xộn, không chuẩn hóa:</strong> Mỗi người đăng một kiểu (viết tắt, không dấu, sai chính tả, gửi hình ảnh bill/sổ đỏ, số điện thoại chèn ký tự lạ...) khiến việc tìm kiếm lại bằng chức năng tìm kiếm của Zalo gần như bất khả thi.</li>
  <li><strong>Tốn hàng chục giờ nhập liệu thủ công:</strong> Doanh nghiệp phải thuê 2-3 nhân sự chỉ để ngồi đọc từng tin nhắn Zalo rồi gõ lại vào Excel/Google Sheet, vừa chậm chạp, tốn chi phí lại dễ sai sót số liệu.</li>
  <li><strong>Khó chia sẻ và khai thác nội bộ:</strong> Dữ liệu nằm rải rác trên điện thoại cá nhân của từng nhân viên, không có một hệ thống tập trung để toàn bộ đội ngũ cùng tra cứu và khai thác bán hàng.</li>
</ul>
<p><strong>Giải pháp của chúng tôi:</strong> Xây dựng <strong>Hệ thống Tự động hóa Đồng bộ Nhóm Zalo kết hợp AI Bóc tách dữ liệu</strong> thông minh. Dữ liệu từ các nhóm Zalo cá nhân tự động được AI phân tích, trích xuất thành các trường thông tin chuẩn chỉ, tự động điền vào <strong>Google Sheets</strong> và hiển thị trực quan trên <strong>Web App Tra cứu Riêng biệt</strong> cho doanh nghiệp của bạn.</p>

<hr>

<h2>Kiến Trúc &amp; Các Tính Năng Nổi Bật Của Hệ Thống</h2>

<h3>1. Tự Động Lắng Nghe &amp; Thu Thập Tin Nhắn Từ Đa Nhóm Zalo Cá Nhân</h3>
<p>Hệ thống hoạt động ngầm 24/7, liên tục đồng bộ tin nhắn theo thời gian thực:</p>
<ul>
  <li><strong>Kết nối đa tài khoản &amp; Hàng trăm nhóm Zalo:</strong> Cho phép liên kết một hoặc nhiều tài khoản Zalo cá nhân để tự động quét tin nhắn từ tất cả các hội nhóm (Group chat), nhóm cộng đồng mà tài khoản đó tham gia.</li>
  <li><strong>Thu thập đa định dạng dữ liệu:</strong> Tiếp nhận tin nhắn dạng văn bản (Text), hình ảnh đính kèm (sổ đỏ, bảng giá, hóa đơn), vị trí địa lý (Location) và file tài liệu.</li>
  <li><strong>Chạy ngầm tự động 24/7:</strong> Không yêu cầu bạn phải mở ứng dụng Zalo liên tục, hệ thống máy chủ tự động thu thập và đẩy dữ liệu về trung tâm xử lý.</li>
</ul>

<hr>

<h3>2. AI Thông Minh Bóc Tách &amp; Chuẩn Hóa Trường Dữ Liệu (AI Information Extraction)</h3>
<p>Ứng dụng các mô hình ngôn ngữ lớn (OpenAI GPT-4o, Google Gemini) được huấn luyện riêng biệt cho văn phong Zalo Việt Nam:</p>
<ul>
  <li><strong>Phân loại ý định thông minh (Intent Classification):</strong> Tự động nhận diện tin nhắn là <em>Cần Mua, Cần Bán, Cho Thuê, Tìm Đối Tác, Báo Giá, hay Tuyển Dụng</em> để gom vào đúng chuyên mục.</li>
  <li><strong>Trích xuất chính xác từng trường dữ liệu:</strong> Tự động bóc tách:
    <ul>
      <li><strong>Họ tên &amp; Thông tin liên hệ:</strong> Số điện thoại người đăng (tự động nhận diện cả số viết cách, viết mã số), Tên Zalo, Link trang cá nhân.</li>
      <li><strong>Khu vực / Địa điểm:</strong> Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Tên đường, Tòa nhà, Dự án.</li>
      <li><strong>Giá &amp; Diện tích / Số lượng:</strong> Tự động quy đổi các đơn vị (ví dụ: "3 củ 5" &rarr; 3.500.000đ, "2 tỏi" &rarr; 2.000.000.000đ, "50m2", "10 tấn"...).</li>
      <li><strong>Thông số chi tiết:</strong> Tình trạng pháp lý, loại sản phẩm, thông số kỹ thuật, yêu cầu cụ thể.</li>
    </ul>
  </li>
  <li><strong>Xử lý ảnh bằng AI OCR:</strong> Đọc và nhận diện nội dung trên ảnh chụp màn hình, ảnh sổ đỏ, bảng kê đơn hàng để chuyển đổi thành văn bản có cấu trúc.</li>
</ul>

<hr>

<h3>3. Tự Động Điền &amp; Đồng Bộ Vào Google Sheets Theo Thời Gian Thực</h3>
<p>Dữ liệu sau khi được làm sạch sẽ được ghi ngay lập tức vào bảng tính Google Sheets của bạn:</p>
<ul>
  <li><strong>Cột dữ liệu chuẩn chỉnh:</strong> Mỗi trường thông tin (Thời gian, Tên nhóm, Người gửi, SĐT, Nhu cầu, Khu vực, Mức giá, Nội dung gốc...) được ghi vào từng cột riêng biệt.</li>
  <li><strong>Chống trùng lặp (De-duplication):</strong> Tự động phát hiện và loại bỏ các tin nhắn đăng lại nhiều lần trong ngày hoặc đăng chéo giữa nhiều nhóm để tránh làm rác bảng tính.</li>
  <li><strong>Dễ dàng mở rộng luồng:</strong> Kết nối Google Sheets với các trigger tự động gửi email, tạo hóa đơn hoặc kết nối CRM nội bộ.</li>
</ul>

<hr>

<h3>4. Web App Tra Cứu Nhanh &amp; Quản Trị Dữ Liệu Tập Trung (Custom Web Portal)</h3>
<p>Chúng tôi xây dựng một Web App chuyên nghiệp, giao diện mượt mà trên cả Điện thoại và Máy tính, giúp đội ngũ nhân viên tìm kiếm thông tin trong 1 giây:</p>
<ul>
  <li><strong>Bộ lọc đa chiều thông minh:</strong> Lọc theo Khu vực, Khoảng giá, Loại nhu cầu, Nhóm Zalo nguồn, Ngày đăng chỉ với vài thao tác chọn đơn giản.</li>
  <li><strong>Tìm kiếm toàn văn (Full-text Search):</strong> Gõ từ khóa bất kỳ, hệ thống sẽ trả về kết quả chính xác tức thì.</li>
  <li><strong>Gọi điện &amp; Nhắn tin 1 chạm:</strong> Bấm trực tiếp vào nút "Gọi ngay" hoặc "Mở Zalo" bên cạnh mỗi tin nhắn để liên hệ ngay với người đăng mà không cần lưu danh bạ.</li>
  <li><strong>Phân quyền nhân sự &amp; Đánh dấu trạng thái:</strong> Đánh dấu tin nhắn là <em>"Đã liên hệ", "Đang đàm phán", "Đã chốt", "Tin rác"</em> và gắn thẻ nhân viên phụ trách để tránh trùng khách.</li>
  <li><strong>Cảnh báo tin VIP vào Telegram / Zalo riêng:</strong> Khi có tin nhắn xuất hiện từ khóa "hot" (ví dụ: cần mua gấp, giá rẻ, hàng thanh lý...), bot tự động gửi thông báo riêng cho bạn ngay lập tức.</li>
</ul>

<hr>

<h2>Bảng So Sánh Hiệu Quả Đột Phá</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
  <thead>
    <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
      <th style="padding: 12px 16px;">Tiêu chí so sánh</th>
      <th style="padding: 12px 16px; color: #d97706;">Hệ thống AI Zalo Sync &amp; Web App Tra Cứu</th>
      <th style="padding: 12px 16px; color: #71717a;">Nhân sự Đọc &amp; Nhập Tay Thủ Công</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Tốc độ xử lý</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tức thì (Dưới 3 giây từ khi tin nhắn xuất hiện trên Zalo)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Chậm (Mất từ 15 phút đến vài tiếng, dễ trôi mất tin)</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Độ phủ &amp; Quy mô</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Quét đồng thời 50 - 200+ nhóm Zalo 24/7 không mệt mỏi</td>
      <td style="padding: 12px 16px; color: #dc2626;">Mỗi nhân viên chỉ theo dõi được tối đa 5 - 10 nhóm</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Độ chính xác dữ liệu</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Chuẩn hóa 100% cột trường, số điện thoại, giá tiền, địa điểm</td>
      <td style="padding: 12px 16px; color: #dc2626;">Dễ gõ sai số điện thoại, nhầm lẫn giá hoặc bỏ sót thông tin</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Khả năng tra cứu</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Web App lọc nhanh theo giá, vùng, gọi điện 1 chạm trên mobile</td>
      <td style="padding: 12px 16px; color: #dc2626;">Lướt lại lịch sử chat Zalo hoa mắt hoặc mở file Excel nặng nề</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Chi phí vận hành</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Đầu tư 1 lần, chi phí duy trì API cực thấp</td>
      <td style="padding: 12px 16px; color: #dc2626;">Tốn 8.000.000đ - 20.000.000đ/tháng tiền lương nhân sự nhập liệu</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Ứng Dụng Thực Tế Theo Ngành Nghề</h2>
<ul>
  <li><strong>Bất Động Sản &amp; Môi Giới:</strong> Tự động gom hàng nghìn tin rao bán/cho thuê từ các hội nhóm môi giới Zalo. Lọc ngay nhà đất theo quận/huyện, khoảng giá, diện tích để gửi ngay cho khách mua trước đối thủ.</li>
  <li><strong>Vận Tải &amp; Logistics:</strong> Quét các nhóm tìm xe, tìm hàng Zalo để bóc tách: Điểm đi, Điểm đến, Loại xe, Tải trọng, Giá cước và gọi chốt đơn chở hàng tức thì.</li>
  <li><strong>Nông Sản, Thực Phẩm &amp; Hàng Bán Sỉ:</strong> Tự động tổng hợp bảng giá nông sản, hải sản, nguồn hàng xuất nhập khẩu cập nhật theo từng giờ từ các vựa/đầu mối.</li>
  <li><strong>Tuyển Dụng &amp; Cung Ứng Nhân Lực:</strong> Tự động gom thông tin ứng viên, nhu cầu tìm việc làm thời vụ/cộng tác viên từ các hội nhóm việc làm.</li>
  <li><strong>Săn Deal, Thu Mua Đồ Cũ &amp; Thanh Lý:</strong> Bắt ngay các tin thanh lý giá rẻ, đồ công nghệ, máy móc vừa đăng lên nhóm để mua gom bán lại.</li>
</ul>

<hr>

<h2>Quy Trình Triển Khai 4 Bước Chuyên Nghiệp</h2>

<h3>Bước 1: Khảo Sát Nguồn Nhóm Zalo &amp; Định Nghĩa Trường Dữ Liệu Cần Bóc Tách (1 - 2 ngày)</h3>
<p>Làm việc cùng bạn để xác định danh sách các nhóm Zalo cần quét, thống nhất các trường dữ liệu cần trích xuất (SĐT, Địa chỉ, Giá, Danh mục, Nhu cầu...) và xây dựng Prompt AI chuyên biệt.</p>

<h3>Bước 2: Xây Dựng Hệ Thống Thu Thập &amp; Pipeline Bóc Tách AI (3 - 5 ngày)</h3>
<p>Thiết lập module kết nối tài khoản Zalo, kết nối API LLM (GPT-4o/Gemini) để xử lý văn bản, lập trình tự động ghi dữ liệu vào Google Sheets và cấu hình lọc trùng lặp.</p>

<h3>Bước 3: Phát Triển Web App Tra Cứu &amp; Phân Quyền (3 - 5 ngày)</h3>
<p>Xây dựng giao diện Web App tra cứu chuyên nghiệp, tối ưu hiển thị trên điện thoại, tích hợp bộ lọc tìm kiếm nâng cao và nút gọi/chat Zalo 1 chạm.</p>

<h3>Bước 4: Kiểm Thử Thực Tế, Bàn Giao &amp; Hướng Dẫn Vận Hành</h3>
<p>Chạy thử nghiệm hệ thống với dữ liệu thực tế trong 2-3 ngày, tinh chỉnh độ chính xác bóc tách của AI đạt trên 98%, bàn giao toàn bộ mã nguồn, tài khoản quản trị và video hướng dẫn chi tiết.</p>',
  'MessageSquareText',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
  'published',
  'Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App | Nguyễn Trọng Hữu',
  'Dịch vụ xây dựng hệ thống tự động quét tin nhắn đa nhóm Zalo cá nhân, AI phân tích bóc tách trường thông tin vào Google Sheets và Web App tra cứu nhanh.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  cover_image = EXCLUDED.cover_image,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
