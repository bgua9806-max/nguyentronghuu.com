import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const projectData = {
  title: 'FourLand CRM 3D: Hệ thống Quản trị Bất động sản Trực quan & Tự Động Khớp Nhu Cầu',
  slug: 'fourland-crm-3d',
  client: 'FourLand PropTech / Innovation',
  year: '2026',
  link: 'https://youtu.be/D4aL51eg7k0',
  category: 'Web App / PropTech / 3D CRM',
  cover_image: 'https://img.youtube.com/vi/D4aL51eg7k0/maxresdefault.jpg',
  tech_stack: ['React', 'TypeScript', 'Three.js / 3D Space', 'Tailwind CSS', 'AI Vibe Coding', 'RBAC & Auth'],
  seo_title: 'FourLand CRM 3D | Web App Quản Trị Bất Động Sản Trực Quan & Khớp Nhu Cầu Tự Động',
  seo_description: 'Khám phá FourLand CRM 3D: Web App quản trị BĐS định hướng hành động cho sale, không gian 3D trực quan, tự động ghép khách với căn phù hợp và phân quyền đa cấp.',
  status: 'completed',
  content: `<p class="lead"><strong>FourLand CRM 3D</strong> là hệ thống quản trị khách hàng và giỏ hàng bất động sản trực quan thế hệ mới, được thiết kế theo tư duy <em>"Action-Driven CRM"</em> (CRM định hướng hành động) thay vì chỉ dừng lại ở vai trò một kho lưu trữ dữ liệu tĩnh.</p>

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
  <iframe 
    src="https://www.youtube-nocookie.com/embed/D4aL51eg7k0?rel=0" 
    title="FourLand CRM 3D Demo Walkthrough" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px;"
  ></iframe>
</div>

<h3>1. Bối cảnh & Bài toán: Tại sao CRM BĐS truyền thống khiến Sale mệt mỏi?</h3>
<p>Trong ngành bất động sản, tốc độ và độ chính xác của thông tin là yếu tố quyết định giao dịch thành công. Tuy nhiên, hơn 85% đội ngũ môi giới hiện nay vẫn gặp phải những rào cản lớn khi sử dụng CRM truyền thống hoặc quản lý thủ công qua Excel/Zalo:</p>
<ul>
  <li><strong>Dữ liệu thụ động:</strong> CRM chỉ là nơi "lưu lại số điện thoại và ghi chú", không chủ động nhắc nhở hay chỉ điểm cho nhân viên sale biết chính xác bước tiếp theo cần làm là gì.</li>
  <li><strong>Lệch pha giữa Khách & Kho nhà:</strong> Sale có khách muốn mua căn hộ 2PN hướng Đông Nam dưới 4 tỷ nhưng phải lục tung hàng chục file Excel kho hàng, dễ bỏ lỡ căn phù hợp hoặc căn đã bán từ lâu.</li>
  <li><strong>Thiếu tính trực quan:</strong> Danh sách căn hộ dạng bảng text khô khan, khó hình dung vị trí căn trong dự án, tầng cao hay tầm nhìn thực tế.</li>
  <li><strong>Thất thoát phí môi giới & theo dõi công nợ lỏng lẻo:</strong> Các khoản phí hoa hồng, tiến độ thu tiền từ chủ đầu tư/khách hàng thường bị phân tán, dễ quên hoặc khó đối soát.</li>
</ul>

<h3>2. Triết lý Thiết kế: CRM định hướng hành động cho Sale</h3>
<p>Khác biệt cốt lõi của FourLand CRM 3D là hệ thống được xây dựng để trả lời <strong>4 câu hỏi vàng</strong> của chuyên viên tư vấn ngay khi mở ứng dụng mỗi buổi sáng:</p>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 1.5rem 0;">
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
    <h4 style="margin: 0 0 8px 0; color: #d97706; font-size: 1rem;">📞 Hôm nay cần gọi ai?</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #475569;">Hệ thống lọc ra danh sách khách đến hạn chăm sóc, khách vừa tương tác hoặc khách có biến động nhu cầu cần follow-up ngay.</p>
  </div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
    <h4 style="margin: 0 0 8px 0; color: #d97706; font-size: 1rem;">🎯 Khách này nên giới thiệu căn nào?</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #475569;">Thuật toán tự động quét kho bđs và ghép ngay các căn phù hợp về tài chính, khu vực, pháp lý và hướng nhà chỉ trong 1 click.</p>
  </div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
    <h4 style="margin: 0 0 8px 0; color: #d97706; font-size: 1rem;">⏳ Giao dịch nào đang đứng?</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #475569;">Pipeline trực quan cảnh báo các deal bị nghẽn quá lâu ở khâu đặt cọc, ký hợp đồng hay thẩm định hồ sơ vay ngân hàng.</p>
  </div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
    <h4 style="margin: 0 0 8px 0; color: #d97706; font-size: 1rem;">💰 Khoản phí nào chưa thu?</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #475569;">Theo dõi minh bạch tiến độ thanh toán phí môi giới theo từng đợt giải ngân, không để sót hoa hồng của đội ngũ.</p>
  </div>
</div>

<h3>3. Các Phân Hệ & Tính Năng Nổi Bật</h3>
<ul>
  <li><strong>Quản lý khách hàng 360°:</strong> Lưu trữ chi tiết thông tin, mức tài chính dự kiến, tiêu chí tìm nhà, nguồn lead (Meta Ads, giới thiệu, v.v.) và lịch sử toàn bộ các cuộc gọi, tin nhắn chăm sóc.</li>
  <li><strong>Quản lý kho bất động sản thông minh:</strong> Phân loại kho nhà phố, chung cư, đất nền; cập nhật trạng thái realtime (Còn trống, Giữ chỗ, Đã cọc, Đã bán); quản lý hình ảnh và hồ sơ pháp lý.</li>
  <li><strong>Pipeline giao dịch trực quan dạng Kanban:</strong> Dễ dàng kéo thả khách hàng qua từng giai đoạn phễu: Mới tiếp cận → Tư vấn → Dẫn xem nhà → Đàm phán → Đặt cọc → Ký hợp đồng thành công.</li>
  <li><strong>Smart Matching Engine (Tự ghép khách với căn):</strong> Khớp tự động nhu cầu của khách với nguồn hàng đang sẵn trong kho, giúp sale chốt deal nhanh gấp 3 lần.</li>
  <li><strong>Không gian CRM 3D trực quan:</strong> Ứng dụng công nghệ đồ họa 3D hiển thị mặt bằng dự án, sa bàn và phân bổ căn theo tầng sinh động, mang lại trải nghiệm khác biệt hoàn toàn so với bảng số liệu phẳng.</li>
  <li><strong>Dashboard công việc theo ngày:</strong> Tổng hợp nhiệm vụ ưu tiên, lịch hẹn xem nhà, nhắc gọi điện và cảnh báo deal gấp.</li>
  <li><strong>Quản lý phí & doanh thu:</strong> Ghi nhận phần trăm hoa hồng, chia sẻ phí nội bộ, tiến độ các đợt thu tiền và báo cáo hiệu suất sale.</li>
  <li><strong>Hệ thống phân quyền (RBAC) & Bảo mật tài khoản:</strong> 3 cấp độ phân quyền chuyên sâu: <em>Quản trị viên (Admin)</em>, <em>Nhân viên (Sale)</em>, <em>Chỉ xem (Viewer)</em>. Tích hợp quản lý phiên đăng nhập, khóa tài khoản tạm thời, reset mật khẩu an toàn.</li>
</ul>

<h3>4. Góc Nhìn Công Nghệ: AI + Vibe Coding Thay Đổi Cách Xây Phần Mềm</h3>
<p>Một điểm đặc biệt trong quá trình phát triển FourLand CRM 3D là việc áp dụng phương pháp <strong>AI-assisted Development & Vibe Coding</strong>:</p>
<p>Trước đây, để đưa một ý tưởng CRM với nghiệp vụ sâu từ giao diện, database, phân quyền đến workflow hoàn chỉnh vào thực tế thường đòi hỏi đội ngũ 4 - 6 kỹ sư phần mềm làm việc trong 3 - 6 tháng với ngân sách hàng trăm triệu đồng.</p>
<p>Hiện nay, khi người xây dựng nắm vững kiến trúc hệ thống và quy trình nghiệp vụ thực tế của ngành BĐS, việc phối hợp cùng AI cho phép:</p>
<ul>
  <li>Thử nghiệm (prototype) giao diện 3D và các luồng UX phức tạp chỉ trong vài ngày.</li>
  <li>Liên tục đối thoại với AI để tối ưu logic thuật toán matching căn - khách, cấu trúc cơ sở dữ liệu và xử lý edge cases.</li>
  <li>Sửa lỗi, kiểm thử và nâng cấp tính năng ngay lập tức theo phản hồi thực tế mà không bị nghẽn quy trình.</li>
</ul>

<h3>5. Lộ Trình Phát Triển Tiếp Theo</h3>
<p>FourLand CRM 3D đang tiếp tục được nâng cấp với các định hướng chiến lược:</p>
<ul>
  <li><strong>Triển khai Cloud Multi-Tenant:</strong> Đưa hệ thống lên môi trường đám mây bảo mật cao, sẵn sàng phục vụ các sàn môi giới BĐS với quy mô từ 20 đến 200+ nhân sự.</li>
  <li><strong>Tích hợp Meta Ads & Lead Sync:</strong> Tự động kéo lead từ chiến dịch Facebook/Instagram Ads về CRM theo thời gian thực (Zero-latency), phân bổ tức thì cho sale trực thuộc.</li>
  <li><strong>Zalo AI Sync & Marketing Automation:</strong> Gửi thông báo nhắc lịch cho khách hàng qua Zalo ZNS / OA, tự động kích hoạt chuỗi chăm sóc sau khi dẫn khách đi xem nhà.</li>
</ul>`
};

async function main() {
  console.log('Checking if FourLand CRM 3D exists in Supabase...');
  const { data: existing, error: checkError } = await supabase
    .from('projects')
    .select('id, slug')
    .eq('slug', projectData.slug)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking project:', checkError);
    process.exit(1);
  }

  if (existing) {
    console.log('Project already exists with ID:', existing.id, '- Updating...');
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...projectData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select();

    if (error) {
      console.error('Error updating project:', error);
      process.exit(1);
    }
    console.log('Successfully updated project:', data[0].title);
  } else {
    console.log('Project does not exist. Inserting new project...');
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error inserting project:', error);
      process.exit(1);
    }
    console.log('Successfully inserted project with ID:', data[0].id);
  }
}

main();
