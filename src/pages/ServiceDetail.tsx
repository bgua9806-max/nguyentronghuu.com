import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft, ArrowRight, Share2, Loader2, Code2, Bot, Cpu, LineChart, FileSpreadsheet, Sparkles, MessageSquareText, ChevronDown, Zap } from 'lucide-react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, any> = {
  Code2,
  Bot,
  Cpu,
  LineChart,
  FileSpreadsheet,
  Sparkles,
  MessageSquareText,
  Share2,
  Zap
};

const cleanServiceHtml = (value = '') => {
  if (!value) return '';
  let html = value
    .replace(/\\n/g, '\n')
    .replace(/font-family:[^;"]*;?/gi, '')
    .replace(/line-height:[^;"]*;?/gi, '')
    .replace(/font-size:[^;"]*;?/gi, '');
    
  html = html.replace(/<table([\s\S]*?)<\/table>/gi, (_match) => {
    return `<div class="table-responsive-container">${_match}</div>`;
  });

  return html;
};

const SERVICE_FAQS = [
  {
    question: 'Chi phí triển khai được xác định như thế nào?',
    answer: 'Chi phí phụ thuộc vào phạm vi tính năng, mức độ tích hợp và hiện trạng hệ thống. Sau buổi trao đổi yêu cầu, bạn sẽ nhận được đề xuất phạm vi và chi phí tương ứng trước khi quyết định.'
  },
  {
    question: 'Thời gian thực hiện dự án khoảng bao lâu?',
    answer: 'Thời gian được xác định sau khi làm rõ mục tiêu, dữ liệu đầu vào và các bên liên quan. Lộ trình thực hiện cùng các mốc bàn giao sẽ được thống nhất trong đề xuất dự án.'
  },
  {
    question: 'Doanh nghiệp cần chuẩn bị gì trước buổi tư vấn?',
    answer: 'Bạn nên chuẩn bị bài toán đang gặp phải, quy trình hiện tại, công cụ hoặc nguồn dữ liệu đang sử dụng và kết quả mong muốn. Những thông tin này giúp buổi trao đổi đi thẳng vào giải pháp.'
  },
  {
    question: 'Sau khi bàn giao có hỗ trợ vận hành không?',
    answer: 'Phạm vi hướng dẫn, bảo hành và hỗ trợ sau bàn giao sẽ được ghi rõ trong đề xuất hoặc thỏa thuận triển khai để phù hợp với nhu cầu vận hành thực tế.'
  }
];

const FALLBACK_SERVICES: Record<string, any> = {
  "chatgpt-ads-agent-automation": {
    title: "Tự Động Hóa Vận Hành Ads với AI Agent Trong ChatGPT",
    slug: "chatgpt-ads-agent-automation",
    icon_name: "Zap",
    description: "Xây dựng hệ thống AI Agent kết nối trực tiếp tài khoản Ads với ChatGPT. Tự động đọc bài đăng mới trên Fanpage, nhận diện từ khóa đưa vào Campaign theo rule, kéo chỉ số realtime (CTR, CPM, CPC, CPA, ROAS) và hỏi đáp điều khiển chiến dịch 100% bằng ngôn ngữ tự nhiên.",
    seo_title: "Tự Động Hóa Vận Hành Ads với AI Agent Trong ChatGPT | Nguyễn Trọng Hữu",
    seo_description: "Dịch vụ setup hệ thống AI Agent kết nối Ads Manager với ChatGPT: tự động đưa bài mới vào ads theo rule, giám sát chỉ số realtime và hỏi đáp điều khiển ads bằng ngôn ngữ tự nhiên.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    content: `<h2>Cuộc Cách Mạng Vận Hành Ads: Từ F5 Trình Quản Lý Sang Giao Tiếp Tự Nhiên Với AI Agent Trong ChatGPT</h2>
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
<p>Chạy thử nghiệm hệ thống trong 2-3 ngày với ngân sách thực tế, tinh chỉnh độ chính xác đạt 100%. Bàn giao toàn bộ quyền quản trị, mã nguồn và tài liệu video hướng dẫn chi tiết.</p>`
  },
  "multi-channel-auto-posting": {
    title: "Setup Hệ thống Tự Động Đăng Bài Đa Kênh (Omnichannel Auto-Posting)",
    slug: "multi-channel-auto-posting",
    icon_name: "Share2",
    description: "Xây dựng hệ thống tự động hóa phân phối nội dung đa nền tảng (Facebook Fanpage/Group/Reels, TikTok, YouTube Shorts, Instagram Reels, Threads, Zalo, LinkedIn). Quản lý tập trung từ Sheets/Notion, AI tự động tối ưu định dạng và hẹn giờ đăng tải 24/7.",
    seo_title: "Setup Hệ thống Tự Động Đăng Bài Đa Kênh | Nguyễn Trọng Hữu",
    seo_description: "Dịch vụ setup hệ thống tự động đăng bài đa nền tảng (Facebook, TikTok, YouTube Shorts, Instagram Reels, Threads, Zalo) kết hợp AI tối ưu nội dung và quản lý từ Google Sheets/Notion.",
    cover_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1600&auto=format&fit=crop",
    content: `<h2>Cuộc Cách Mạng Phân Phối Nội Dung Đa Kênh: Từ Đăng Thủ Công Sang Tự Động Hóa Toàn Diện</h2>
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
<p>Tiến hành chạy thử nghiệm đăng tải thực tế trong 2 - 3 ngày, tinh chỉnh độ ổn định đạt 100%. Bàn giao toàn bộ mã nguồn, tài khoản quản trị, hướng dẫn bằng tài liệu + video quay chi tiết và cam kết bảo hành kỹ thuật lâu dài.</p>`
  },
  "zalo-ai-data-sync": {
    title: "Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App",
    slug: "zalo-ai-data-sync",
    icon_name: "MessageSquareText",
    description: "Tự động lắng nghe đa nhóm Zalo cá nhân, dùng AI phân tích bóc tách các trường dữ liệu (SĐT, giá, vị trí, nhu cầu) điền thẳng vào Google Sheets và phát triển Web App tra cứu nhanh trong 1 giây.",
    seo_title: "Đồng bộ Zalo & AI Bóc tách Dữ liệu sang Sheets / Web App | Nguyễn Trọng Hữu",
    seo_description: "Dịch vụ xây dựng hệ thống tự động quét tin nhắn đa nhóm Zalo cá nhân, AI phân tích bóc tách trường thông tin vào Google Sheets và Web App tra cứu nhanh.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    content: `<h2>Giải Pháp Đột Phá: Biến Hàng Nghìn Tin Nhắn Nhóm Zalo Rời Rạc Thành Cơ Sở Dữ Liệu Tra Cứu Tập Trung</h2>
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
<p>Chạy thử nghiệm hệ thống với dữ liệu thực tế trong 2-3 ngày, tinh chỉnh độ chính xác bóc tách của AI đạt trên 98%, bàn giao toàn bộ mã nguồn, tài khoản quản trị và video hướng dẫn chi tiết.</p>`,
  },
  "ai-ads-automation": {
    title: "Chạy Ads với AI & Tự động hóa Chiến dịch Quảng cáo Đa Kênh",
    slug: "ai-ads-automation",
    icon_name: "Sparkles",
    description: "Lên chiến dịch Ads bằng câu lệnh kết hợp bộ AI Skill chuyên sâu, tối ưu tệp Dataset & Lookalike AI, tự động giám sát sức khỏe chiến dịch và báo cáo định kỳ qua ChatGPT/Telegram.",
    seo_title: "Chạy Ads với AI & Tự động hóa Quảng cáo | Nguyễn Trọng Hữu",
    seo_description: "Dịch vụ thiết lập hệ thống chạy quảng cáo AI toàn diện: Prompt-to-Campaign, Dataset & Lookalike AI, Giám sát sức khỏe chiến dịch 24/7 và báo cáo định kỳ qua ChatGPT API.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    content: `<h2>Cuộc Cách Mạng Chạy Ads với AI: Từ Chạy Thủ Công Sang Tự Động Hóa Toàn Diện</h2>
<p>Trong kỷ nguyên thuật toán quảng cáo liên tục biến động và chi phí CPM ngày càng đắt đỏ, cách chạy ads truyền thống (lên camp thủ công, viết content mò mẫm, ngồi canh số liệu F5 từng giờ) đã trở nên chậm chạp và tốn kém. Doanh nghiệp cần một giải pháp vượt trội hơn: <strong>Hệ thống Chạy Ads tích hợp Trí tuệ Nhân tạo (AI Performance Ads & Automation)</strong>.</p>
<p>Chúng tôi cung cấp dịch vụ thiết lập và vận hành hệ thống chạy quảng cáo ứng dụng AI từ A-Z, giúp doanh nghiệp lên chiến dịch chỉ bằng câu lệnh (Prompt-to-Campaign), tận dụng tối đa sức mạnh của First-Party Dataset & Lookalike AI, đồng thời tự động hóa hoàn toàn khâu giám sát và báo cáo định kỳ qua <strong>ChatGPT API / Telegram / Zalo</strong>.</p>

<hr>

<h2>Các Trụ Cột Năng Lực Cốt Lõi Trong Dịch Vụ Chạy Ads với AI</h2>

<h3>1. Lên Chiến Dịch Quảng Cáo Tự Động Bằng Câu Lệnh (Prompt-to-Campaign)</h3>
<p>Ứng dụng bộ Skill chuyên sâu và Framework AI độc quyền để tự động hóa khâu lập kế hoạch và set camp:</p>
<ul>
  <li><strong>AI Copywriting Đa Biến Thể:</strong> Tự động sinh hàng chục mẫu tiêu đề, hook, nội dung quảng cáo (theo công thức PAS, AIDA, Storytelling, Pain-Point) phù hợp từng nhóm tệp đối tượng và từng giai đoạn phễu nhận thức.</li>
  <li><strong>AI Creative Concept & Visual Prompts:</strong> Phân tích góc nhìn khách hàng để gợi ý kịch bản video ngắn (Reels, TikTok), góc chụp ảnh sản phẩm có tỷ lệ CTR cao nhất và thiết kế hình ảnh bằng AI (Midjourney / FLUX).</li>
  <li><strong>Lên cấu trúc Campaign tự động:</strong> Sử dụng API (Meta Marketing API, Google Ads API, TikTok API) để tự động tạo chiến dịch, nhóm quảng cáo, gắn pixel tracking, UTM parameters chuẩn xác 100% chỉ qua một prompt chỉ thị.</li>
</ul>

<hr>

<h3>2. Xây Dựng Tệp Khách Hàng Chuẩn Xác (Dataset & Lookalike AI)</h3>
<p>Quảng cáo không thể hiệu quả nếu tệp khách hàng nhắm mục tiêu không chuẩn. Chúng tôi khai thác dữ liệu nội bộ (First-Party Data) để huấn luyện máy học:</p>
<ul>
  <li><strong>Làm sạch và Chuẩn hóa Dataset Khách hàng:</strong> Thu thập dữ liệu khách hàng từ CRM, Google Sheets, đơn hàng thành công, làm sạch số điện thoại và email chuẩn định dạng SHA256.</li>
  <li><strong>Tạo tệp Custom Audience chất lượng cao:</strong> Tệp khách hàng đã mua hàng giá trị cao (High LTV), khách tương tác tích cực trên fanpage/website, khách xem video trên 75%.</li>
  <li><strong>Nhân bản Lookalike Audience (LAL 1%, 2%, 5%) thông minh:</strong> Dùng thuật toán AI của Meta/TikTok để tìm kiếm hàng triệu người có hành vi, thói quen và khả năng chi trả giống hệt khách hàng trung thành nhất của bạn.</li>
  <li><strong>Nuôi Pixel & Conversions API (CAPI):</strong> Cài đặt Server-Side Tracking vượt qua rào cản iOS 14+ và chặn cookie, đảm bảo AI của nền tảng quảng cáo học đúng tệp khách hàng sinh ra lợi nhuận.</li>
</ul>

<hr>

<h3>3. AI Agent Giám Sát Sức Khỏe Chiến Dịch 24/7 (Campaign Health Check)</h3>
<p>Không còn cảnh "cháy ngân sách" vì ads lỗi hoặc CPM tăng vọt mà không ai hay biết:</p>
<ul>
  <li><strong>Theo dõi chỉ số Realtime:</strong> AI liên tục quét các chỉ số sống còn: CPA (Chi phí/chuyển đổi), CPR, CPM, CTR, Tần suất hiển thị (Frequency) và ROAS.</li>
  <li><strong>Cảnh báo bão hòa nội dung (Ad Fatigue):</strong> Tự động phát hiện khi nào mẫu quảng cáo bắt đầu bị lặp lại quá nhiều khiến chi phí tăng, gửi cảnh báo cần thay creative mới.</li>
  <li><strong>Quy tắc Tự động (Auto Rules Engine):</strong> Tự động tắt các nhóm quảng cáo kém hiệu quả khi vượt ngưỡng chi phí cho phép, tự động tăng ngân sách (Scale-up) cho các nhóm ads "ngon" có ROAS cao.</li>
</ul>

<hr>

<h3>4. Tự Động Báo Cáo Định Kỳ & Đề Xuất Tối Ưu Qua ChatGPT API / Zalo / Telegram</h3>
<p>Biến các bảng số liệu phức tạp thành những bản tin phân tích tài chính rõ ràng, dễ hiểu:</p>
<ul>
  <li><strong>Báo cáo tóm tắt hàng ngày lúc 22h00:</strong> Bot AI kết nối API trực tiếp từ Facebook Ads Manager, tổng hợp số tiền chi tiêu, số lead/đơn hàng, chi phí trung bình và doanh thu ước tính gửi thẳng vào nhóm chat Telegram hoặc Zalo của bạn.</li>
  <li><strong>Phân tích Insight qua ChatGPT API:</strong> AI không chỉ đưa số liệu thô mà đóng vai trò như một chuyên gia Media Buyer cao cấp: giải thích vì sao hôm nay chi phí tăng/giảm, tệp đối tượng nào đang hoạt động tốt nhất và cần điều chỉnh gì cho ngày mai.</li>
  <li><strong>Báo cáo Dashboard Trực quan:</strong> Tự động đồng bộ vào Google Sheets và Looker Studio biểu đồ xu hướng theo tuần, tháng để ban lãnh đạo theo dõi bức tranh dài hạn.</li>
</ul>

<hr>

<h2>Lợi Ích Đột Phá Khi Chạy Ads Ứng Dụng AI</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
  <thead>
    <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
      <th style="padding: 12px 16px;">Tiêu chí</th>
      <th style="padding: 12px 16px; color: #d97706;">Chạy Ads Tích Hợp AI & Automation</th>
      <th style="padding: 12px 16px; color: #71717a;">Chạy Ads Thủ Công Truyền Thống</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Tốc độ lên chiến dịch & test content</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Chỉ mất vài phút để sinh hàng chục góc tiếp cận & set camp</td>
      <td style="padding: 12px 16px; color: #dc2626;">Mất cả ngày để viết vài bài content và lên từng nhóm ads</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Độ chính xác tệp đối tượng</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Dựa trên First-Party Data & Lookalike AI học từ khách thật</td>
      <td style="padding: 12px 16px; color: #dc2626;">Nhắm mục tiêu theo sở thích chung chung, dễ dính tệp ảo</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Thời gian phản ứng khi ads bị lỗi</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tức thì 24/7 (AI Agent tự động ngắt ads lỗi trong vài giây)</td>
      <td style="padding: 12px 16px; color: #dc2626;">Phụ thuộc nhân sự canh trực, dễ bị đốt tiền oan khi cắn tiền ảo</td>
    </tr>
    <tr style="border-bottom: 1px solid #f4f4f5;">
      <td style="padding: 12px 16px; font-weight: bold;">Báo cáo & Phân tích</td>
      <td style="padding: 12px 16px; color: #16a34a; font-weight: 500;">Tự động gửi qua Telegram/Zalo kèm insight phân tích từ ChatGPT</td>
      <td style="padding: 12px 16px; color: #dc2626;">Nhân sự làm báo cáo Excel thủ công, chậm trễ và khô khan</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Quy Trình Triển Khai Dịch Vụ</h2>

<h3>Bước 1: Audit Tài Khoản & Chuẩn Hóa Dữ Liệu Nền Tảng (Dataset & Pixel)</h3>
<p>Kiểm tra toàn diện tài khoản quảng cáo, cài đặt Conversions API (CAPI), tích hợp Google Analytics 4, chuẩn hóa tệp khách hàng cũ (Custom Audience) để huấn luyện máy học.</p>

<h3>Bước 2: Xây Dựng Bộ AI Prompt & Kịch Bản Chiến Dịch Riêng Biệt</h3>
<p>Thiết kế hệ thống Prompt chuyên sâu cho ngành hàng của bạn: tone of voice, nỗi đau khách hàng, USP sản phẩm. Sản xuất kho Creative (hình ảnh, video, copy) ứng dụng công nghệ AI.</p>

<h3>Bước 3: Cài Đặt Hệ Thống Tự Động Hóa Giám Sát & Bot Báo Cáo</h3>
<p>Thiết lập webhook và bot AI kết nối với Meta Marketing API. Cấu hình kịch bản báo cáo tự động về nhóm Telegram / Zalo nội bộ của doanh nghiệp.</p>

<h3>Bước 4: Vận Hành, A/B Testing & Scale Ngân Sách Theo Dữ Liệu</h3>
<p>Thực hiện A/B testing liên tục với chi phí nhỏ để tìm ra các nhóm quảng cáo "thắng cuộc", sau đó mở rộng quy mô ngân sách (Scaling) an toàn và bền vững.</p>

<hr>

<h2>Dịch Vụ Này Phù Hợp Với Ai?</h2>
<ul>
  <li><strong>Chủ doanh nghiệp & Nhà bán hàng E-commerce:</strong> Muốn cắt giảm chi phí nhân sự Media Buyer nhưng vẫn có hệ thống quảng cáo chạy liên tục, tối ưu từng đồng ngân sách.</li>
  <li><strong>Đội ngũ Marketing & Agency:</strong> Cần chuẩn hóa quy trình set ads hàng loạt, nâng cao hiệu suất làm việc gấp 5 lần nhờ bộ công cụ AI Skills.</li>
  <li><strong>Các doanh nghiệp ngành BĐS, Thẩm mỹ/Spa, Giáo dục, Dịch vụ cao cấp:</strong> Cần tệp khách hàng Lookalike siêu chuẩn xác để thu hút lead chất lượng cao, hạn chế tối đa lead rác.</li>
</ul>`,
  },
  "google-sheets-automation": {
    title: "Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp",
    slug: "google-sheets-automation",
    icon_name: "FileSpreadsheet",
    description: "Xây dựng hệ thống tự động hóa quản lý, Mini CRM, đồng bộ Lead Marketing đa kênh và báo cáo tự động trên Google Sheets. Tiết kiệm 90% thời gian nhập liệu thủ công với chi phí tối ưu nhất cho SMEs.",
    seo_title: "Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp | Nguyễn Trọng Hữu",
    seo_description: "Dịch vụ xây dựng hệ thống tự động hóa vận hành, quản lý đơn hàng/lead và tối ưu Marketing bằng Google Apps Script & Google Sheets cho doanh nghiệp vừa và nhỏ.",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    content: `<h2>Tại sao Doanh nghiệp Vừa &amp; Nhỏ (SMEs) cần Tự động hóa bằng Google Sheets &amp; Apps Script?</h2>
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
</ul>`
  }
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareText, setShareText] = useState("Chia sẻ dịch vụ");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
          
        if (data) {
          setService(data);
        } else if (slug && FALLBACK_SERVICES[slug]) {
          setService(FALLBACK_SERVICES[slug]);
        } else {
          navigate('/services');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        if (slug && FALLBACK_SERVICES[slug]) {
          setService(FALLBACK_SERVICES[slug]);
        } else {
          navigate('/services');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchService();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText("Đã chép link!");
    setTimeout(() => setShareText("Chia sẻ dịch vụ"), 2000);
  };

  const IconComponent = iconMap[service.icon_name] || Cpu;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-28 pb-20 md:pt-40 md:pb-32 px-5 md:px-12 lg:px-8 max-w-5xl mx-auto min-h-screen"
    >
      <SEO 
        title={service.seo_title || service.title} 
        description={service.seo_description || `Chi tiết dịch vụ: ${service.title}`}
        type="service"
        image={service.cover_image}
        url={`https://nguyentronghuu.com/services/${service.slug}`}
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: 'Dịch vụ', url: 'https://nguyentronghuu.com/services' },
          { name: service.title, url: `https://nguyentronghuu.com/services/${service.slug}` },
        ]}
      />

      <header className="mb-8 md:mb-12 flex items-center">
        <Link 
          to="/services"
          className="group inline-flex items-center space-x-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all"
        >
          <span className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 group-hover:bg-zinc-100 group-hover:border-zinc-300 transition-all shrink-0">
            <ArrowLeft size={16} />
          </span>
          <span>Trở lại Dịch vụ</span>
        </Link>
      </header>

      <motion.div
        variants={STAGGER}
        initial="initial"
        animate="whileInView"
      >
        <motion.div variants={STAGGER_ITEM} className="mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-4 md:mb-6 leading-tight">
            {service.title}
          </h1>
          {service.description && (
             <p className="text-base md:text-xl text-zinc-600 leading-relaxed max-w-3xl">
               {service.description}
             </p>
          )}
        </motion.div>

        <motion.section
          id="tong-quan"
          variants={STAGGER_ITEM}
          className="mb-10 scroll-mt-32 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-7 md:mb-12"
          aria-labelledby="service-summary-title"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 ring-1 ring-zinc-200">
              <IconComponent className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p id="service-summary-title" className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Tóm tắt dịch vụ</p>
              <dl className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-zinc-200">
                <div className="sm:pr-4">
                  <dt className="text-xs text-zinc-500">Phạm vi</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900">Giải pháp theo nhu cầu</dd>
                </div>
                <div className="sm:px-4">
                  <dt className="text-xs text-zinc-500">Hình thức</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900">Tư vấn & triển khai</dd>
                </div>
                <div className="sm:pl-4">
                  <dt className="text-xs text-zinc-500">Bước đầu tiên</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900">Trao đổi bài toán</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.section>

        {service.cover_image && (
          <motion.div variants={STAGGER_ITEM} className="w-full mb-12 md:mb-24 rounded-sm overflow-hidden bg-zinc-50">
              <img src={service.cover_image} alt={service.title} width="1200" height="675" className="w-full h-auto max-h-[60vh] object-cover" />
          </motion.div>
        )}

        <nav className="mb-10 rounded-xl border border-zinc-200 bg-white p-5 lg:hidden" aria-label="Mục lục trang dịch vụ">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Trong trang này</p>
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-zinc-700">
            <a href="#tong-quan" className="rounded-lg bg-zinc-50 px-3 py-2.5 hover:text-amber-700">Tổng quan</a>
            <a href="#chi-tiet" className="rounded-lg bg-zinc-50 px-3 py-2.5 hover:text-amber-700">Chi tiết</a>
            <a href="#cau-hoi" className="rounded-lg bg-zinc-50 px-3 py-2.5 hover:text-amber-700">Câu hỏi</a>
            <a href="#nhan-tu-van" className="rounded-lg bg-zinc-50 px-3 py-2.5 hover:text-amber-700">Nhận tư vấn</a>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 w-full min-w-0 max-w-full">
            <div className="min-w-0 max-w-full lg:col-span-8 space-y-10 md:space-y-16">
                <motion.div id="chi-tiet" variants={STAGGER_ITEM} className="w-full min-w-0 max-w-full overflow-hidden prose md:prose-lg prose-zinc max-w-none scroll-mt-32 text-base md:text-lg text-zinc-700 leading-relaxed prose-headings:scroll-mt-32 prose-headings:font-serif prose-headings:font-normal prose-a:text-amber-600">
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: cleanServiceHtml(service.content) }} />
                  ) : (
                    <p className="italic text-zinc-500">Đang cập nhật chi tiết dịch vụ...</p>
                  )}
                </motion.div>
            </div>
            
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
                <nav className="hidden rounded-xl border border-zinc-200 bg-white p-6 lg:block" aria-label="Mục lục trang dịch vụ">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Trong trang này</p>
                  <div className="space-y-1 text-sm font-medium text-zinc-700">
                    <a href="#tong-quan" className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50 hover:text-amber-700">01 · Tổng quan</a>
                    <a href="#chi-tiet" className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50 hover:text-amber-700">02 · Chi tiết giải pháp</a>
                    <a href="#cau-hoi" className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50 hover:text-amber-700">03 · Câu hỏi thường gặp</a>
                    <a href="#nhan-tu-van" className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50 hover:text-amber-700">04 · Nhận tư vấn</a>
                  </div>
                </nav>
                <div className="bg-zinc-50 p-8 md:p-10 border border-zinc-200">
                  <h4 className="font-serif text-2xl md:text-3xl text-zinc-900 mb-4 leading-tight">
                    Bạn cần triển khai <br/><span className="italic text-zinc-500 font-light">giải pháp này?</span>
                  </h4>
                  <p className="text-zinc-600 mb-8 leading-relaxed text-sm md:text-base">
                    Để lại yêu cầu, mình sẽ phân tích và đề xuất lộ trình thực hiện cụ thể cho doanh nghiệp của bạn.
                  </p>
                  
                  <Link to="/contact" className="group flex items-center justify-center w-full py-4 bg-zinc-900 text-white text-sm uppercase tracking-widest font-bold transition-all hover:bg-amber-600 active:scale-95">
                    <span>Liên hệ tư vấn</span>
                    <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
            </div>
        </div>

        <motion.section id="cau-hoi" variants={STAGGER_ITEM} className="mt-16 scroll-mt-32 border-t border-zinc-200 pt-12 md:mt-24 md:pt-16" aria-labelledby="faq-title">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Thông tin cần biết</p>
          <h2 id="faq-title" className="mb-8 max-w-2xl font-serif text-3xl leading-tight text-zinc-900 md:text-5xl">Câu hỏi thường gặp</h2>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {SERVICE_FAQS.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-zinc-900 marker:content-none md:py-6">
                  <span>{item.question}</span>
                  <ChevronDown size={18} className="shrink-0 text-zinc-500 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="max-w-3xl pb-6 pr-10 text-sm leading-relaxed text-zinc-600 md:text-base">{item.answer}</p>
              </details>
            ))}
          </div>
        </motion.section>

        <motion.section id="nhan-tu-van" variants={STAGGER_ITEM} className="mt-16 scroll-mt-32 overflow-hidden rounded-2xl bg-zinc-950 px-6 py-10 text-white md:mt-24 md:px-10 md:py-12" aria-labelledby="consultation-title">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400">Bước tiếp theo</p>
              <h2 id="consultation-title" className="font-serif text-3xl leading-tight md:text-4xl">Trao đổi trực tiếp về bài toán của bạn</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">Chia sẻ mục tiêu và quy trình hiện tại để cùng xác định phạm vi giải pháp phù hợp.</p>
            </div>
            <Link to="/contact" className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
              <span>Nhận tư vấn</span>
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>

        <motion.div variants={STAGGER_ITEM} className="mt-12 md:mt-16 pt-8 border-t border-zinc-200">
           <button 
             onClick={handleShare}
             className="flex items-center space-x-2 px-5 py-3 md:px-4 md:py-2 rounded-sm md:rounded-full border border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 transition-all w-full md:w-auto justify-center"
           >
             <Share2 size={18} />
             <span className="font-bold">{shareText}</span>
           </button>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
