import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-gray-600 mb-8">Trang không tồn tại.</p>
        <Link href="/" className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
