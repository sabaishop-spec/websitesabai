'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '2rem', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6', textAlign: 'center' }}>
            <h2 style={{ marginTop: '1.5rem', fontSize: '1.875rem', fontWeight: '800', color: '#111827' }}>Đã có lỗi nghiêm trọng!</h2>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>Xin lỗi, một sự cố đã xảy ra ở cấp độ toàn trang.</p>
            
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', textAlign: 'left', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem', fontFamily: 'monospace', maxHeight: '10rem' }}>
                <p style={{ fontWeight: 'bold' }}>{error.name}: {error.message}</p>
                <p style={{ marginTop: '0.25rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>{error.stack}</p>
              </div>
            )}
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => reset()}
                style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#0ea5e9', cursor: 'pointer' }}
              >
                Thử lại
              </button>
              <a 
                href="/"
                style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', textDecoration: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'white' }}
              >
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
