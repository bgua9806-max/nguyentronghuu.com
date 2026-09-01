-- Thêm dịch vụ "Setup Hệ thống Tự Động Đăng Bài Đa Kênh" vào Supabase
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
  'Setup Hệ thống Tự Động Đăng Bài Đa Kênh (Omnichannel Auto-Posting)',
  'multi-channel-auto-posting',
  'Xây dựng hệ thống tự động hóa phân phối nội dung đa nền tảng (Facebook Fanpage/Group/Reels, TikTok, YouTube Shorts, Instagram Reels, Threads, Zalo, LinkedIn). Quản lý tập trung từ Sheets/Notion, AI tự động tối ưu định dạng và hẹn giờ đăng tải 24/7.',
  '<h2>Cuộc Cách Mạng Phân Phối Nội Dung Đa Kênh: Từ Đăng Thủ Công Sang Tự Động Hóa Toàn Diện</h2>
<p>Trong kỷ nguyên bùng nổ của Video ngắn (Short-form video) và chiến lược tiếp thị đa điểm chạm (Omnichannel Marketing), việc xuất hiện đồng thời trên tất cả các nền tảng mạng xã hội không còn là lựa chọn, mà là <strong>yếu tố sống còn</strong> để doanh nghiệp chiếm lĩnh thị phần và xây dựng thương hiệu. Tuy nhiên, hơn 90% doanh nghiệp và nhà sáng tạo nội dung đang bị mắc kẹt trong những rào cản vận hành cực kỳ mệt mỏi:</p>
<ul>
  <li><strong>Tốn 3 - 4 tiếng mỗi ngày cho các tác vụ lặp lại:</strong> Nhân sự phải tải video/hình ảnh từ Drive về máy, đăng nhập lần lượt từng tài khoản (Facebook Page, Facebook Group, TikTok, YouTube Shorts, Instagram, Threads, Zalo OA, LinkedIn...), copy/paste từng đoạn caption, gõ lại hashtag thủ công.</li>
  <li><strong>Bỏ lỡ khung giờ vàng tương tác:</strong> Do bận việc đột xuất hoặc quên lịch, bài viết thường xuyên bị đăng trễ hoặc không đúng thời điểm có lượng người dùng online cao nhất.</li>
  <li><strong>Không thể mở rộng mạng lưới kênh vệ tinh:</strong> Doanh nghiệp muốn nhân bản 10 - 50 kênh vệ tinh (Matrix Channel) để phủ sóng thị trường nhưng chi phí thuê nhân sự đăng bài quá tốn kém và khó kiểm soát chất lượng.</li>
  <li><strong>Nội dung không tối ưu theo đặc thù từng kênh:</strong> Đăng nguyên văn một đoạn text từ Facebook sang TikTok hay LinkedIn mà không chỉnh sửa định dạng, khiến thuật toán phân phối kém và bài viết giảm tương tác nghiêm trọng.</li>
  <li><strong>Phần mềm SaaS nước ngoài đắt đỏ và bất tiện:</strong> Các nền tảng như Buffer, Hootsuite, Later tính phí thuê bao hàng tháng rất đắt, giới hạn số tài khoản kết nối và không hỗ trợ các kênh nội địa quan trọng tại Việt Nam như Zalo hay Facebook Group.</li>
</ul>
<p><strong>Giải pháp của chúng tôi:</strong> Thiết kế và thiết lập <strong>Hệ thống Tự Động Đăng Bài Đa Kênh May Đo 100%</strong> (Omnichannel Content Distribution Engine). Chỉ cần soạn nội dung hoặc thả file video/ảnh vào <strong>Google Sheets, Notion hoặc Web Portal</strong> một lần duy nhất, Trí tuệ Nhân tạo (AI) sẽ tự động tối ưu hóa định dạng cho từng kênh và hệ thống tự động phân phối theo đúng lịch trình định sẵn 24/7.</p>

<hr>

<h2>Kiến Trúc 5 Trụ Cột Cốt Lõi Của Hệ Thống Tự Động Đăng Bài Đa Kênh</h2>

