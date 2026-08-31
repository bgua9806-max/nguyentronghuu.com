import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <section className="min-h-[75vh] px-6 pt-36 pb-24 flex items-center justify-center bg-white">
      <SEO
        title="Không tìm thấy trang"
        description="Trang bạn đang tìm không tồn tại hoặc đã được di chuyển."
        url="https://nguyentronghuu.com/404"
        noIndex
      />
      <div className="max-w-xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-zinc-400 mb-5">404</p>
        <h1 className="text-4xl md:text-6xl font-serif text-zinc-900 mb-6">Không tìm thấy trang.</h1>
        <p className="text-zinc-600 leading-relaxed mb-10">
          Đường dẫn có thể đã thay đổi hoặc nội dung không còn tồn tại.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border-b-2 border-zinc-900 pb-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 hover:border-zinc-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </section>
  );
}
