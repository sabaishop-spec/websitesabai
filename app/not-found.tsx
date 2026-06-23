import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Không tìm thấy trang.</p>
        <Link href="/" className="px-6 py-2 bg-brand-800 text-white rounded-full">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
