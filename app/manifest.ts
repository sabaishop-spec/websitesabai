import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FURANO - Chuyên gia chăm sóc răng niềng',
    short_name: 'FURANO',
    description: 'Chuyên gia cung cấp sản phẩm chăm sóc răng niềng chuyên biệt. Nụ Cười Hoàn Mỹ Dành Riêng Cho Team Niềng Răng.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3DCAA0',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}
