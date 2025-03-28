
import { RevealText } from '@/components/ui/RevealText';
import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { AIRegions } from '@/components/home/AIRegions';
import { FloatingParticles } from '@/components/ui/FloatingParticles';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingParticles />
      <Header />
      <div className="relative z-10">
        <main>
          <Hero />
          <Features />
          <AIRegions />
        </main>
      </div>
    </div>
  );
};

export default Index;
