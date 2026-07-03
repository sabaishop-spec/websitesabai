'use client';
import Hero from '../components/Hero';
import Logos from '../components/Logos';
import Routine from '../components/Routine';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';


export default function Home() {
  return (
    <main>

      <Hero />
      <Logos />
      <Routine />
      <Testimonials />
      <CTASection />
    </main>
  );
}
