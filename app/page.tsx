import MainLayout from './MainLayout';
import Home from '@/src/page-components/Home';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}
