-- Thêm dịch vụ "Tự Động Hóa Vận Hành Ads với AI Agent Trong ChatGPT" vào Supabase
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
  'Tự Động Hóa Vận Hành Ads với AI Agent Trong ChatGPT',
  'chatgpt-ads-agent-automation',
  'Xây dựng hệ thống AI Agent kết nối trực tiếp tài khoản Ads với ChatGPT. Tự động đọc bài đăng mới trên Fanpage, nhận diện từ khóa đưa vào Campaign theo rule, kéo chỉ số realtime (CTR, CPM, CPC, CPA, ROAS) và hỏi đáp điều khiển chiến dịch 100% bằng ngôn ngữ tự nhiên.',
  '<h2>Cuộc Cách Mạng Vận Hành Ads: Từ F5 Trình Quản Lý Sang Giao Tiếp Tự Nhiên Với AI Agent Trong ChatGPT</h2>
<p>Đối với các chủ doanh nghiệp, nhà bán lẻ và chuyên gia chạy quảng cáo (Media Buyer), việc quản lý chiến dịch quảng cáo đa kênh thường là một "vòng xoáy lặp lại" đầy áp lực:</p>
<ul>
  <li><strong>Mất hàng giờ mỗi ngày ngồi canh Trình quản lý quảng cáo (Ads Manager):</strong> Phải mở hàng chục tab trình duyệt, F5 liên tục để kiểm tra chỉ số chi tiêu, xem ads có cắn tiền không, có nhóm nào bị đắt bất thường không.</li>
  <li><strong>Thao tác thủ công khi có bài đăng mới:</strong> Mỗi khi Fanpage đăng bài viết hoặc video mới, nhân sự phải vào Ads Manager, tạo chiến dịch hoặc nhóm quảng cáo mới, chọn lại bài post ID, gắn tệp đối tượng và cài đặt ngân sách thủ công.</li>
  <li><strong>Phát hiện nhóm lãng phí ngân sách quá chậm:</strong> Khi một nhóm quảng cáo bị bão hòa (Ad Fatigue) hoặc CPA tăng vọt, nếu người quản lý không kịp thời phát hiện thì hàng triệu đồng ngân sách đã bị "đốt" oan uổng.</li>
  <li><strong>Tổng hợp báo cáo số liệu khô khan và tốn thời gian:</strong> Cuối ngày phải xuất file Excel, ghép số liệu từ nhiều chiến dịch rồi tính toán thủ công để báo cáo cho cấp quản lý.</li>
</ul>
<p><strong>Giải pháp đột phá của chúng tôi:</strong> Xây dựng <strong>Hệ Thống AI Agent Vận Hành Quảng Cáo Tự Động Kết Nối Trực Tiếp Với ChatGPT</strong>. Hệ thống kết nối API chính thức (Meta Marketing API / TikTok Ads API / Google Ads API) với mô hình AI trong ChatGPT, giúp bạn tự động hóa trọn vẹn quy trình từ <strong>Đăng bài &rarr; Lên Ads theo rule &rarr; Giám sát chỉ số realtime &rarr; Tối ưu hóa &amp; Báo cáo</strong> chỉ thông qua giao diện trò chuyện tự nhiên.</p>

<hr>

<h2>Kiến Trúc &amp; 6 Năng Lực Vận Hành Đỉnh Cao Của ChatGPT Ads Agent</h2>

