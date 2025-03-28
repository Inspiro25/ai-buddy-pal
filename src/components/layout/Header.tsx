
import { useState } from 'react';
import { PanelLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header({ setSidebarOpen, sidebarOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 bg-purple-950/90 backdrop-blur-lg border-b border-purple-500/20 h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-ping" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x group-hover:animate-gradient-move">
            VYOMA AI
          </h1>
          <div className="hidden group-hover:block absolute top-full left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PanelLeft className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
        </Button>
      </div>
    </header>
  );
}
