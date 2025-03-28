
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Bot, PanelLeft, Plus, Sparkles } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { cn } from "@/lib/utils";

const ChatBot = () => {
  const [animatedClass, setAnimatedClass] = useState("");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setAnimatedClass("animate-fade-in");
    
    // Fix mobile viewport and scrolling issues
    if (isMobile) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overscrollBehavior = 'none';
    }
    
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [isMobile]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  return (
    <div className="min-h-[100dvh] h-[100dvh] flex flex-col relative overflow-hidden">
      <FloatingParticles />
      
      {/* Improved gradient background for mobile */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/95 via-violet-950/90 to-indigo-950/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(147,51,234,0.1),transparent_70%)]" />
      </div>
      
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      
      <main className={cn(
        "flex-1 flex flex-col relative",
        "h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
        animatedClass
      )}>
        <div className="flex-1 flex relative h-full">
          {/* Improved mobile sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-20 w-80 bg-purple-950/90 backdrop-blur-xl border-r border-purple-500/20",
            "transform transition-transform duration-300 ease-in-out pt-safe",
            "sm:relative sm:translate-x-0 sm:pt-16",
            !sidebarOpen && "-translate-x-full"
          )}>
            <div className="h-full flex flex-col pb-4 overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Bot className="h-5 w-5 text-purple-300" />
                </div>
                <h2 className="text-lg font-semibold text-purple-50">Chat History</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatHistory />
              </div>
            </div>
          </aside>

          {/* Improved main chat area */}
          <div className={cn(
            "flex-1 relative w-full",
            isMobile && !sidebarOpen ? "ml-0" : "sm:ml-80"
          )}>
            <div className="absolute inset-0 flex flex-col">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>

      {/* Improved mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatBot;
