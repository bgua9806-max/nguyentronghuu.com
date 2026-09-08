import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

type LegalVariant = 'privacy' | 'terms' | 'editorial';

interface LegalPageProps {
  variant: LegalVariant;
}

const pages = {
  privacy: {
    eyebrow: 'Quyền riêng tư',
    title: 'Chính sách bảo mật',
    description: 'Chính sách bảo mật thông tin khi bạn truy cập và gửi yêu cầu tư vấn trên nguyentronghuu.com.',
    path: '/privacy',
    sections: [
      {
        title: 'Thông tin được thu thập',
        paragraphs: [
          'Khi bạn chủ động gửi biểu mẫu liên hệ, website có thể tiếp nhận họ tên, email, số điện thoại và nội dung yêu cầu do bạn cung cấp.',
          'Website cũng có thể ghi nhận dữ liệu kỹ thuật cơ bản do trình duyệt hoặc nền tảng lưu trữ cung cấp để duy trì bảo mật và khả năng vận hành.'
        ]
      },
      {
        title: 'Mục đích sử dụng',
        paragraphs: [
          'Thông tin liên hệ được dùng để phản hồi yêu cầu, trao đổi về nhu cầu dịch vụ và hỗ trợ trong quá trình làm việc. Dữ liệu không được bán cho bên thứ ba.',
          'Trong trường hợp cần dùng nhà cung cấp hạ tầng hoặc công cụ hỗ trợ, dữ liệu chỉ được xử lý ở mức cần thiết để website và quy trình liên hệ hoạt động.'
        ]
      },
      {
        title: 'Lưu trữ và bảo vệ dữ liệu',
        paragraphs: [
          'Các biện pháp kỹ thuật và quyền truy cập phù hợp được áp dụng để hạn chế truy cập, thay đổi hoặc tiết lộ trái phép. Không có phương thức truyền tải hay lưu trữ trực tuyến nào bảo đảm an toàn tuyệt đối.',
          'Thông tin được lưu trong thời gian cần thiết để xử lý yêu cầu, duy trì quan hệ công việc hoặc đáp ứng nghĩa vụ hợp pháp có liên quan.'
        ]
      },
      {
        title: 'Cookie và tùy chọn trình duyệt',
        paragraphs: [
          'Website có thể sử dụng bộ nhớ trình duyệt để ghi nhớ tùy chọn giao diện. Bạn có thể xóa hoặc chặn dữ liệu này trong phần cài đặt của trình duyệt.'
        ]
      },
      {
        title: 'Quyền của bạn',
        paragraphs: [
          'Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã gửi bằng cách liên hệ qua email. Yêu cầu sẽ được xử lý trong phạm vi kỹ thuật và pháp lý cho phép.'
        ]
      }
    ]
  },
  terms: {
    eyebrow: 'Điều khoản',
    title: 'Điều khoản sử dụng',
    description: 'Các điều khoản áp dụng khi truy cập nội dung và sử dụng biểu mẫu liên hệ trên nguyentronghuu.com.',
    path: '/terms',
    sections: [
      {
        title: 'Phạm vi áp dụng',
        paragraphs: [
          'Việc truy cập website đồng nghĩa với việc bạn đồng ý sử dụng nội dung và tính năng theo các điều khoản này. Nếu không đồng ý, bạn nên ngừng sử dụng website.'
        ]
      },
      {
        title: 'Thông tin dịch vụ',
        paragraphs: [
          'Nội dung trên website mang tính giới thiệu chung. Phạm vi công việc, chi phí, thời gian, quyền lợi và trách nhiệm cụ thể chỉ có hiệu lực khi được hai bên xác nhận trong đề xuất, báo giá hoặc thỏa thuận riêng.'
        ]
      },
      {
        title: 'Quyền sở hữu nội dung',
        paragraphs: [
          'Trừ khi có ghi chú khác, nội dung, thiết kế và tài liệu trên website thuộc quyền sử dụng của Nguyễn Trọng Hữu. Bạn không được sao chép, phân phối hoặc khai thác thương mại nếu chưa có sự đồng ý.'
        ]
      },
      {
        title: 'Sử dụng hợp lệ',
        paragraphs: [
          'Bạn không được sử dụng website để gửi nội dung trái pháp luật, gây gián đoạn hệ thống, dò quét bảo mật, phát tán mã độc hoặc xâm phạm quyền của người khác.'
        ]
      },
      {
        title: 'Liên kết và dịch vụ bên ngoài',
        paragraphs: [
          'Website có thể dẫn đến nền tảng bên ngoài như mạng xã hội hoặc công cụ liên lạc. Các nền tảng đó có chính sách và điều khoản riêng; website không kiểm soát hoạt động của họ.'
        ]
      },
      {
        title: 'Thay đổi điều khoản',
        paragraphs: [
          'Nội dung điều khoản có thể được cập nhật khi website hoặc quy trình cung cấp dịch vụ thay đổi. Phiên bản đang hiển thị trên trang này là phiên bản được áp dụng.'
        ]
      }
    ]
  },
  editorial: {
    eyebrow: 'Minh bạch nội dung',
    title: 'Nguyên tắc biên tập & công bố thông tin',
    description: 'Cách nội dung, số liệu, ví dụ và case study trên nguyentronghuu.com được biên soạn, kiểm tra và cập nhật.',
    path: '/editorial-policy',
    sections: [
      {
        title: 'Tác giả và trách nhiệm nội dung',
        paragraphs: [
          'Nội dung chuyên môn trên website được xuất bản dưới tên Nguyễn Trọng Hữu. Trang tác giả cung cấp thông tin về kinh nghiệm, lĩnh vực làm việc và phương thức liên hệ để người đọc có thể xác minh.',
          'Mỗi bài viết hiển thị ngày xuất bản và ngày cập nhật khi có thay đổi trong hệ thống quản trị nội dung.'
        ]
      },
      {
        title: 'Nguồn và dữ liệu',
        paragraphs: [
          'Khi sử dụng thông tin, tài liệu hoặc số liệu từ bên ngoài, bài viết ưu tiên liên kết đến nguồn gốc hoặc tài liệu chính thức. Nhận định dựa trên kinh nghiệm triển khai được trình bày như kinh nghiệm hoặc quan điểm, không thay thế dữ liệu độc lập.',
          'Số liệu dự án chỉ được công bố khi có phạm vi đo lường đủ rõ và được phép chia sẻ. Thông tin nhận diện khách hàng có thể được ẩn hoặc khái quát để bảo vệ tính bảo mật.'
        ]
      },
      {
        title: 'AI và tự động hóa trong biên tập',
        paragraphs: [
          'Công cụ AI có thể được dùng để hỗ trợ nghiên cứu, lập dàn ý hoặc rà soát cách diễn đạt. Tác giả chịu trách nhiệm kiểm tra nội dung, tính phù hợp và quyết định xuất bản cuối cùng.',
          'Nội dung không được xuất bản chỉ nhằm tạo số lượng hoặc thao túng thứ hạng tìm kiếm.'
        ]
      },
      {
        title: 'Sửa lỗi và cập nhật',
        paragraphs: [
          'Nội dung được rà soát khi công nghệ, nền tảng hoặc quy định liên quan thay đổi. Những cập nhật quan trọng được phản ánh qua ngày cập nhật trên bài viết.',
          'Nếu phát hiện thông tin chưa chính xác, người đọc có thể gửi URL và nội dung cần kiểm tra qua email. Phản hồi sẽ được xem xét dựa trên nguồn và bằng chứng kèm theo.'
        ]
      },
      {
        title: 'Giới hạn của nội dung',
        paragraphs: [
          'Bài viết mang tính chia sẻ kiến thức và kinh nghiệm chung. Khuyến nghị cụ thể cho doanh nghiệp chỉ được đưa ra sau khi hiểu mục tiêu, dữ liệu, ngân sách, hệ thống và rủi ro thực tế.'
        ]
      }
    ]
  }
} as const;

