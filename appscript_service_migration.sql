-- Thêm dịch vụ "Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp" vào Supabase
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
  'Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp',
  'google-sheets-automation',
  'Xây dựng hệ thống tự động hóa quản lý, Mini CRM, đồng bộ Lead Marketing đa kênh và báo cáo tự động trên Google Sheets. Tiết kiệm 90% thời gian nhập liệu thủ công với chi phí tối ưu nhất cho SMEs.',
  '<h2>Tại sao Doanh nghiệp Vừa &amp; Nhỏ (SMEs) cần Tự động hóa bằng Google Sheets &amp; Apps Script?</h2>
<p>Google Sheets (Google Trang tính) là công cụ quen thuộc hàng ngày của hầu hết các doanh nghiệp vừa và nhỏ, startup, đội nhóm kinh doanh và phòng marketing tại Việt Nam. Tuy nhiên, hơn 90% doanh nghiệp đang sử dụng Google Sheets theo cách <strong>thủ công 100%</strong>:</p>
<ul>
  <li><strong>Nhập liệu thủ công chậm trễ và dễ sai sót:</strong> Nhân viên mất hàng giờ mỗi ngày để copy/paste dữ liệu khách hàng từ form quảng cáo, nhóm chat, email vào các bảng tính.</li>
  <li><strong>Bỏ sót và phản hồi Lead chậm:</strong> Khách hàng để lại thông tin từ Facebook Ads, TikTok Ads, Website nhưng sau vài tiếng mới được nhân viên gọi điện tư vấn, khiến tỷ lệ chuyển đổi (CR) sụt giảm nghiêm trọng.</li>
  <li><strong>Không đồng bộ dữ liệu giữa các phòng ban:</strong> Đội Marketing, đội Sales, đội Kho và Kế toán mỗi bên giữ một file Excel/Sheet riêng, dẫn đến tình trạng lệch số liệu, trùng đơn hoặc thiếu hàng.</li>
  <li><strong>Tốn thời gian làm báo cáo:</strong> Quản lý và nhân sự phải thức khuya tổng hợp số liệu doanh thu, chi phí ads, lợi nhuận để làm báo cáo cuối ngày hoặc cuối tuần.</li>
  <li><strong>Phần mềm ERP/CRM đóng gói quá đắt đỏ và cồng kềnh:</strong> Chi phí mua phần mềm chuyên dụng từ vài chục đến hàng trăm triệu mỗi năm, nhưng tính năng quá phức tạp khiến nhân viên không chịu dùng và bỏ cuộc.</li>
</ul>
<p><strong>Giải pháp của chúng tôi:</strong> Biến Google Sheets quen thuộc thành một <strong>Hệ thống Tự động hóa Vận hành &amp; Mini CRM thông minh</strong> nhờ sức mạnh của <strong>Google Apps Script</strong> và tích hợp API. Doanh nghiệp sở hữu hệ thống tự động hóa may đo 100% theo đúng quy trình thực tế với chi phí đầu tư chỉ bằng một phần nhỏ so với phần mềm lớn, hoàn toàn <strong>không mất phí thuê bao hàng tháng</strong>.</p>

<hr>

<h2>Các Hệ thống Tự động hóa Chúng tôi Nhận Xây dựng</h2>

<h3>1. Hệ thống Tự động hóa Marketing &amp; Quản lý Lead (Marketing Automation)</h3>
<p>Giải quyết triệt để bài toán rò rỉ lead quảng cáo và tối ưu hóa tốc độ tiếp cận khách hàng tiềm năng:</p>
<ul>
  <li><strong>Tự động thu thập Lead đa kênh Realtime:</strong> Kết nối trực tiếp Facebook Lead Ads, TikTok Lead Generation, Google Forms, Form trên Landing Page/Website về Google Sheets ngay lập tức (Realtime Webhook) không độ trễ.</li>
  <li><strong>Phân bổ Lead tự động cho Sales (Round-Robin):</strong> Tự động chia đều khách hàng cho từng nhân viên telesale theo tỷ lệ cài đặt trước, theo ca trực hoặc theo khu vực địa lý.</li>
  <li><strong>Bắn thông báo tức thì vào Telegram / Zalo OA / Slack:</strong> Khi có khách hàng mới, hệ thống tự động gửi tin nhắn báo động vào nhóm chat nội bộ kèm đầy đủ Họ tên, SĐT, Sản phẩm quan tâm để Sales bấm gọi tư vấn ngay trong 60 giây.</li>
  <li><strong>Đánh giá và phân loại Lead (Lead Scoring):</strong> Tự động lọc lead rác, gắn tag nguồn quảng cáo (UTM Source, UTM Campaign) để đo lường chính xác kênh marketing nào mang lại đơn hàng thực tế.</li>
