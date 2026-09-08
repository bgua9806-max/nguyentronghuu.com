export const COMMON_SERVICE_FAQS = [
  {
    question: 'Chi phí triển khai được xác định như thế nào?',
    answer: 'Chi phí phụ thuộc vào phạm vi tính năng, mức độ tích hợp, khối lượng dữ liệu và hiện trạng hệ thống. Sau buổi trao đổi yêu cầu, doanh nghiệp nhận được đề xuất phạm vi, mốc bàn giao và chi phí tương ứng trước khi quyết định.',
  },
  {
    question: 'Sau khi bàn giao có tài liệu và hỗ trợ vận hành không?',
    answer: 'Có. Dự án được bàn giao kèm tài liệu sử dụng, hướng dẫn vận hành và phạm vi bảo hành hoặc hỗ trợ kỹ thuật được thống nhất trong đề xuất triển khai.',
  },
];

export const SERVICE_FAQS_BY_SLUG = {
  'chatgpt-ads-agent-automation': [
    {
      question: 'AI Agent có tự ý thay đổi ngân sách hoặc tắt chiến dịch không?',
      answer: 'Không mặc định. Quyền hành động, ngưỡng ngân sách và các thao tác cần con người phê duyệt được cấu hình theo quy tắc của doanh nghiệp. Hệ thống có thể chỉ đọc và cảnh báo nếu chưa được cấp quyền chỉnh sửa.',
    },
    {
      question: 'Cần cấp những quyền nào từ tài khoản quảng cáo?',
      answer: 'Phạm vi quyền phụ thuộc vào tác vụ đã thống nhất. Nguyên tắc là chỉ cấp quyền tối thiểu cần thiết cho tài khoản quảng cáo, trang và nguồn dữ liệu; thông tin truy cập được quản lý theo cơ chế của nền tảng thay vì chia sẻ mật khẩu.',
    },
  ],
  'multi-channel-auto-posting': [
    {
      question: 'Hệ thống có đăng cùng một nội dung lên mọi nền tảng không?',
      answer: 'Không bắt buộc. Nội dung có thể được chuyển đổi theo giới hạn ký tự, tỷ lệ ảnh hoặc video, hashtag và cách trình bày của từng kênh trước khi đưa vào hàng đợi xuất bản.',
    },
    {
      question: 'Nền tảng nào có thể kết nối?',
      answer: 'Khả năng kết nối phụ thuộc API và loại tài khoản tại thời điểm triển khai. Phạm vi thường được khảo sát cho Facebook, Instagram, TikTok, YouTube, Threads, LinkedIn, WordPress và các kênh nội bộ phù hợp.',
    },
  ],
  'zalo-ai-data-sync': [
    {
      question: 'AI bóc tách được những trường dữ liệu nào từ tin nhắn Zalo?',
      answer: 'Các trường được thiết kế theo nghiệp vụ, ví dụ nhu cầu mua hoặc bán, sản phẩm, khu vực, mức giá, thời gian và thông tin liên hệ. Mẫu dữ liệu thực tế được dùng để xác định schema và kiểm thử độ chính xác.',
    },
    {
      question: 'Dữ liệu sau khi bóc tách được lưu ở đâu?',
      answer: 'Dữ liệu có thể được lưu vào Google Sheets, cơ sở dữ liệu hoặc Web App do doanh nghiệp kiểm soát. Quyền truy cập, thời gian lưu và cơ chế xóa dữ liệu được thống nhất trước khi triển khai.',
    },
  ],
  'ai-ads-automation': [
    {
      question: 'AI tối ưu quảng cáo dựa trên những dữ liệu nào?',
      answer: 'Hệ thống sử dụng các chỉ số được doanh nghiệp cho phép như chi tiêu, CPM, CTR, CPC, CPA, ROAS, chuyển đổi và dữ liệu creative. Quy tắc tối ưu phải gắn với mục tiêu và chất lượng dữ liệu thực tế.',
    },
    {
      question: 'Có thể áp dụng cho tài khoản quảng cáo đang chạy không?',
      answer: 'Có thể, nhưng cần audit cấu trúc chiến dịch, tracking và quyền truy cập trước. Giai đoạn đầu nên chạy ở chế độ đọc, báo cáo hoặc thử nghiệm giới hạn trước khi cho phép tự động thực hiện thay đổi.',
    },
  ],
  'google-sheets-automation': [
    {
      question: 'Khi nào nên dùng Google Sheets và khi nào cần Web App riêng?',
      answer: 'Google Sheets phù hợp với quy trình nhỏ hoặc vừa, cần triển khai nhanh và đội ngũ đã quen bảng tính. Khi dữ liệu lớn, phân quyền phức tạp, nhiều người thao tác đồng thời hoặc yêu cầu kiểm soát chặt, nên cân nhắc cơ sở dữ liệu và Web App riêng.',
    },
    {
      question: 'Hệ thống có kết nối được biểu mẫu, CRM và API không?',
      answer: 'Có thể kết nối nếu nguồn dữ liệu cung cấp API, webhook hoặc phương thức xuất nhập phù hợp. Khả năng và giới hạn của từng tích hợp được kiểm tra trong bước khảo sát kỹ thuật.',
    },
  ],
  'marketing-growth': [
    {
      question: 'Dịch vụ Growth Marketing bắt đầu từ quảng cáo hay dữ liệu?',
      answer: 'Dịch vụ bắt đầu từ mục tiêu kinh doanh, hành trình khách hàng và độ tin cậy của dữ liệu đo lường. Quảng cáo chỉ được mở rộng sau khi tracking, landing page và tiêu chí chuyển đổi đã đủ rõ.',
    },
    {
      question: 'Những chỉ số nào được dùng để đánh giá hiệu quả?',
      answer: 'Bộ chỉ số được chọn theo mô hình kinh doanh, thường gồm chất lượng lead, tỷ lệ chuyển đổi, CAC, doanh thu, biên lợi nhuận, LTV và thời gian hoàn vốn; không chỉ dựa vào lượt nhấp hoặc tương tác.',
    },
  ],
  'system-architecture': [
    {
      question: 'Kết quả bàn giao của gói tư vấn kiến trúc gồm những gì?',
      answer: 'Tùy phạm vi, đầu ra có thể gồm sơ đồ kiến trúc hiện trạng và đề xuất, luồng dữ liệu, ranh giới dịch vụ, yêu cầu bảo mật, phương án mở rộng, danh sách rủi ro và lộ trình triển khai theo ưu tiên.',
    },
    {
      question: 'Có bắt buộc thay toàn bộ hệ thống hiện tại không?',
      answer: 'Không. Ưu tiên là tận dụng thành phần còn phù hợp, xác định điểm nghẽn và xây lộ trình chuyển đổi theo giai đoạn để giảm rủi ro gián đoạn vận hành.',
    },
  ],
  'ai-automation': [
    {
      question: 'Quy trình nào phù hợp để tự động hóa bằng AI trước tiên?',
      answer: 'Nên bắt đầu với quy trình lặp lại, có đầu vào và đầu ra rõ, đủ dữ liệu mẫu, dễ đo thời gian tiết kiệm và có rủi ro thấp. Các quyết định nhạy cảm vẫn cần bước kiểm duyệt của con người.',
    },
    {
      question: 'Làm thế nào để hạn chế AI trả lời hoặc xử lý sai?',
      answer: 'Giải pháp kết hợp dữ liệu nguồn được kiểm soát, validation, phân quyền công cụ, ngưỡng tin cậy, nhật ký xử lý và cơ chế chuyển cho con người khi trường hợp nằm ngoài phạm vi.',
    },
  ],
  'web-app': [
    {
      question: 'Website và Web App được tối ưu SEO từ giai đoạn nào?',
      answer: 'SEO kỹ thuật được đưa vào từ lúc thiết kế cấu trúc URL, kiến trúc nội dung và lựa chọn phương án render. Trước bàn giao cần kiểm tra metadata, canonical, sitemap, structured data, khả năng crawl và hiệu năng trang.',
    },
    {
      question: 'Có thể tích hợp CRM, thanh toán hoặc hệ thống hiện có không?',
      answer: 'Có thể nếu hệ thống liên quan cung cấp API, webhook hoặc cơ chế tích hợp phù hợp. Mỗi kết nối được đánh giá về quyền truy cập, bảo mật, giới hạn tốc độ và phương án xử lý lỗi trước khi báo phạm vi.',
    },
  ],
};

export const getServiceFaqs = (slug = '') => [
  ...(SERVICE_FAQS_BY_SLUG[slug] || []),
  ...COMMON_SERVICE_FAQS,
];
