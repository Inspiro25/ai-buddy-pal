
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, ExternalLink } from 'lucide-react';
import { CodeSnippet } from './CodeSnippet';

interface CodeSnippetType {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx';
  title?: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    imageUrl?: string;
    animate?: boolean;
    codeSnippets?: CodeSnippetType[];
  };
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const { role, content, imageUrl, animate, codeSnippets } = message;
  const isUser = role === 'user';
  const hasImage = !!imageUrl;
  
  const [animationComplete, setAnimationComplete] = useState(!animate);
  const [typingText, setTypingText] = useState("");
  
  useEffect(() => {
    if (!animate || isUser) {
      setTypingText(content);
      setAnimationComplete(true);
      return;
    }
    
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < content.length) {
        setTypingText(content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setAnimationComplete(true);
      }
    }, 15); // Speed of typing animation
    
    return () => clearInterval(typingInterval);
  }, [content, animate, isUser]);
  
  // Function to replace code snippet placeholders with the actual snippets
  const renderContentWithCodeSnippets = () => {
    if (!codeSnippets || codeSnippets.length === 0) {
      return typingText.split('\n').map((line, i) => (
        <p key={i} className={cn(
          line.trim() === '' ? 'my-2' : undefined, 
          "leading-relaxed"
        )}>
          {line}
          {!animationComplete && i === typingText.split('\n').length - 1 && (
            <span className="ml-1 animate-pulse">▌</span>
          )}
        </p>
      ));
    }
    
    // Split content by code snippet placeholders
    const parts = typingText.split(/\[CODE_SNIPPET_(\d+)\]/);
    
    return parts.map((part, index) => {
      // Even indices are text, odd indices are code snippet references
      if (index % 2 === 0) {
        return part.split('\n').map((line, i) => (
          <p key={`${index}-${i}`} className={cn(
            line.trim() === '' ? 'my-2' : undefined, 
            "leading-relaxed"
          )}>
            {line}
            {!animationComplete && index === parts.length - 1 && i === part.split('\n').length - 1 && (
              <span className="ml-1 animate-pulse">▌</span>
            )}
          </p>
        ));
      } else {
        // This is a code snippet reference
        const snippetIndex = parseInt(part, 10);
        if (snippetIndex >= 0 && snippetIndex < codeSnippets.length) {
          const snippet = codeSnippets[snippetIndex];
          return (
            <CodeSnippet 
              key={`snippet-${snippetIndex}`} 
              code={snippet.code} 
              language={snippet.language} 
              title={snippet.title} 
            />
          );
        }
        return null;
      }
    });
  };
  
  return (
    <div
      className={cn(
        "transition-all",
        isLatest && "animate-slide-up",
        animate && !isUser && "animate-fade-in",
        isUser ? "bg-purple-800/10" : "bg-transparent",
        !animationComplete && "opacity-80"
      )}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex gap-4">
        <div className={cn(
          "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1",
          isUser 
            ? "bg-purple-700/40 border border-purple-500/30" 
            : "bg-purple-600/30 border border-purple-500/30"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-purple-200" />
          ) : (
            <Bot className="h-4 w-4 text-purple-200" />
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <span className={cn(
              "font-medium text-sm",
              isUser ? "text-purple-200" : "text-purple-100"
            )}>
              {isUser ? 'You' : 'Vyoma AI'}
            </span>
            <span className="text-xs text-purple-400/60 ml-2">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {hasImage && (
            <div className="mt-2 mb-3 max-w-xs">
              <div className="relative group">
                <img 
                  src={imageUrl} 
                  alt="User uploaded image" 
                  className="rounded-md border border-purple-500/30 max-h-48 object-contain hover:opacity-95 transition-opacity cursor-pointer animate-scale-in"
                  onClick={() => window.open(imageUrl, '_blank')}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 bg-purple-950/70 rounded-full hover:bg-purple-900/80 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-purple-200" />
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser 
              ? "text-purple-100" 
              : "text-purple-50"
          )}>
            {isUser ? (
              content.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  line.trim() === '' ? 'my-2' : undefined, 
                  "leading-relaxed"
                )}>
                  {line}
                </p>
              ))
            ) : (
              renderContentWithCodeSnippets()
            )}
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