</ul>

<hr>

<h3>2. Hệ thống Tự động hóa Báo giá, Hợp đồng &amp; Email Marketing (Sales Automation)</h3>
<p>Tăng tốc độ chốt sales và chuẩn hóa quy trình chăm sóc khách hàng chuyên nghiệp:</p>
<ul>
  <li><strong>Tự động tạo Báo giá / Hợp đồng / Phiếu thu PDF:</strong> Chỉ với 1 cú click chuột hoặc đổi trạng thái đơn trên Sheet, hệ thống tự động điền thông tin khách hàng vào mẫu hợp đồng (Google Docs/Slides), kết xuất file PDF chất lượng cao và lưu trữ gọn gàng trên Google Drive.</li>
  <li><strong>Tự động gửi Email cá nhân hóa qua Gmail:</strong> Tự động gửi email báo giá kèm file PDF đính kèm cho khách hàng từ chính hòm thư Gmail của doanh nghiệp, với nội dung thay thế biến thông minh như <code>{{Ten_Khach_Hang}}</code>, <code>{{Gia_Tri_Don}}</code>, <code>{{Ngay_Hen}}</code>.</li>
  <li><strong>Chuỗi Email Drip chăm sóc &amp; Nhắc lịch tự động:</strong> Tự động gửi email nhắc lịch hẹn tư vấn trước 2 giờ, nhắc thanh toán công nợ khi đến hạn hoặc gửi thư cảm ơn, khảo sát độ hài lòng sau khi hoàn tất dịch vụ.</li>
</ul>

<hr>

<h3>3. Mini CRM &amp; Quản lý Đơn hàng, Tồn kho, Tiến độ Vận hành</h3>
<p>Xây dựng hệ thống quản trị trung tâm linh hoạt, dễ sử dụng cho mọi nhân sự:</p>
<ul>
  <li><strong>Quản lý Vòng đời Khách hàng (Pipeline CRM):</strong> Theo dõi trạng thái khách hàng qua các giai đoạn: Mới tiếp nhận &rarr; Đang tư vấn &rarr; Đã gửi báo giá &rarr; Chốt đơn &rarr; Chăm sóc sau bán.</li>
  <li><strong>Quản lý Đơn hàng &amp; Trừ tồn kho tự động:</strong> Ghi nhận đơn hàng, tự động cập nhật số lượng tồn kho theo thời gian thực và cảnh báo qua email/chat khi sản phẩm sắp hết hàng dưới ngưỡng an toàn.</li>
  <li><strong>Quản lý Tiến độ Dự án &amp; Giao việc nội bộ:</strong> Tự động gửi thông báo nhắc việc cho nhân sự phụ trách khi sắp đến hạn deadline (Trigger theo ngày tháng trên Google Sheet).</li>
  <li><strong>Phân quyền bảo mật dữ liệu:</strong> Thiết lập cơ chế phân quyền nâng cao, nhân viên sale chỉ nhìn thấy danh sách khách hàng của mình phụ trách, ngăn chặn rò rỉ cơ sở dữ liệu quan trọng của công ty.</li>
</ul>

<hr>