export default function LegalPage({ variant }: LegalPageProps) {
  const page = pages[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-zinc-50 px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-40"
    >
      <SEO
        title={page.title}
        description={page.description}
        url={`https://nguyentronghuu.com${page.path}`}
        breadcrumbs={[
          { name: 'Trang chủ', url: 'https://nguyentronghuu.com' },
          { name: page.title, url: `https://nguyentronghuu.com${page.path}` }
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <Link to="/" className="group mb-12 inline-flex items-center gap-3 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-colors group-hover:border-zinc-300">
            <ArrowLeft size={16} />
          </span>
          Trở lại trang chủ
        </Link>

        <header className="mb-12 border-b border-zinc-200 pb-10 md:mb-16 md:pb-12">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-500">{page.eyebrow}</p>
          <h1 className="font-serif text-4xl leading-tight text-zinc-900 md:text-6xl">{page.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">{page.description}</p>
          <p className="mt-5 text-xs text-zinc-500">Cập nhật lần cuối: {variant === 'editorial' ? '08/09/2026' : '31/08/2026'}</p>
        </header>

        <div className="space-y-12">
          {page.sections.map((section, index) => (
            <section key={section.title} className="grid gap-4 md:grid-cols-[3rem_1fr] md:gap-6">
              <span className="font-mono text-xs text-zinc-400">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="mb-4 font-serif text-2xl text-zinc-900 md:text-3xl">{section.title}</h2>
                <div className="space-y-4 text-sm leading-relaxed text-zinc-600 md:text-base">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-2xl bg-zinc-950 p-6 text-white md:p-9">
          <h2 className="font-serif text-2xl md:text-3xl">Cần trao đổi thêm?</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">Gửi câu hỏi về chính sách hoặc cách thông tin của bạn được xử lý.</p>
          <a href="mailto:nguyentronghuu1905@gmail.com" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white">
            Gửi email
          </a>
        </section>
      </div>
    </motion.div>
  );
}
