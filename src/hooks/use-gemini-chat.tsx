
import { useState, useCallback } from 'react';
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

interface UseGeminiChatProps {
  initialMessages?: Message[];
  persona?: 'professional' | 'casual' | 'sarcastic' | 'motivational';
}

export function useGeminiChat({ initialMessages = [], persona = 'casual' }: UseGeminiChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState(persona);

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

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      imageUrl,
      animate: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Call Gemini API via our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
            imageUrl: msg.imageUrl
          })),
          persona: activePersona
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Extract code snippets and process content
      const { text, snippets } = extractCodeSnippets(data.generatedText);
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date(),
        animate: true,
        codeSnippets: snippets.length > 0 ? snippets : undefined
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to communicate with AI');
      toast.error('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  }, [messages, activePersona]);
  
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
    changePersona
  };
}