<h3>4. Tự động hóa Báo cáo Doanh thu, Chi phí Ads &amp; Dashboard Đo lường (BI &amp; Analytics)</h3>
<p>Giúp chủ doanh nghiệp và trưởng phòng nắm bắt toàn bộ bức tranh tài chính kinh doanh mọi lúc mọi nơi:</p>
<ul>
  <li><strong>Tự động đồng bộ Chi phí Quảng cáo:</strong> Tự động kéo dữ liệu chi tiêu hàng ngày từ Facebook Ads, Google Ads, TikTok Ads về Google Sheet qua API mà không cần mở từng trình quản lý quảng cáo để ghi chép.</li>
  <li><strong>Tính toán tự động chỉ số Hiệu quả (ROAS, ROI, CPA, CPL):</strong> Đối soát tự động giữa chi phí quảng cáo và doanh thu thực thu từ sales để ra bức tranh lãi/lỗ chuẩn xác theo từng ngày, từng chiến dịch.</li>
  <li><strong>Báo cáo tự động vào Telegram/Zalo Giám Đốc mỗi đêm:</strong> Đúng 22h00 hoặc 23h00 hàng ngày, bot tự động quét toàn bộ bảng tính, tổng hợp báo cáo tóm tắt (Doanh thu trong ngày, Chi phí Ads, Số lượng Lead, Nhân viên xuất sắc) và gửi thẳng vào Zalo/Telegram của Ban Lãnh Đạo.</li>
  <li><strong>Kết nối Báo cáo Trực quan Looker Studio:</strong> Xây dựng Dashboard biểu đồ trực quan, sống động trên Looker Studio (Google Data Studio) liên kết realtime với Google Sheets.</li>
</ul>

<hr>

<h3>5. Tích hợp Trí tuệ Nhân tạo AI (OpenAI GPT-4o, Gemini) trên Google Sheets</h3>
<p>Nâng cấp bảng tính của bạn thành trợ lý AI thông minh xử lý dữ liệu hàng loạt:</p>
<ul>
  <li><strong>AI Tóm tắt &amp; Phân tích phản hồi khách hàng:</strong> Đọc hàng trăm đánh giá, phản hồi của khách hàng và tự động phân loại cảm xúc (Tích cực / Tiêu cực / Góp ý) và trích xuất điểm cần cải thiện.</li>
  <li><strong>AI Soạn thảo nội dung &amp; Dịch thuật hàng loạt:</strong> Tự động tạo mô tả sản phẩm chuẩn SEO, viết caption quảng cáo hoặc dịch thuật dữ liệu đa ngôn ngữ trực tiếp trên từng ô của Google Sheet.</li>
  <li><strong>AI Trích xuất hóa đơn &amp; Chứng từ (OCR):</strong> Tự động đọc ảnh chụp hóa đơn, bill chuyển khoản ngân hàng, file PDF trong Google Drive và điền thông tin số tiền, mã số thuế, ngày giao dịch vào Sheet.</li>
</ul>

<hr>

<h2>Lợi thế Vượt trội khi Triển khai Tự động hóa với Google Sheets &amp; Apps Script</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
  <thead>
    <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
      <th style="padding: 12px 16px;">Tiêu chí so sánh</th>
      <th style="padding: 12px 16px; color: #d97706;">Hệ thống Sheets + Apps Script Custom</th>
      <th style="padding: 12px 16px; color: #71717a;">Phần mềm SaaS đóng gói sẵn</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Chi phí định kỳ</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">0đ / tháng (Dùng trọn đời trên Google Workspace)</td>
      <td style="padding: 12px 16px; color: #dc2626;">500.000đ - 5.000.000đ+ / tháng (Tính theo user)</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Mức độ tùy biến</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">100% may đo theo đúng quy trình riêng của bạn</td>
      <td style="padding: 12px 16px; color: #dc2626;">Khuôn mẫu cứng nhắc, phải sửa quy trình theo phần mềm</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Thời gian triển khai</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Rất nhanh (Chỉ từ 3 - 10 ngày là chạy thực tế)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Mất 1 - 3 tháng cài đặt và đào tạo nhân sự</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Độ quen thuộc nhân sự</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Ai cũng biết dùng Google Sheets, không cần đào tạo lại</td>
      <td style="padding: 12px 16px; color: #dc2626;">Giao diện phức tạp, nhân viên ngại dùng và dễ bỏ cuộc</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Làm chủ dữ liệu</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">100% dữ liệu nằm trên Google Drive chính chủ của doanh nghiệp</td>
      <td style="padding: 12px 16px; color: #dc2626;">Dữ liệu lưu trên máy chủ bên thứ ba, rủi ro khi ngừng gói</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Quy trình Triển khai Dự án 4 Bước Tinh Gọn</h2>

