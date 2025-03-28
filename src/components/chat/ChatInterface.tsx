
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, ChevronDown, Image, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';
import { useGeminiChat } from '@/hooks/use-gemini-chat';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { ImageInput } from './ImageInput';
import { ScrollArea } from "@/components/ui/scroll-area";

// Add imports at the top
import { Paperclip, Smartphone, Monitor } from "lucide-react";

export function ChatInterface() {
  // Add refs and handlers before the return statement
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const validTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Unsupported file type');
      return;
    }

    try {
      const documentMessage = `[Document uploaded: ${file.name}]`;
      sendMessage(documentMessage);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to process document');
    }
  };

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    activePersona,
    changePersona
  } = useGeminiChat({
    initialMessages: [
      {
        id: '1',
        content: "Hello! I'm your Vyoma AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
        animate: true
      }
    ]
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  
  // Enhanced scroll to bottom function with force option
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth' 
      });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };
  
  // Improved auto-scrolling mechanism
  useEffect(() => {
    // Immediate scroll for fast response
    scrollToBottom(true);
    
    // Additional forced scroll after all content likely rendered
    const scrollTimers = [50, 100, 300, 500, 1000].map(delay => 
      setTimeout(() => scrollToBottom(true), delay)
    );
    
    return () => {
      scrollTimers.forEach(timer => clearTimeout(timer));
    };
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Initial scroll when component mounts
    setTimeout(() => scrollToBottom(true), 100);
  }, []);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
            
          setInputValue(transcript);
          
          if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        setRecognitionInstance(recognition);
      }
    }
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Force scroll after sending message
    setTimeout(() => scrollToBottom(true), 100);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const toggleRecording = () => {
    if (!recognitionInstance) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    if (!isRecording) {
      recognitionInstance.start();
      setIsRecording(true);
      toast.success('Voice recording started');
    } else {
      recognitionInstance.stop();
      setIsRecording(false);
      toast.info('Voice recording stopped');
    }
  };

  const handleImageSubmit = (imageUrl: string) => {
    if (!imageUrl) return;
    
    const userMessage = `[Image uploaded]\n${inputValue}`.trim();
    if (userMessage) {
      sendMessage(userMessage, imageUrl);
      setInputValue('');
      setShowImageInput(false);
      
      // Force scroll after submitting image
      setTimeout(() => scrollToBottom(true), 100);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "flex-1 overflow-y-auto scroll-smooth",
        isMobile && "mt-14 pb-32" // Add top margin for header and bottom padding for input
      )} ref={scrollContainerRef}>
        <div className="min-h-full">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {/* Loading State */}
          {isLoading && (
            <div className="py-4 animate-pulse">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-4">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-accent/20">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">Vyoma AI</span>
                  </div>
                  <div className="mt-2 flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Input Component */}
          {showImageInput && (
            <ImageInput 
              onSubmit={handleImageSubmit} 
              onCancel={() => setShowImageInput(false)} 
            />
          )}
          
          <div ref={messagesEndRef} className="h-20" />
        </div>
      </div>
      
      {/* Input Container Section */}
      <div className={cn(
        "border-t border-purple-700/30 py-1.5 px-2",
        isMobile && "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md"
      )}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-1.5">
            <div className="overflow-hidden rounded-lg shadow-sm border border-purple-600/30 focus-within:ring-1 focus-within:ring-purple-400/50 bg-purple-900/30 backdrop-blur-sm">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Message Vyoma AI..."
                className="block w-full resize-none border-0 bg-transparent py-2 px-2.5 text-foreground placeholder:text-purple-400/50 focus:ring-0 sm:text-sm sm:leading-6"
                style={{ 
                  minHeight: '40px', 
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}
                disabled={isLoading}
              />
            </div>
    
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
                  onClick={() => documentInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <input
                    type="file"
                    ref={documentInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleDocumentUpload(e)}
                  />
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
    
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
                  onClick={() => setShowImageInput(!showImageInput)}
                  disabled={isLoading}
                >
                  <Image className="h-4 w-4" />
                </Button>
    
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-7 w-7 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50", 
                    isRecording && "text-red-400 bg-purple-900/50"
                  )}
                  onClick={toggleRecording}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
    
              <Button
                type="submit"
                size="icon"
                className="h-6 w-6 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
    
          {/* Responsive Device Notice */}
          <div className="mt-1 flex items-center justify-center space-x-1.5">
            <Smartphone className="h-3 w-3 text-purple-400/50 hidden sm:block" />
            <Monitor className="h-3 w-3 text-purple-400/50 hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