<h3>1. Tự Động Quét Bài Viết Mới Trên Page &amp; Thiết Lập Luồng Quảng Cáo Theo Quy Tắc (Rule-based Post-to-Ad)</h3>
<p>Không cần bất kỳ thao tác tay nào trong Ads Manager khi đăng nội dung mới:</p>
<ul>
  <li><strong>Tự động lắng nghe Fanpage 24/7:</strong> Ngay khi đội ngũ Content xuất bản một bài viết hoặc video Reels mới trên Fanpage, AI Agent sẽ lập tức nhận diện và xử lý.</li>
  <li><strong>Nhận diện từ khóa &amp; Ý định thông minh (AI Intent &amp; Keyword Extraction):</strong> AI đọc nội dung bài viết, phát hiện từ khóa sản phẩm, mức giá, chương trình khuyến mãi (ví dụ: "Sale 50%", "Bất động sản cao cấp", "Khóa học AI").</li>
  <li><strong>Tự động đưa bài viết vào đúng Campaign / Ad Set mục tiêu:</strong> Dựa trên bộ quy tắc (Rules) đã thiết lập, Agent tự động gắn Post ID vào nhóm quảng cáo tương ứng, áp dụng tệp đối tượng chuẩn và kích hoạt phân phối ngay lập tức.</li>
</ul>

<hr>

<h3>2. Kéo Trực Tiếp Chỉ Số Đo Lường Realtime Về ChatGPT (Realtime Ads Metric Extraction)</h3>
<p>Truy xuất mọi dữ liệu kỹ thuật số chuẩn xác 100% qua API chính thức mà không cần mở trình quản lý quảng cáo:</p>
<ul>
  <li><strong>Đầy đủ mọi chỉ số quan trọng:</strong> CPM (Chi phí / 1.000 lượt hiển thị), CTR (Tỷ lệ nhấp), CPC (Chi phí / nhấp chuột), Số tin nhắn mới (MCS), Số lượt điền Lead, Chi phí trên mỗi kết quả (CPA) và Lợi nhuận trên chi phí quảng cáo (ROAS).</li>
  <li><strong>Cập nhật tức thì:</strong> Dữ liệu được đồng bộ liên tục theo thời gian thực (Realtime), đảm bảo mọi quyết định điều chỉnh đều dựa trên số liệu mới nhất trong ngày.</li>
</ul>

<hr>

<h3>3. Phân Tích Đa Tầng (Campaign &rarr; Ad Set &rarr; Ads) &amp; Tự Động Phát Hiện Nhóm Lãng Phí</h3>
<p>AI Agent đóng vai trò như một chuyên gia Data Analyst cao cấp chuyên sâu về Performance Marketing:</p>
<ul>
  <li><strong>So sánh hiệu suất đa tầng:</strong> Đối chiếu chéo giữa các Campaign, nhóm quảng cáo (Ad Set) và từng mẫu quảng cáo (Ads creative) để tìm ra đâu là "ngôi sao sinh lời" và đâu là "hố đen đốt tiền".</li>
  <li><strong>Phân tích tệp đối tượng &amp; Lookalike:</strong> Đo lường phản hồi của từng nhóm tuổi, giới tính, khu vực địa lý và tệp Custom Audience / Lookalike để tìm ra tệp khách hàng mua hàng tiềm năng nhất.</li>
  <li><strong>Cảnh báo lãng phí ngân sách (Budget Drain Detection):</strong> Tự động phát hiện các nhóm quảng cáo có chi phí chi tiêu cao nhưng tỷ lệ chuyển đổi thấp hoặc tần suất hiển thị (Frequency) quá cao gây nhàm chán.</li>
</ul>

<hr>

<h3>4. Hỏi Đáp &amp; Điều Khiển Chiến Dịch Bằng Ngôn Ngữ Tự Nhiên Ngay Trong ChatGPT</h3>
<p>Bạn không cần phải nhớ các thuật ngữ kỹ thuật phức tạp, chỉ cần mở ChatGPT trên điện thoại hoặc máy tính và trò chuyện như với một nhân viên cấp cao:</p>
<div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px 20px; margin: 20px 0; border-radius: 4px;">
  <p style="margin-bottom: 8px; font-weight: bold; color: #1e40af;">💬 Ví dụ các câu lệnh bạn có thể hỏi ChatGPT:</p>
  <ul style="margin: 0; padding-left: 20px; color: #334155;">
    <li><em>"Hôm nay tổng ngân sách đã tiêu bao nhiêu, chi phí trên mỗi tin nhắn trung bình là bao nhiêu?"</em></li>
    <li><em>"Bài viết mới đăng lúc 9h sáng nay đã được đưa vào chiến dịch nào rồi?"</em></li>
    <li><em>"Nhóm quảng cáo nào đang có ROAS trên 4.0 để mình tăng thêm ngân sách?"</em></li>
    <li><em>"So sánh hiệu quả giữa mẫu video review và bài viết dạng album ảnh tuần này xem định dạng nào rẻ hơn?"</em></li>
    <li><em>"Tắt ngay những nhóm quảng cáo có CPA vượt quá 100.000đ giúp tôi."</em></li>
  </ul>
