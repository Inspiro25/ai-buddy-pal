
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Bot, Sparkles } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ChatBot = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  
  useEffect(() => {
    // Shorter loading time for better UX
    setTimeout(() => setIsLoading(false), 1500);
    
    // Mobile viewport optimizations
    if (isMobile) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overscrollBehavior = 'none';
      
      // Add viewport meta tag for better mobile scaling
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewportMeta);
    }
    
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overscrollBehavior = '';
      
      // Remove viewport meta if added
      if (isMobile) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) meta.remove();
      }
    };
  }, [isMobile]);

  // Update sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
    
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 blur-xl" />
          </motion.div>

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
            <Sparkles className="h-16 w-16 text-teal-300" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 text-transparent bg-clip-text">
              GEMINI AI
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 text-teal-300/70 text-sm"
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
      className="min-h-[100dvh] h-[100dvh] flex flex-col bg-[#0a0a0a] text-gray-100 overflow-hidden"
    >
      <FloatingParticles />
      
      <div className="fixed inset-0 bg-gradient-to-br from-gemini-teal-dark/95 via-[#042f2c]/90 to-[#052e34]/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.1),transparent_70%)]" />
      </div>
      
      <div className="flex-1 flex relative pt-16">
        <aside 
          className={cn(
            "fixed top-0 left-0 h-full w-[85vw] md:w-80 shrink-0",
            "z-40 bg-[#042f2c]/90 backdrop-blur-xl",
            "transition-transform duration-300 ease-out",
            "border-r border-teal-500/20",
            !sidebarOpen && "-translate-x-full md:translate-x-0"
          )}
          style={{ 
            height: 'calc(100dvh - var(--header-height, 64px))',
            top: 'var(--header-height, 64px)'
          }}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Bot className="h-5 w-5 text-teal-300" />
              </div>
              <h2 className="text-lg font-semibold text-teal-50">Chat History</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatHistory />
            </div>
          </div>
        </aside>

        <main 
          className={cn(
            "flex-1 relative min-w-0 h-full",
            "transition-[margin] duration-300 ease-out",
            sidebarOpen ? "md:ml-80" : "ml-0"
          )}
        >
          <ChatInterface />
        </main>

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
