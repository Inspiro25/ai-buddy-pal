
import { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '../code/CodeBlock';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp?: Date;
    imageUrl?: string;
    codeSnippets?: Array<{
      code: string;
      language: string;
      title?: string;
    }>;
  };
  compact?: boolean;
}

export function ChatMessage({ message, compact = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to detect and render code blocks
  const renderContent = () => {
    if (message.role === 'user') {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }

    if (message.codeSnippets && message.codeSnippets.length > 0) {
      return message.codeSnippets.map((snippet, index) => (
        <CodeBlock 
          key={index}
          code={snippet.code}
          language={snippet.language}
          title={snippet.title}
          compact={compact}
        />
      ));
    }

    // Use ReactMarkdown for assistant messages to properly format headings and lists
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl md:text-2xl font-bold mt-4 mb-2 text-purple-300" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-bold mt-3 mb-2 text-purple-300" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-md md:text-lg font-bold mt-3 mb-1 text-purple-300" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-2 mb-1 text-purple-300" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          p: ({ node, ...props }) => <p className="my-2" {...props} />,
          a: ({ node, ...props }) => <a className="text-purple-400 hover:underline" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 my-2 italic bg-purple-900/20 py-1 rounded-r" {...props} />
          ),
          code: ({ children, ...props }) => {
            // Check if it's an inline code block
            if (!props.className) {
              return (
                <code className="bg-gray-800 px-1 py-0.5 rounded text-purple-300 font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return null; // CodeBlock component handles non-inline code
          },
          pre: ({ node, ...props }) => <pre className="my-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-purple-200" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-purple-100" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-4 border-gray-700" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700 rounded" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-700" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-gray-700" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-purple-300 font-medium" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  return (
    <div className={cn(
      "group flex gap-2 md:gap-4 rounded-xl",
      compact ? "p-2 md:p-4" : "p-4",
      message.role === 'assistant' 
        ? "bg-purple-900/20 border border-purple-500/20"
        : "bg-gray-800/50 border border-gray-700/50"
    )}>
      <div className="shrink-0 mt-1">
        {message.role === 'assistant' ? (
          <div className={cn(
            "rounded-full bg-purple-700/30 flex items-center justify-center",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}>
            <Bot className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-purple-300")} />
          </div>
        ) : (
          <div className={cn(
            "rounded-full bg-gray-700/30 flex items-center justify-center",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}>
            <User className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-gray-300")} />
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <div className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            {message.role === 'assistant' ? 'Vyoma AI' : 'You'}
          </div>
          
          {message.role === 'assistant' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                compact ? "h-5 w-5" : "h-6 w-6"
              )}
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}
        </div>
        
        <div className={cn(
          "prose prose-invert max-w-none",
          compact && "prose-sm md:prose-base"
        )}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