</div>

<hr>

<h3>5. Đề Xuất Creative, Target &amp; Hướng Scale Dựa Trên Dữ Liệu Thực Tế</h3>
<p>Không còn cảnh "đoán mò" xem nên làm gì tiếp theo:</p>
<ul>
  <li><strong>Đề xuất góc tiếp cận mới (Creative Angles):</strong> Phân tích lý do vì sao mẫu quảng cáo chiến thắng (Winning Ad) lại hiệu quả, từ đó gợi ý tiêu đề, hook và kịch bản video tương tự để nhân bản.</li>
  <li><strong>Chiến lược Scale ngân sách an toàn:</strong> Gợi ý tăng ngân sách bao nhiêu phần trăm (theo quy tắc 20% an toàn) hoặc nhân bản sang tệp Lookalike nào để tránh bị "bão hòa tệp" và sốc giá thầu.</li>
</ul>

<hr>

<h3>6. Tự Động Lập Báo Cáo Định Kỳ Gửi Về Telegram &amp; ChatGPT</h3>
<p>Báo cáo tài chính và hiệu suất quảng cáo luôn sẵn sàng mà không cần nhân viên gõ tay:</p>
<ul>
  <li><strong>Báo cáo tóm tắt 2 khung giờ vàng:</strong> 12h00 trưa (đánh giá nửa ngày) và 22h00 đêm (tổng kết cả ngày) tự động gửi vào nhóm Telegram của Ban giám đốc và đội ngũ Marketing.</li>
  <li><strong>Định dạng trực quan, dễ hiểu:</strong> Bảng tổng hợp chi tiêu, doanh thu ước tính, số đơn/lead và danh sách các hành động AI Agent đã thực hiện trong ngày.</li>
</ul>

<hr>

<h2>Bảng So Sánh Hiệu Quả Vượt Trội</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
  <thead>
    <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
      <th style="padding: 12px 16px;">Tiêu chí so sánh</th>
      <th style="padding: 12px 16px; color: #d97706;">ChatGPT Ads Operations AI Agent</th>
      <th style="padding: 12px 16px; color: #71717a;">Media Buyer Thao Tác Thủ Công</th>
      <th style="padding: 12px 16px; color: #71717a;">Tool Quản Lý Ads Truyền Thống</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Giao diện điều khiển</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Chat tự nhiên bằng Tiếng Việt trong ChatGPT / Telegram</td>
      <td style="padding: 12px 16px; color: #dc2626;">Ads Manager phức tạp, chậm chạp</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Dashboard số liệu rối mắt, khó tùy biến</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Đưa bài mới vào Ads</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tự động 100% (AI nhận diện từ khóa &amp; gắn vào Ad Set)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Phải lấy Post ID và tạo Ad thủ công từng bài</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Cần cấu hình rule phức tạp</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Thời gian phản ứng khi Ads lỗi</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tức thì 24/7 (Cảnh báo ngay khi CPM/CPA tăng bất thường)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Phụ thuộc giờ làm việc của nhân sự, dễ cháy ngân sách đêm</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Chỉ ngắt theo rule cứng, không có phân tích thông minh</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Phân tích &amp; Đề xuất scale</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">AI giải thích nguyên nhân và đưa đề xuất creative &amp; ngân sách</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Tùy thuộc trình độ và kinh nghiệm của từng người</td>
      <td style="padding: 12px 16px; color: #dc2626;">Không có khả năng tư vấn chiến lược</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Chi phí vận hành</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Đầu tư 1 lần, không mất phí thuê bao phần mềm hàng tháng</td>
      <td style="padding: 12px 16px; color: #dc2626;">8.000.000đ - 15.000.000đ/tháng lương nhân sự</td>
      <td style="padding: 12px 16px; color: #dc2626;">2.000.000đ - 8.000.000đ/tháng phí SaaS</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Ứng Dụng Thực Tế Cho Từng Mô Hình Doanh Nghiệp</h2>
