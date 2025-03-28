
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

// Remove the scroll-utils import
import { Paperclip, Smartphone, Monitor } from "lucide-react";

export function ChatInterface() {
  const isMobile = useIsMobile();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollButton(distanceFromBottom > 100);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

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

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInputValue(transcript);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          setRecognitionInstance(null);
        };
        
        recognition.start();
        setIsRecording(true);
        setRecognitionInstance(recognition);
      } catch (error) {
        toast.error('Microphone access denied or not supported');
        setIsRecording(false);
      }
    } else {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setIsRecording(false);
      setRecognitionInstance(null);
    }
  };

  const handleImageSubmit = async (imageData: string) => {
    try {
      if (!imageData) {
        toast.error('Please select an image');
        return;
      }

      await sendMessage('', {
        imageData: imageData
      });
      
      setShowImageInput(false);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div 
        className={cn(
          "flex-1 overflow-y-auto scroll-smooth",
          isMobile && "mt-14 pb-32"
        )}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
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
          
          {showScrollButton && (
            <div 
              onClick={() => scrollToBottom(true)}
              className="fixed bottom-28 right-4 p-2 rounded-full bg-purple-600/80 hover:bg-purple-500/80 cursor-pointer transition-all duration-200 shadow-lg backdrop-blur-sm z-50"
            >
              <ChevronDown className="h-5 w-5 text-white" />
            </div>
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


