
import React from 'react';
import { RevealText } from '@/components/ui/RevealText';
import { Bot, Code, PenTool, BookOpen, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const regions = [
  {
    icon: Bot,
    title: 'AI Chatbot',
    description: 'Interact with our versatile AI assistant trained to help with a wide range of tasks and questions.',
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/20',
    href: '/chatbot'
  },
  {
    icon: Code,
    title: 'Developers Hub',
    description: 'AI tools for software development, debugging, and code optimization.',
    color: 'text-indigo-300',
    bgColor: 'bg-indigo-500/20',
    href: '/developers'
  },
  {
    icon: PenTool,
    title: 'Creative Studio',
    description: 'Generate images, text content, music, and other creative assets with AI.',
    color: 'text-violet-300',
    bgColor: 'bg-violet-500/20',
    href: '/creative'
  },
  {
    icon: BookOpen,
    title: 'Education',
    description: 'AI-powered learning tools, tutoring, and educational content generation.',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/20',
    href: '/education'
  },
  {
    icon: BarChart3,
    title: 'Finance',
    description: 'AI tools for investment analysis, financial planning, and market insights.',
    color: 'text-green-300',
    bgColor: 'bg-green-500/20',
    href: '/finance'
  }
];

export function AIRegions() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-20 md:py-32 relative" id="regions">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-transparent -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealText as="div" className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Explore AI <span className="text-gradient">Regions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our specialized AI tools customized for different domains and use cases
          </p>
        </RevealText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, idx) => (
            <RevealText 
              key={region.title} 
              delay={100 + idx * 100}
              className="h-full"
            >
              <div className="h-full purple-gradient-card rounded-xl p-6 hover:shadow-purple-500/10 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${region.bgColor} backdrop-blur-sm`}>
                    <region.icon className={`h-6 w-6 ${region.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{region.title}</h3>
                  <p className="text-muted-foreground mb-6">{region.description}</p>
                </div>
                <Button asChild variant="ghost" className="group justify-start p-0 hover:bg-transparent">
                  <Link to={region.href} className="flex items-center text-purple-300 hover:text-purple-200">
                    Explore {region.title}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}
