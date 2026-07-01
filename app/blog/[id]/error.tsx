'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Blog Detail Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đã có lỗi xảy ra!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Chúng tôi không thể hiển thị trang này vào lúc này.
          </p>
          {process.env.NODE_ENV === 'development' && (
             <div className="mt-4 p-4 bg-red-50 text-red-800 text-left rounded-lg overflow-auto text-xs font-mono max-h-40">
               <p className="font-bold">{error.name}: {error.message}</p>
               <p className="mt-1 opacity-80 whitespace-pre-wrap">{error.stack}</p>
             </div>
          )}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
