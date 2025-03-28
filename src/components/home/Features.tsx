
import React from 'react';
import { RevealText } from '@/components/ui/RevealText';
import { Sparkles, Globe, Users, Shield, Palette, Bot, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [
  {
    icon: Sparkles,
    title: "Futuristic & Ultra-Smooth UI",
    description: "Experience a minimalist, vibrant, and super responsive interface designed for productivity and delight."
  },
  {
    icon: Bot,
    title: "Customizable AI Personas",
    description: "Select AI personalities that match your style - from professional to casual, sarcastic to motivational."
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Our platform supports over 100 languages, making advanced AI accessible to users worldwide."
  },
  {
    icon: Palette,
    title: "Voice-Enabled AI",
    description: "Enjoy hands-free AI interaction with natural voice conversations in multiple languages."
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Rest easy with end-to-end encryption, OAuth2 authentication, and AI-powered fraud detection."
  },
  {
    icon: Zap,
    title: "Lightning-Fast Responses",
    description: "Our optimized AI architecture delivers answers in milliseconds, not seconds."
  }
];

export function Features() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 md:py-28 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950/20 -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealText as="div" className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            What Makes This <span className="text-gradient">Lovable</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI platform combines cutting-edge technology with an exceptional user experience
          </p>
        </RevealText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <RevealText 
              key={feature.title} 
              delay={100 + idx * 100} 
              className="h-full"
            >
              <div className="h-full p-6 rounded-xl purple-gradient-card hover:shadow-purple-500/5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/20 backdrop-blur-sm">
                      <feature.icon className="h-6 w-6 text-purple-300" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
