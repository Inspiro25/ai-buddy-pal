
import { useRef, useEffect, useState } from 'react';
import { useGeminiChat } from '@/hooks/use-gemini-chat';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInterface() {
  const { 
    messages = [], 
    sendMessage, 
    isLoading,
    currentChatId 
  } = useGeminiChat() || {};
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Improved scroll handling
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChatId]); // Add currentChatId dependency

  // Add scroll event listener to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text: string, attachments?: Array<{
    type: 'image' | 'document' | 'audio';
    file: File;
    preview?: string;
  }>) => {
    // Process attachments if needed
    if (attachments && attachments.length > 0) {
      // For now, we'll just add a note about the attachments
      const attachmentDescriptions = attachments.map(a => `[${a.type}: ${a.file.name}]`).join(' ');
      const messageWithAttachments = text ? 
        `${text}\n\n${attachmentDescriptions}` : 
        attachmentDescriptions;
      
      sendMessage(messageWithAttachments);
    } else {
      sendMessage(text);
    }
  };

  // Enhanced animation variants
  const messageVariants = {
    initial: (i: number) => ({
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: 10,
      filter: 'blur(8px)'
    }),
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: i * 0.05,
        duration: 0.4
      }
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-56px)] overflow-hidden">
      {messages.length === 0 ? (
        // Welcome screen with enhanced creative animations
        <div className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden pt-0 mt-0">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500/10"
                initial={{ 
                  x: Math.random() * 100 - 50 + "%", 
                  y: Math.random() * 100 - 50 + "%",
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 0
                }}
                animate={{ 
                  x: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                  y: [
                    Math.random() * 100 - 50 + "%", 
                    Math.random() * 100 - 50 + "%"
                  ],
                  scale: [
                    Math.random() * 0.5 + 0.5,
                    Math.random() * 1 + 1
                  ],
                  opacity: [0, 0.3, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: Math.random() * 20 + 10,
                  ease: "easeInOut"
                }}
                style={{
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                }}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-center z-10">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateY: 0,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 10,
                duration: 1.5
              }}
              className="relative mb-1"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-purple-400" />
              </motion.div>
              <motion.div 
                className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"
                animate={{ 
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Animated title */}
            <motion.h2 
              className="text-lg md:text-2xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome to Vyoma AI
            </motion.h2>
            
            {/* Animated description */}
            <motion.p 
              className="text-gray-400 text-sm md:text-base max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Your intelligent assistant for coding, learning, and creative exploration.
            </motion.p>
          </div>
        </div>
      ) : (
        // Messages area - no changes needed here
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-1 md:p-4 space-y-2 md:space-y-4 pb-32 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                custom={index}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`${message.role === 'user' ? 'origin-right' : 'origin-left'}`}
              >
                <ChatMessage message={message} compact={true} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {/* Scroll to bottom button with animation */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg z-30"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-purple-950/95 border-t border-purple-800/30 shadow-lg">
        <MessageInput onSend={handleSendMessage} isLoading={isLoading} compact={true} />
      </div>
    </div>
  );
}