<h3>Bước 1: Khảo sát &amp; Phân tích Điểm nghẽn (1 - 2 ngày)</h3>
<p>Chúng tôi cùng bạn rà soát toàn bộ file bảng tính và quy trình làm việc hiện tại: Lead từ đâu về, ai xử lý, bước nào đang tốn nhiều thời gian nhất, lỗi sai thường xảy ra ở khâu nào. Từ đó xác định chính xác luồng tự động hóa cần xây dựng.</p>

<h3>Bước 2: Thiết kế Kiến trúc &amp; Lập trình Apps Script (3 - 5 ngày)</h3>
<p>Chuẩn hóa cấu trúc cơ sở dữ liệu trên Google Sheets, thiết lập Webhook đón dữ liệu từ quảng cáo/website, viết mã nguồn Google Apps Script tối ưu hiệu năng, kết nối các cổng API (Telegram, Zalo OA, Gmail, OpenAI, Meta Marketing API).</p>

<h3>Bước 3: Chạy Thử nghiệm (Test Case) &amp; Tinh chỉnh (2 - 3 ngày)</h3>
<p>Cho hệ thống chạy thử nghiệm với dữ liệu giả lập và dữ liệu thực tế. Kiểm tra kỹ lưỡng các trường hợp ngoại lệ (mạng chậm, dữ liệu nhập thiếu, trùng lặp số điện thoại) để đảm bảo hệ thống vận hành trơn tru 100%.</p>

<h3>Bước 4: Bàn giao, Video Hướng dẫn &amp; Bảo hành Dài hạn</h3>
<p>Bàn giao toàn bộ quyền sở hữu mã nguồn và file Google Sheet cho tài khoản Google của bạn. Cung cấp tài liệu kèm video hướng dẫn từng bước chi tiết cho nhân viên. Hỗ trợ bảo hành kỹ thuật, khắc phục sự cố và nâng cấp luồng nghiệp vụ khi doanh nghiệp mở rộng quy mô.</p>

<hr>

<h2>Đối tượng Doanh nghiệp Phù hợp nhất</h2>
<ul>
  <li><strong>Các doanh nghiệp vừa và nhỏ (SMEs), hộ kinh doanh cá thể</strong> muốn tối ưu chi phí và tăng năng suất lao động.</li>
  <li><strong>Đội ngũ Marketing &amp; E-commerce:</strong> Đang chạy quảng cáo đa kênh (Facebook, TikTok, Google) và cần gom lead, chia lead tức thì cho sales.</li>
  <li><strong>Các công ty dịch vụ, tư vấn, đại lý (Agency, Du lịch, Bất động sản, Spa, Nha khoa, Giáo dục/Khóa học):</strong> Cần quản lý lịch hẹn, xuất hợp đồng/báo giá PDF và gửi email tự động cho khách hàng.</li>
  <li><strong>Chủ doanh nghiệp, Quản lý:</strong> Muốn xem báo cáo tài chính, doanh thu, lãi lỗ theo thời gian thực mà không cần phụ thuộc vào việc nhân viên nộp báo cáo thủ công.</li>
</ul>',
  'FileSpreadsheet',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
  'published',
  'Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp | Nguyễn Trọng Hữu',
  'Dịch vụ xây dựng hệ thống tự động hóa vận hành, quản lý đơn hàng/lead và tối ưu Marketing bằng Google Apps Script & Google Sheets cho doanh nghiệp vừa và nhỏ.'
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
