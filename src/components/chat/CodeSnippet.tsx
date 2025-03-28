
import { CodeGenerator } from '../code/CodeGenerator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeSnippetProps {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx';
  title?: string;
}

export function CodeSnippet({ code, language, title }: CodeSnippetProps) {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error('Failed to copy code:', err);
    }
  };
  
  return (
    <div className={`my-3 w-full animate-scale-in relative ${isMobile ? 'max-w-[calc(100vw-80px)]' : ''}`}>
      <div className="max-w-full overflow-hidden rounded-md border border-purple-600/30 bg-purple-900/50">
        <div className="flex items-center justify-between bg-purple-900/80 px-4 py-1.5 text-xs text-purple-100 border-b border-purple-600/20">
          <div>{title || `${language.toUpperCase()} Code`}</div>
          <button 
            onClick={copyCode}
            className="flex items-center gap-1 hover:text-purple-300 transition-colors p-1 rounded"
            aria-label="Copy code"
          >
            <Copy size={14} className={cn(copied ? 'text-green-400' : '')} />
            <span className={cn("text-xs", isMobile ? "hidden" : "inline")}>
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
        <CodeGenerator 
          code={code} 
          language={language} 
          title={title} 
        />
      </div>
    </div>
  );
}
