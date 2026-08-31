import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { STAGGER, STAGGER_ITEM } from '../data';
import { ArrowLeft, ArrowRight, Share2, Loader2, Code2, Bot, Cpu, LineChart, FileSpreadsheet, Sparkles, MessageSquareText, ChevronDown } from 'lucide-react';
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
  MessageSquareText
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">
            <div className="lg:col-span-8 space-y-10 md:space-y-16">
                <motion.div id="chi-tiet" variants={STAGGER_ITEM} className="prose md:prose-lg prose-zinc max-w-none scroll-mt-32 text-base md:text-lg text-zinc-700 leading-relaxed prose-headings:scroll-mt-32 prose-headings:font-serif prose-headings:font-normal prose-a:text-amber-600">
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: service.content.replace(/\\n/g, '\n').replace(/font-family:[^;"]*;?/gi, '').replace(/line-height:[^;"]*;?/gi, '').replace(/font-size:[^;"]*;?/gi, '').replace(/background-color:[^;"]*;?/gi, '') }} />
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