<h3>1. Trung Tâm Nhập Liệu &amp; Kho Nội Dung Tập Trung (Central Content Hub)</h3>
<p>Loại bỏ hoàn toàn việc chuyển đổi qua lại giữa hàng chục ứng dụng, toàn bộ đội ngũ làm việc trên một giao diện quen thuộc duy nhất:</p>
<ul>
  <li><strong>Quản lý trên Google Sheets / Notion / Airtable:</strong> Bảng kế hoạch nội dung trực quan với các cột: <em>Tiêu đề, Nội dung gốc, Link Media (Google Drive/Cloud), Kênh chỉ định, Ngày &amp; Giờ đăng, Trạng thái (Draft / Ready / Scheduled / Published)</em>.</li>
  <li><strong>Hỗ trợ đa dạng định dạng nội dung:</strong> Tự động xử lý Video ngắn (Reels, TikTok, Shorts 9:16), Video dài (16:9), Bài viết kèm 1 ảnh, Album nhiều ảnh (Carousel post), Text status thuần túy.</li>
  <li><strong>Tự động kéo file từ Google Drive / Cloudflare R2:</strong> Bạn chỉ cần lưu video/ảnh vào thư mục Drive, hệ thống tự động lấy file gốc chất lượng cao và đẩy lên các mạng xã hội mà không làm giảm độ phân giải.</li>
</ul>

<hr>

<h3>2. Động Cơ AI Tối Ưu Định Dạng Riêng Biệt Cho Từng Nền Tảng (AI Adaptation Engine)</h3>
<p>Không bao giờ đăng một nội dung rập khuôn lên mọi kênh. Mô hình AI (OpenAI GPT-4o / Google Gemini) được cấu hình riêng để "may đo" nội dung theo đúng hành vi người dùng từng nền tảng:</p>
<ul>
  <li><strong>Facebook Fanpage &amp; Group:</strong> Viết caption hấp dẫn, đặt câu hỏi gợi mở thảo luận (Engagement Hooks) và gắn hashtag phù hợp với thuật toán Facebook.</li>
  <li><strong>TikTok &amp; Instagram Reels:</strong> Tự động rút gọn caption súc tích, giật tít bắt trend (Viral Hooks), trích xuất 5 - 7 hashtag thịnh hành nhất theo chủ đề video.</li>
  <li><strong>YouTube Shorts &amp; Video:</strong> Tự động sinh tiêu đề chuẩn SEO có chứa từ khóa tìm kiếm cao, sinh đoạn mô tả chi tiết kèm mốc thời gian (Timestamps) và bộ tags phân loại video.</li>
  <li><strong>Threads &amp; X (Twitter):</strong> Tách bài viết dài thành chuỗi bài ngắn (Thread series) mạch lạc, súc tích, kích thích người đọc chia sẻ lại (Repost).</li>
  <li><strong>LinkedIn:</strong> Viết lại với văn phong chuyên nghiệp, định dạng theo lối tư duy lãnh đạo (Thought Leadership), bổ sung bài học thực tiễn và lời kêu gọi kết nối kinh doanh.</li>
  <li><strong>Zalo OA &amp; Zalo Video:</strong> Tối ưu tiêu đề ngắn gọn, đính kèm nút kêu gọi hành động (CTA) như "Nhắn tin Zalo ngay", "Xem chi tiết ưu đãi".</li>
</ul>

<hr>

<h3>3. Động Cơ Phân Phối Tự Động Lên 7+ Nền Tảng Mạng Xã Hội (Omnichannel Publisher)</h3>
<p>Hệ thống tự động kết nối qua Official API và Automation Pipeline hiện đại, đảm bảo đăng tải chuẩn xác, đúng định dạng và an toàn tuyệt đối:</p>
<ul>
  <li><strong>Facebook Ecosystem:</strong> Tự động đăng lên Fanpage (Video, Reels, Post ảnh), trang cá nhân và tự động đăng bài vào các Facebook Group do doanh nghiệp quản trị.</li>
  <li><strong>TikTok:</strong> Tự động đẩy video trực tiếp lên kênh TikTok kèm caption, gắn hashtag, bật/tắt quyền bình luận/duet.</li>
  <li><strong>YouTube:</strong> Tự động upload video lên YouTube channel, đặt chế độ công khai/hẹn giờ, gắn danh mục (Category) và chọn ảnh thumbnail tự động.</li>
  <li><strong>Instagram:</strong> Đăng trực tiếp hình ảnh đơn, Album ảnh lướt (Carousel) và video Reels lên Instagram Business/Creator Account.</li>
  <li><strong>Threads:</strong> Tự động đăng tải status văn bản, hình ảnh hoặc link bài viết trực tiếp lên tài khoản Threads.</li>
  <li><strong>Zalo (Zalo OA &amp; Zalo Group):</strong> Đăng bài viết lên Zalo Official Account hoặc gửi thông báo bài đăng mới vào nhóm Zalo chăm sóc khách hàng.</li>
  <li><strong>LinkedIn &amp; Website WordPress:</strong> Tự động tạo bài viết trên trang cá nhân / Company Page LinkedIn và đồng bộ bài viết chuẩn SEO lên Blog WordPress / Web cá nhân.</li>
