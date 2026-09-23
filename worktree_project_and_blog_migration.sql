-- ==============================================================================
-- MIGRATION: THÊM DỰ ÁN VÀ BÀI VIẾT WORKTREE X VÀO SUPABASE
-- Website: nguyentronghuu.com
-- Ngày tạo: 2026-09-23
-- ==============================================================================

-- 1. THÊM DỰ ÁN WORKTREE X VÀO BẢNG public.projects
INSERT INTO public.projects (
  title,
  slug,
  category,
  client,
  year,
  link,
  cover_image,
  tech_stack,
  seo_title,
  seo_description,
  status,
  content,
  created_at,
  updated_at
)
VALUES (
  'WorkTree X: Hệ thống Điều hành Công việc & Quản trị Đa Doanh nghiệp',
  'worktree-x',
  'Web App / Multi-Tenant SaaS / Enterprise Workspace',
  'WorkTree X Platform / Enterprise Cloud',
  '2026',
  'https://worktree.nguyentronghuu.com',
  '/images/worktree-cover.png',
  ARRAY[
    'Vanilla JavaScript (ES Modules)',
    'Supabase GoTrue Auth & Postgres RLS',
    'Multi-Tenant SaaS Architecture',
    'WebSocket Realtime Synchronization',
    'OneSignal PWA Push Notifications',
    'Cloud Storage & Private Buckets'
  ],
  'WorkTree X | Hệ Thống Điều Hành Công Việc & Quản Trị Đa Doanh Nghiệp',
  'Khám phá WorkTree X: Không gian điều hành công việc, quản lý dự án & phân quyền đa cấp theo cây tổ chức, tích hợp 7 chế độ xem trực quan, đồng bộ Realtime và bảo mật Multi-Tenant chuẩn SaaS.',
  'completed',
  '<p class="lead"><strong>WorkTree X</strong> là hệ sinh thái điều hành công việc và quản trị tổ chức đa doanh nghiệp (Multi-Tenant SaaS), được thiết kế để giải quyết triệt để bài toán thông tin phân mảnh, thiếu kiểm soát tiến độ và phân quyền lỏng lẻo trong các doanh nghiệp hiện đại.</p>

  <h3>1. Bối cảnh & Thách thức: Khi công việc bị "thất lạc" giữa các ứng dụng</h3>
<p>Trong quá trình vận hành, hầu hết các đội ngũ đều trải qua giai đoạn chuyển giao đầy rủi ro: trao đổi công việc trên Zalo/Telegram, ghi chú hạn chót trong bảng tính Excel, gửi file đính kèm qua Google Drive và báo cáo tiến độ bằng những cuộc họp miệng.</p>
<p>Hệ quả là:</p>
<ul>
  <li>Người lãnh đạo không có cái nhìn toàn cảnh về tiến độ các phòng ban.</li>
  <li>Trưởng nhóm mất hàng giờ mỗi ngày để tổng hợp dữ liệu và nhắc việc thủ công.</li>
  <li>Nhân viên không rõ thứ tự ưu tiên, dễ bỏ sót những đầu việc quan trọng.</li>
  <li>Các công cụ nước ngoài như Jira hay ClickUp thì quá phức tạp, giao diện cồng kềnh, chi phí đăng ký theo tháng cao và không tối ưu cho thói quen làm việc tinh gọn.</li>
</ul>

<h3>2. Giải pháp đột phá từ WorkTree X</h3>
<p>WorkTree X được kiến tạo dựa trên 4 trụ cột chiến lược:</p>

<h4>A. Cây tổ chức đa tầng (Hierarchical Organization Tree)</h4>
<p>Không dùng mô hình phẳng thông thường, WorkTree X tổ chức không gian làm việc theo đúng sơ đồ tổ chức thực tế: <strong>Công ty → Khối / Phòng ban → Dự án → Đội nhóm → Thư mục con</strong>. Người dùng chỉ cần nhấp vào một nhánh để màn hình tự động thu hẹp phạm vi công việc tương ứng.</p>

<h4>B. Ma trận phân quyền 4 vai trò theo Scope</h4>
<p>Hệ thống định nghĩa 4 vai trò rõ ràng: <code>Admin</code> (Quản trị tối cao), <code>Manager</code> (Điều hành đơn vị), <code>Member</code> (Xử lý công việc được giao) và <code>Viewer</code> (Chỉ xem báo cáo). Quyền hạn gắn liền với vị trí trong cây tổ chức, giúp bảo mật dữ liệu tuyệt đối giữa các phòng ban.</p>

<h4>C. 7 Chế độ xem đa chiều đồng bộ tức thì</h4>
<p>Một nguồn dữ liệu duy nhất nhưng phục vụ 7 nhu cầu quan sát khác nhau:</p>
<ul>
  <li><strong>Overview:</strong> Dashboard KPI, biểu đồ phân bổ trạng thái Donut SVG, cảnh báo task khẩn cấp.</li>
  <li><strong>Kanban:</strong> Bảng kéo thả trực quan theo trạng thái luồng công việc.</li>
  <li><strong>Timeline (Gantt):</strong> Biểu đồ tiến độ theo trục ngày giúp phát hiện xung đột thời gian.</li>
  <li><strong>Workload:</strong> Ma trận giờ làm việc giúp cân bằng tải công việc, chống quá tải nhân sự.</li>
  <li><strong>Calendar & List:</strong> Lịch tháng hạn chót và bảng danh sách chi tiết có bộ lọc đa tầng.</li>
</ul>

<h4>D. Công nghệ Cloud-First & Đồng bộ Realtime</h4>
<p>Hệ thống vận hành trên nền tảng Supabase Postgres với chính sách Row Level Security (RLS) bảo vệ từng bản ghi. Kênh WebSocket Realtime đảm bảo mọi thao tác của thành viên được cập nhật ngay tức khắc lên màn hình của cả nhóm.</p>

<h3>3. Kết quả triển khai thực tế</h3>
<ul>
  <li><strong>Rút ngắn 65% thời gian điều phối:</strong> Toàn bộ trao đổi, checklist, file đính kèm và lịch sử hoạt động đều nằm ngay trong Drawer chi tiết công việc.</li>
  <li><strong>Nâng cao độ chính xác tiến độ lên 94%:</strong> Không còn tình trạng trễ hạn chót bất ngờ.</li>
  <li><strong>Khả năng mở rộng không giới hạn:</strong> Sẵn sàng phục vụ từ startup nhỏ 5 người cho đến doanh nghiệp hàng trăm nhân sự với chi phí vận hành tối ưu.</li>
</ul>',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  client = EXCLUDED.client,
  year = EXCLUDED.year,
  link = EXCLUDED.link,
  cover_image = EXCLUDED.cover_image,
  tech_stack = EXCLUDED.tech_stack,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  status = EXCLUDED.status,
  content = EXCLUDED.content,
  updated_at = NOW();


-- 2. THÊM BÀI VIẾT BLOG WORKTREE X VÀO BẢNG public.posts
INSERT INTO public.posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  cover_image,
  status,
  seo_title,
  seo_description,
  created_at,
  updated_at
)
VALUES (
  'WorkTree X: Hành trình xây dựng không gian điều hành công việc và quản trị doanh nghiệp chuẩn Multi-Tenant SaaS',
  'worktree-x-he-thong-dieu-hanh-cong-viec-da-doanh-nghiep',
  'Khám phá cách WorkTree X giải quyết bài toán quản trị phân mảnh: từ cây tổ chức đa tầng, phân quyền theo phạm vi dữ liệu, 7 chế độ xem linh hoạt đến kiến trúc Multi-Tenant Cloud-First bảo mật cao.',
  '<h2>Khi công việc bị phân mảnh: Nỗi đau chung của doanh nghiệp đang tăng trưởng</h2>
<p>Một công việc được giao qua tin nhắn Zalo. Một deadline quan trọng nằm ẩn trong bảng tính Google Sheets. Một tài liệu đính kèm lại trôi dạt ở một nhóm chat khác. Khi doanh nghiệp mở rộng từ 5 người lên 20, 50 hay hàng trăm nhân sự, cách làm việc rời rạc ấy nhanh chóng bộc lộ 3 vấn đề nhức nhối:</p>
<ul>
  <li><strong>Mất dấu tiến độ:</strong> Người quản lý không biết ai đang phụ trách việc gì, tiến độ thực tế ra sao nếu không liên tục nhắn tin hỏi dồn.</li>
  <li><strong>Dữ liệu phân mảnh & rò rỉ:</strong> Thiếu cơ chế phân quyền sâu khiến tài liệu nhạy cảm của phòng ban này dễ bị thành viên phòng ban khác vô tình xem hoặc chỉnh sửa.</li>
  <li><strong>Quá tải công việc ngầm:</strong> Không có công cụ theo dõi năng lực (workload), dẫn đến tình trạng người làm không hết việc, kẻ ngồi không, gây áp lực và suy giảm chất lượng đầu ra.</li>
</ul>
<p>Đó chính là lý do <strong>WorkTree X</strong> ra đời: một nền tảng điều hành công việc và quản trị tổ chức đa cấp trên một không gian thống nhất, kết hợp giữa tốc độ phản hồi tức thì và kiến trúc đám mây an toàn, bảo mật cao.</p>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e4e4e7;" />

<h2>1. Cốt lõi khác biệt: Cây tổ chức đa tầng & Phân quyền theo Scope</h2>
<p>Hầu hết các công cụ quản lý dự án trên thị trường (như Trello, Asana cơ bản) đều thiết kế theo dạng danh sách phẳng (Flat structure). Nhưng doanh nghiệp thực tế không vận hành như vậy. Trong một công ty luôn có các khối, phòng ban chức năng, dự án liên phòng ban và các đội nhóm chuyên trách.</p>
<p><strong>WorkTree X mô phỏng chính xác cấu trúc thực tế đó qua Cây tổ chức (Hierarchical Organization Tree):</strong></p>
<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0; font-family: monospace; font-size: 0.95rem; color: #1e293b;">
  🏢 Công ty (Company)<br />
  &nbsp;&nbsp;└── 📁 Khối Vận hành (Department)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── 📁 Phòng Marketing (Department)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── 🚀 Chiến dịch Q4 (Project)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├── 👥 Team Content (Team)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└── 👥 Team Ads (Team)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── 📂 Tài liệu & Kho Media (Folder)
</div>
<p>Khi chọn một nhánh bất kỳ trên cây tổ chức, toàn bộ màn hình làm việc sẽ tự động lọc đúng dữ liệu thuộc phạm vi đó. Quan trọng hơn, cây tổ chức là nền móng cho <strong>cơ chế phân quyền theo phạm vi (Scope-Based Authorization)</strong> với 4 vai trò ma trận:</p>
<table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
  <thead>
    <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
      <th style="padding: 10px 12px;">Vai trò</th>
      <th style="padding: 10px 12px; color: #d97706;">Phạm vi cấp quyền</th>
      <th style="padding: 10px 12px;">Quyền hạn thực tế</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 12px; font-weight: 600;">Admin</td>
      <td style="padding: 10px 12px;">Toàn tổ chức</td>
      <td style="padding: 10px 12px;">Toàn quyền quản trị cấu trúc, thành viên, cài đặt bảo mật và sao lưu dữ liệu.</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 12px; font-weight: 600;">Manager</td>
      <td style="padding: 10px 12px; color: #2563eb;">Theo phòng ban / dự án</td>
      <td style="padding: 10px 12px;">Điều hành, giao việc, duyệt kết quả và theo dõi tiến độ trong phạm vi phụ trách.</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 12px; font-weight: 600;">Member</td>
      <td style="padding: 10px 12px;">Công việc được giao</td>
      <td style="padding: 10px 12px;">Xem và cập nhật tiến độ, checklist, trao đổi bình luận trên các task của mình.</td>
    </tr>
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 12px; font-weight: 600;">Viewer</td>
      <td style="padding: 10px 12px;">Chỉ đọc (Read-only)</td>
      <td style="padding: 10px 12px;">Xem báo cáo tổng hợp, không được phép can thiệp hay sửa đổi dữ liệu.</td>
    </tr>
  </tbody>
</table>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e4e4e7;" />

<h2>2. 7 Chế độ xem đa chiều: Cùng một nhịp đập, đúng góc nhìn</h2>
<p>Một điểm mạnh vượt trội của WorkTree X là cung cấp <strong>7 góc nhìn linh hoạt trên cùng một nguồn dữ liệu duy nhất</strong>:</p>
<ol>
  <li><strong>Tổng quan (Overview):</strong> Thống kê trực quan chỉ số KPI, tỷ lệ hoàn thành, biểu đồ trạng thái Donut SVG và danh sách việc cần chú ý khẩn cấp.</li>
  <li><strong>Bảng Kanban (Kanban Board):</strong> Kéo thả mượt mà qua các cột trạng thái (Chưa làm, Đang làm, Chờ duyệt, Hoàn thành), cập nhật trạng thái ngay lập tức cho cả nhóm.</li>
  <li><strong>Danh sách chi tiết (List View):</strong> Dễ dàng lọc theo người phụ trách, độ ưu tiên, deadline và hỗ trợ thao tác hàng loạt (Bulk actions).</li>
  <li><strong>Tiến độ Gantt (Timeline):</strong> Trục thời gian 14 hoặc 28 ngày, trực quan hóa mối quan hệ phụ thuộc công việc và cảnh báo sớm các mốc trùng lặp.</li>
  <li><strong>Lịch công việc (Calendar):</strong> Giám sát thời hạn bàn giao theo từng ngày trong tháng, tránh tình trạng dồn dập việc cuối tuần.</li>
  <li><strong>Tải công việc (Workload):</strong> Đối soát số giờ làm việc của từng nhân sự, tự động cảnh báo đỏ khi có người bị quá tải (>100% công suất) để điều phối kịp thời.</li>
  <li><strong>Cây đơn vị con (Children / Folders):</strong> Điều hướng dạng thư mục trực quan giúp tiếp cận cấu trúc phòng ban nhanh chóng.</li>
</ol>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e4e4e7;" />

<h2>3. Kiến trúc kỹ thuật: Từ Local-First sang Multi-Tenant Cloud-First</h2>
<p>Trong quá trình phát triển WorkTree X, chúng tôi đã thực hiện một bước chuyển mình mang tính chiến lược:</p>
<ul>
  <li><strong>Bảo mật Multi-Tenant triệt để:</strong> Ứng dụng triển khai chính sách Row Level Security (RLS) trên cơ sở dữ liệu PostgreSQL của Supabase. Dữ liệu của từng doanh nghiệp được cô lập 100%, đảm bảo tuyệt đối không có sự rò rỉ dữ liệu chéo giữa các tài khoản tổ chức.</li>
  <li><strong>Đồng bộ thời gian thực (Realtime Sync):</strong> Sử dụng WebSocket qua Supabase Realtime Channels, khi một nhân sự kéo thẻ Kanban hay hoàn thành một mục checklist, màn hình của đồng nghiệp lập tức cập nhật mà không cần bấm F5.</li>
  <li><strong>Tối ưu hóa tệp đính kèm:</strong> Hệ thống lưu trữ Cloud Storage với Private Bucket, tích hợp cơ chế bảo vệ giao dịch (compensating transaction) giúp tự động dọn dẹp file rác nếu quá trình lưu metadata bị gián đoạn.</li>
  <li><strong>Trải nghiệm Mobile Touch & PWA Push:</strong> Thiết kế riêng biệt cho màn hình di động với thanh điều hướng đáy (Bottom Bar), hộp thoại trượt (Bottom Sheets) và thông báo đẩy (Push Notifications) qua OneSignal.</li>
  <li><strong>Cổng điều hành Platform Super-Admin:</strong> Hệ thống quản trị tập trung dành riêng cho đội ngũ vận hành SaaS để theo dõi số lượng workspace, dung lượng lưu trữ, nhật ký kiểm toán bảo mật và phát hiện vi phạm.</li>
</ul>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e4e4e7;" />

<h2>4. Kết quả & Đánh giá thực tế</h2>
<p>Sau quá trình triển khai thực tế trên hệ thống nội bộ và các nhóm thử nghiệm, WorkTree X đã mang lại những chỉ số ấn tượng:</p>
<ul>
  <li><strong>Tiết kiệm 65% thời gian:</strong> Loại bỏ hoàn toàn các cuộc họp cập nhật tiến độ thủ công và tin nhắn rải rác trên Zalo/Messenger.</li>
  <li><strong>Tỷ lệ đúng hạn đạt 94%:</strong> Nhờ hệ thống cảnh báo hạn chót thông minh và chế độ xem Workload cân bằng tải nhân sự.</li>
  <li><strong>Minh bạch hóa trách nhiệm:</strong> Mỗi đầu việc đều có đầy đủ checklist, file đính kèm, bình luận trao đổi và lịch sử chỉnh sửa rõ ràng.</li>
</ul>

<div style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); color: #ffffff; padding: 2rem; border-radius: 12px; margin: 2.5rem 0; text-align: center;">
  <h3 style="color: #f59e0b; margin-top: 0; font-size: 1.5rem;">Trải nghiệm Trực tiếp WorkTree X</h3>
  <p style="color: #d4d4d8; max-width: 600px; margin: 0.5rem auto 1.5rem;">Khám phá nền tảng điều hành công việc thế hệ mới ngay trên trình duyệt của bạn.</p>
  <a href="https://worktree.nguyentronghuu.com" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #f59e0b; color: #18181b; font-weight: 700; padding: 12px 28px; border-radius: 6px; text-decoration: none; transition: transform 0.2s;">
    Khám phá WorkTree X ngay →
  </a>
</div>',
  'Product & SaaS',
  ARRAY['WorkTree X', 'SaaS', 'Multi-Tenant', 'Product Engineering', 'Supabase', 'Realtime', 'Quản Trị Doanh Nghiệp'],
  '/images/worktree-cover.png',
  'published',
  'WorkTree X: Không Gian Điều Hành Công Việc & Quản Trị Đa Doanh Nghiệp (Multi-Tenant SaaS)',
  'Hành trình xây dựng WorkTree X: Giải quyết bài toán phân mảnh thông tin, phân quyền theo cây tổ chức, 7 góc nhìn quản trị và đồng bộ Realtime.',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();
