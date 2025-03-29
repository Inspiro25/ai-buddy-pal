
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  compact?: boolean;
}

export function CodeBlock({ code, language, title, compact = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden border border-gray-700 bg-gray-900/50">
      {title && (
        <div className={cn(
          "px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between",
          compact && "py-1.5"
        )}>
          <span className={cn("text-sm font-mono text-gray-400", compact && "text-xs")}>
            {title}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-7 w-7 rounded-full hover:bg-gray-700/50",
                compact && "h-6 w-6"
              )}
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      )}
      
      <pre className={cn(
        "p-4 overflow-x-auto",
        compact ? "text-xs p-3" : "text-sm",
        !title && "pt-8" // Add padding top if no title to make room for the copy button
      )}>
        <code>{code}</code>
      </pre>
      
      {!title && (
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute top-2 right-2 h-7 w-7 rounded-full hover:bg-gray-700/50",
            compact && "h-6 w-6"
          )}
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      )}
    </div>
  );
}