</ul>

<hr>

<h3>4. Lên Lịch Đăng Bài Thông Minh &amp; Cơ Chế Anti-Ban An Toàn (Smart Scheduler &amp; Anti-Ban)</h3>
<p>Đảm bảo bài viết luôn lên đúng "thời điểm vàng" và tài khoản của bạn được bảo vệ tuyệt đối trước các chính sách kiểm duyệt khắt khe:</p>
<ul>
  <li><strong>Hẹn giờ theo khung giờ vàng từng nền tảng:</strong> Mỗi kênh có thói quen người dùng khác nhau (ví dụ: TikTok buổi tối 20h - 22h, LinkedIn sáng 8h - 9h, Facebook trưa 11h30 - 13h). Hệ thống cho phép cài đặt khung giờ đăng riêng cho từng kênh độc lập.</li>
  <li><strong>Cơ chế Smart Delay (Giãn cách ngẫu nhiên):</strong> Tự động tạo độ trễ ngẫu nhiên từ 3 - 7 phút giữa các lần đăng chéo nền tảng để tránh hành vi giống bot, giảm thiểu tối đa rủi ro bị thuật toán đánh dấu spam.</li>
  <li><strong>Kiểm tra chất lượng trước khi đăng (Pre-flight Validation):</strong> Tự động kiểm tra độ dài video, định dạng file, kích thước ảnh và số lượng ký tự caption trước khi bắn API. Nếu có lỗi, hệ thống sẽ cảnh báo ngay lập tức thay vì để bài đăng thất bại.</li>
</ul>

<hr>

<h3>5. Bot Giám Sát Realtime &amp; Báo Cáo Kết Quả Qua Telegram / Zalo</h3>
<p>Nắm bắt mọi diễn biến của chiến dịch phân phối nội dung ngay trên điện thoại di động:</p>
<ul>
  <li><strong>Thông báo tức thì khi đăng thành công:</strong> Ngay khi bài viết lên sóng, Bot Telegram/Zalo sẽ gửi tin nhắn kèm <strong>Link trực tiếp</strong> của bài đăng trên từng nền tảng (Link Facebook, Link TikTok, Link YouTube...) để bạn click vào kiểm tra ngay.</li>
  <li><strong>Cảnh báo sự cố khẩn cấp:</strong> Nếu có bất kỳ lỗi nào (như Access Token hết hạn, file video sai định dạng, mạng chập chờn), Bot sẽ thông báo cụ thể nguyên nhân và hướng dẫn xử lý chỉ sau 5 giây.</li>
  <li><strong>Báo cáo tổng kết tuần &amp; tháng:</strong> Thống kê số lượng bài đã xuất bản, tỷ lệ thành công 100% và nhật ký đăng tải (Log system) minh bạch.</li>
</ul>

<hr>

<h2>Bảng So Sánh Hiệu Quả Vượt Trội</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
  <thead>
    <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
      <th style="padding: 12px 16px;">Tiêu chí so sánh</th>
      <th style="padding: 12px 16px; color: #d97706;">Hệ thống Tự Động May Đo (Custom Engine)</th>
      <th style="padding: 12px 16px; color: #71717a;">Nhân Viên Đăng Thủ Công</th>
      <th style="padding: 12px 16px; color: #71717a;">Phần Mềm SaaS Nước Ngoài (Hootsuite, Buffer)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Thời gian thao tác</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Chỉ 5 phút (Nhập Sheets 1 lần)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Mất 2 - 4 tiếng mỗi ngày</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Mất 30 - 45 phút setup</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Chi phí định kỳ</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">0đ / tháng (Sở hữu trọn đời)</td>
      <td style="padding: 12px 16px; color: #dc2626;">6.000.000đ - 12.000.000đ/tháng lương nhân sự</td>
      <td style="padding: 12px 16px; color: #dc2626;">2.000.000đ - 10.000.000đ+/tháng gói Pro</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Số lượng tài khoản kết nối</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Không giới hạn kênh &amp; tài khoản</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Giới hạn theo sức người</td>
      <td style="padding: 12px 16px; color: #dc2626;">Bị giới hạn số kênh (phải trả thêm tiền nếu thêm kênh)</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Hỗ trợ nền tảng tại VN</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Đầy đủ: FB Group, Zalo OA, Threads, TikTok, Reels</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Có</td>
      <td style="padding: 12px 16px; color: #dc2626;">Không hỗ trợ Zalo, hạn chế Facebook Group</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">AI Tối ưu định dạng từng kênh</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tự động viết lại caption &amp; hashtag riêng cho từng kênh</td>
      <td style="padding: 12px 16px; color: #dc2626;">Thường lười, copy nguyên văn từ kênh này sang kênh khác</td>
      <td style="padding: 12px 16px; color: #ca8a04;">AI cơ bản, không có prompt chuyên sâu tiếng Việt</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Làm chủ mã nguồn &amp; Dữ liệu</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">100% hệ thống và dữ liệu nằm trên hạ tầng của bạn</td>
      <td style="padding: 12px 16px; color: #ca8a04;">Phân tán</td>
      <td style="padding: 12px 16px; color: #dc2626;">Phụ thuộc máy chủ bên thứ ba, mất dữ liệu khi ngừng gói</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Ứng Dụng Thực Tế Cho Từng Mô Hình Doanh Nghiệp</h2>