<ul>
  <li><strong>Shop Bán Lẻ &amp; Doanh Nghiệp E-commerce:</strong> Đăng hàng chục mẫu sản phẩm mới mỗi tuần, hệ thống tự động đưa vào camp test, lọc ra sản phẩm win và đề xuất ngân sách scale lớn.</li>
  <li><strong>Bất Động Sản &amp; Cho Thuê:</strong> Tự động quét các bài viết rao bán dự án mới trên Fanpage và phân bổ ngay vào các tệp đối tượng theo khu vực địa lý tương ứng.</li>
  <li><strong>Thẩm Mỹ Viện, Nha Khoa, Spa &amp; Dịch Vụ Y Tế:</strong> Tự động giám sát chi phí trên mỗi lượt nhắn tin tư vấn (Cost per Message), ngắt ngay các mẫu quảng cáo vượt ngưỡng trần chi phí.</li>
  <li><strong>Đội Ngũ Agency Marketing:</strong> Quản lý cùng lúc hàng chục tài khoản quảng cáo của khách hàng, hỏi đáp nhanh báo cáo tiến độ chỉ bằng vài câu lệnh trên ChatGPT.</li>
</ul>

<hr>

<h2>Quy Trình 4 Bước Triển Khai May Đo Cho Doanh Nghiệp</h2>

<h3>Bước 1: Khảo Sát Tài Khoản &amp; Thiết Kế Bộ Quy Tắc Phân Loại Bài Đăng (1 - 2 ngày)</h3>
<p>Làm việc cùng bạn để rà soát cấu trúc chiến dịch hiện tại, xây dựng ma trận từ khóa (Keyword Matrix) để AI nhận diện đúng bài đăng và gán đúng Ad Set tương ứng.</p>

<h3>Bước 2: Kết Nối API &amp; Xây Dựng AI Agent / MCP Server Chuyên Biệt (3 - 5 ngày)</h3>
<p>Thiết lập kết nối an toàn với Meta Marketing API / TikTok Ads API, xây dựng MCP Server hoặc AI Agent thông minh tích hợp vào ChatGPT Custom Actions.</p>

<h3>Bước 3: Cài Đặt Luồng Giám Sát Realtime &amp; Cấu Hình Bot Báo Cáo Telegram (2 - 3 ngày)</h3>
<p>Lập trình workflow tự động hóa theo dõi chỉ số, thiết lập ngưỡng cảnh báo (Alert Triggers) và kết nối Bot gửi thông báo định kỳ vào nhóm chat Telegram của bạn.</p>

<h3>Bước 4: Chạy Thử Nghiệm Thực Tế, Bàn Giao &amp; Hướng Dẫn Vận Hành</h3>
<p>Chạy thử nghiệm hệ thống trong 2-3 ngày với ngân sách thực tế, tinh chỉnh độ chính xác đạt 100%. Bàn giao toàn bộ quyền quản trị, mã nguồn và tài liệu video hướng dẫn chi tiết.</p>',
  'Zap',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
  'published',
  'Tự Động Hóa Vận Hành Ads với AI Agent Trong ChatGPT | Nguyễn Trọng Hữu',
  'Dịch vụ setup hệ thống AI Agent kết nối Ads Manager với ChatGPT: tự động đưa bài mới vào ads theo rule, giám sát chỉ số realtime và hỏi đáp điều khiển ads bằng ngôn ngữ tự nhiên.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  cover_image = EXCLUDED.cover_image,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  status = EXCLUDED.status,
  updated_at = NOW();
