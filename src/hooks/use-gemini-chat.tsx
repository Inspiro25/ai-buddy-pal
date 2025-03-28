
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  animate?: boolean;
  codeSnippets?: CodeSnippet[];
}

interface CodeSnippet {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx';
  title?: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  lastMessage?: string;
  messageCount: number;
}

interface UseGeminiChatProps {
  initialMessages?: Message[];
  persona?: 'professional' | 'casual' | 'sarcastic' | 'motivational';
}

export function useGeminiChat({ initialMessages = [], persona = 'casual' }: UseGeminiChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState(persona);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const messageQueue = useRef<Message[]>([]);
  const processingRef = useRef(false);

  // Load chat history with debouncing
  useEffect(() => {
    const loadSavedHistory = async () => {
      try {
        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadSavedHistory();
  }, []);

  // Save messages with debouncing
  useEffect(() => {
    if (!currentChatId) return;

    const saveTimeout = setTimeout(() => {
      localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(messages));
      
      // Update chat history with latest message
      setChatHistory(prev => {
        const updated = prev.map(chat => 
          chat.id === currentChatId 
            ? {
                ...chat,
                lastMessage: messages[messages.length - 1]?.content.slice(0, 50),
                messageCount: messages.length,
                timestamp: new Date()
              }
            : chat
        );
        localStorage.setItem('chat_history', JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [messages, currentChatId]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      const savedChat = localStorage.getItem(`chat_${chatId}`);
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      toast.error('Failed to load chat history');
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      localStorage.removeItem(`chat_${chatId}`);
      setChatHistory(prev => {
        const newHistory = prev.filter(chat => chat.id !== chatId);
        localStorage.setItem('chat_history', JSON.stringify(newHistory));
        return newHistory;
      });
      
      if (currentChatId === chatId) {
        setMessages(initialMessages);
        setCurrentChatId('');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error('Failed to delete chat');
    }
  }, [currentChatId, initialMessages]);

  const processMessageQueue = async () => {
    if (processingRef.current || messageQueue.current.length === 0) return;
    
    processingRef.current = true;
    
    try {
      const message = messageQueue.current[0];
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, message].map(msg => ({
            role: msg.role,
            content: msg.content,
            imageUrl: msg.imageUrl
          })),
          persona: activePersona
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const { text, snippets } = extractCodeSnippets(data.generatedText);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date(),
        animate: true,
        codeSnippets: snippets.length > 0 ? snippets : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      messageQueue.current.shift();
    } catch (err: any) {
      console.error('Error processing message:', err);
      toast.error('Failed to get AI response');
    } finally {
      processingRef.current = false;
      if (messageQueue.current.length > 0) {
        processMessageQueue();
      } else {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = useCallback(async (content: string, options?: { imageData?: string }) => {
    if (!content.trim() && !options?.imageData) return;

    // Create new chat if none exists
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
      setChatHistory(prev => {
        const newHistory = [...prev, {
          id: newChatId,
          title: content.slice(0, 30) || 'New Chat',
          timestamp: new Date(),
          messageCount: 0
        }];
        localStorage.setItem('chat_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      imageUrl: options?.imageData,
      animate: true
    };

    setMessages(prev => [...prev, userMessage]);
    messageQueue.current.push(userMessage);
    setIsLoading(true);
    processMessageQueue();
  }, [currentChatId, messages, activePersona]);

  // Function to extract code snippets from a message
  const extractCodeSnippets = (content: string): { text: string, snippets: CodeSnippet[] } => {
    const codeRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const snippets: CodeSnippet[] = [];
    
    // Replace code blocks with placeholders and collect the snippets
    const textWithoutCode = content.replace(codeRegex, (match, lang, code) => {
      const language = lang?.toLowerCase() || 'javascript';
      const supportedLang = ['html', 'css', 'javascript', 'typescript', 'jsx', 'tsx'].includes(language as any) 
        ? language as 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx'
        : 'javascript';
      
      snippets.push({
        code: code.trim(),
        language: supportedLang,
        title: `${supportedLang.toUpperCase()} Code`
      });
      
      return `[CODE_SNIPPET_${snippets.length - 1}]`;
    });
    
    return { text: textWithoutCode, snippets };
  };

  const clearMessages = useCallback(() => {
    setMessages([{
      id: '1',
      content: "Hello! I'm your Vyoma AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
      animate: true
    }]);
  }, []);
  
  const changePersona = useCallback((newPersona: 'professional' | 'casual' | 'sarcastic' | 'motivational') => {
    setActivePersona(newPersona);
    toast.success(`AI persona changed to ${newPersona}`);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    activePersona,
    changePersona,
    chatHistory,
    currentChatId,
    loadChat,
    deleteChat
  };
}
