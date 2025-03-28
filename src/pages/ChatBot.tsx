
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Bot, PanelLeft, Plus, Sparkles } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ChatBot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedClass, setAnimatedClass] = useState("");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Initial loading animation
    setTimeout(() => setIsLoading(false), 2000);
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

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          {/* Animated rings */}
          <motion.div
            className="absolute -inset-8 opacity-75"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl" />
          </motion.div>

          {/* Main icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <Sparkles className="h-20 w-20 text-purple-300" />
          </motion.div>

          {/* Text animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 text-transparent bg-clip-text">
              VYOMA AI
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 text-purple-300/70"
            >
              Initializing AI Assistant...
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] h-[100dvh] flex flex-col bg-[#0a0a0a] text-gray-100"
    >
      <FloatingParticles />
      
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/95 via-violet-950/90 to-indigo-950/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(147,51,234,0.1),transparent_70%)]" />
      </div>
      
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      
      <div className="flex-1 flex relative">
        {/* Fixed sidebar positioning */}
        <aside 
          className={cn(
            "fixed md:sticky top-0 left-0 h-full w-80 shrink-0",
            "z-40 bg-purple-950/90 backdrop-blur-xl",
            "transition-transform duration-300 ease-out",
            "border-r border-purple-500/20",
            !sidebarOpen && "-translate-x-full md:translate-x-0"
          )}
          style={{ 
            height: 'calc(100dvh - var(--header-height, 64px))',
            top: 'var(--header-height, 64px)'
          }}
        >
          <div className="h-full flex flex-col">
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

        {/* Main chat area with proper margin */}
        <main 
          className={cn(
            "flex-1 relative min-w-0",
            "transition-[margin] duration-300 ease-out",
            sidebarOpen ? "md:ml-80" : "ml-0"
          )}
        >
          <ChatInterface />
        </main>

        {/* Improved overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ChatBot;
