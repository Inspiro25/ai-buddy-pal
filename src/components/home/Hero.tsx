
import React from 'react';
import { RevealText } from '@/components/ui/RevealText';
import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function Hero() {
  const isMobile = useIsMobile();

  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <AnimatedGradient 
        colors={['from-purple-800/30', 'via-indigo-700/20', 'to-violet-600/30']} 
        intensity="medium"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-500 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-purple-900/40 backdrop-blur-sm p-3 rounded-full border border-purple-500/30">
                  <Sparkles className="h-8 w-8 text-purple-300" />
                </div>
              </div>
            </div>
            
            <RevealText 
              as="h1" 
              className="heading-xl mb-6 tracking-tight"
              delay={100}
            >
              <span className="text-gradient">Vyoma AI</span>{' '}
              <span className="block mt-1 text-white">Your Advanced AI Companion</span>
            </RevealText>
            
            <RevealText 
              as="p" 
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10" 
              delay={300}
              cascade
            >
              Experience the next generation of AI tools designed to enhance productivity, 
              creativity, and learning across multiple domains.
            </RevealText>
            
            <RevealText delay={500} className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="relative group overflow-hidden">
                <Link to="/chatbot" className="flex items-center">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 animate-gradient-move bg-[length:200%_auto] -z-10"></span>
                  Try AI Chatbot 
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-purple-500/50 hover:bg-purple-900/30">
                <a href="#regions">
                  Explore AI Regions
                </a>
              </Button>
            </RevealText>
            
            {!isMobile && (
              <div className="mt-20 relative">
                <div className="absolute -inset-10 bg-purple-500 rounded-full blur-3xl opacity-10"></div>
                <RevealText delay={700} className="relative">
                  <div className="w-full max-w-3xl mx-auto h-12 rounded-full purple-gradient-card shimmer"></div>
                </RevealText>
              </div>
            )}
          </div>
        </div>
      </AnimatedGradient>
    </section>
  );
}
