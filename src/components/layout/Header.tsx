
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ArrowLeft, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header({ setSidebarOpen, sidebarOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isChatPage = location.pathname === '/chatbot';
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'AI Chatbot', path: '/chatbot' },
    { name: 'Developers Hub', path: '/developers' },
    { name: 'Education', path: '/education' },
    { name: 'Finance', path: '/finance' },
    { name: 'Creative Studio', path: '/creative' },
  ];
  
  if (isMobile && isChatPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-950/90 backdrop-blur-lg border-b border-purple-500/20">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="tap-feedback">
            <ArrowLeft className="h-6 w-6 text-white" />
          </Link>
          <h1 className="text-lg font-bold text-white">VYOMA AI</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>
      </header>
    );
  }
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3',
        isScrolled ? 'bg-purple-950/80 backdrop-blur-lg border-b border-purple-500/20' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center tap-feedback">
              <span className="text-xl font-bold text-gradient">Vyoma AI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  location.pathname === item.path
                    ? "bg-purple-800/80 text-white"
                    : "hover:bg-purple-900/50 text-white/80 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-900/30">
              Sign In
            </Button>
            <Button size="sm" className="relative group overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 animate-gradient-move bg-[length:200%_auto] -z-10"></span>
              Get Started <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden p-1 tap-feedback">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-purple-950/95 backdrop-blur-xl border-purple-500/20 w-[85vw] sm:max-w-md">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "px-4 py-3 rounded-lg text-base font-medium transition-all tap-feedback",
                      location.pathname === item.path
                        ? "bg-purple-800/80 text-white"
                        : "hover:bg-purple-900/50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 pb-2 border-t border-purple-500/20 mt-2">
                  <Button variant="outline" className="w-full mb-2 border-purple-500/50 hover:bg-purple-900/30 tap-feedback">
                    Sign In
                  </Button>
                  <Button className="w-full relative group overflow-hidden tap-feedback">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-700 via-violet-600 to-purple-700 animate-gradient-move bg-[length:200%_auto] -z-10"></span>
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