<ul>
  <li><strong>Doanh nghiệp Bán lẻ &amp; E-commerce:</strong> Đăng hàng loạt video giới thiệu sản phẩm, feedback khách hàng, chương trình flash sale lên đồng thời TikTok Shop, Facebook Reels, YouTube Shorts, Instagram để tối đa hóa điểm chạm chuyển đổi.</li>
  <li><strong>Chuyên gia, Diễn giả, Giảng viên &amp; KOLs / KOCs:</strong> Xây dựng thương hiệu cá nhân phủ sóng đa nền tảng. Chia sẻ kiến thức 1 lần, AI tự động tách thành bài viết chuyên sâu trên LinkedIn, status tương tác trên Facebook, video ngắn trên TikTok/Reels và thread thảo luận trên Threads.</li>
  <li><strong>Agency Marketing &amp; Media Publisher:</strong> Quản trị việc đăng bài cho hàng chục khách hàng và quản lý hàng trăm Fanpage/kênh TikTok vệ tinh mà chỉ cần 1 nhân sự phụ trách điều phối.</li>
  <li><strong>Bất Động Sản, Thẩm Mỹ / Spa, Du Lịch &amp; Nhà Hàng:</strong> Tự động đăng các dự án mở bán, hình ảnh liệu trình làm đẹp, tour du lịch theo lịch trình cố định mỗi ngày, không bao giờ bị đứt đoạn tương tác.</li>
</ul>

<hr>

<h2>Quy Trình Triển Khai Dịch Vụ 4 Bước May Đo</h2>

<h3>Bước 1: Khảo Sát Kênh Mạng Xã Hội &amp; Thiết Kế Luồng Nội Dung (1 - 2 ngày)</h3>
<p>Làm việc cùng bạn để thống kê danh sách tài khoản cần kết nối (Facebook, TikTok, YouTube, Instagram, Threads, Zalo...), phân tích định dạng nội dung chủ đạo (Video/Ảnh/Text) và thống nhất khung giờ đăng cho từng kênh.</p>

<h3>Bước 2: Thiết Lập Content Hub &amp; Kết Nối Các Cổng API Chính Thức (2 - 3 ngày)</h3>
<p>Xây dựng bảng quản trị nội dung trên Google Sheets / Notion / Web App, tạo ứng dụng Developer và kết nối API trực tiếp từ Meta (Facebook/Instagram/Threads), TikTok API, Google YouTube Data API, Zalo OA API.</p>

<h3>Bước 3: Lập Trình Pipeline Tự Động Hóa, Cấu Hình AI &amp; Bộ Lên Lịch (3 - 4 ngày)</h3>
<p>Xây dựng workflow xử lý bằng <strong>n8n / Make / Custom Automation Engine</strong>. Cấu hình Prompt AI tối ưu caption &amp; hashtag đa kênh, thiết lập cơ chế kiểm tra định dạng và thuật toán Smart Delay bảo vệ tài khoản an toàn.</p>

<h3>Bước 4: Kiểm Thử Thực Tế, Bàn Giao Trọn Đời &amp; Hướng Dẫn Vận Hành</h3>
<p>Tiến hành chạy thử nghiệm đăng tải thực tế trong 2 - 3 ngày, tinh chỉnh độ ổn định đạt 100%. Bàn giao toàn bộ mã nguồn, tài khoản quản trị, hướng dẫn bằng tài liệu + video quay chi tiết và cam kết bảo hành kỹ thuật lâu dài.</p>',
  'Share2',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1600&auto=format&fit=crop',
  'published',
  'Setup Hệ thống Tự Động Đăng Bài Đa Kênh | Nguyễn Trọng Hữu',
  'Dịch vụ setup hệ thống tự động đăng bài đa nền tảng (Facebook, TikTok, YouTube Shorts, Instagram Reels, Threads, Zalo) kết hợp AI tối ưu nội dung và quản lý từ Google Sheets/Notion.'
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
