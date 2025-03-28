
import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Code, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface CodeGeneratorProps {
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx';
  title?: string;
}

export function CodeGenerator({ code, language, title }: CodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const codeRef = useRef<HTMLPreElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (activeTab === "preview") {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [activeTab]);

  const handleCopy = async () => {
    try {
      // Get the text directly from the code ref or use the code prop
      const textToCopy = code;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Code copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error('Failed to copy:', err);
    }
  };

  const togglePreview = () => {
    setActiveTab(activeTab === "code" ? "preview" : "code");
  };

  const canPreview = language === 'html';

  return (
    <div className="w-full bg-background/50 backdrop-blur-md rounded-lg overflow-hidden border border-purple-500/30 shadow-lg transition-all duration-300 animate-scale-in">
      <div className="flex items-center justify-between bg-purple-900/60 px-4 py-2 border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-purple-300" />
          <span className="text-sm font-medium text-purple-100">
            {title || `${language.toUpperCase()} Code`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {canPreview && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
              onClick={togglePreview}
              aria-label={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {canPreview ? (
        <Tabs 
          defaultValue="code" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full bg-purple-900/40 border-b border-purple-500/20">
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-purple-800/40"
            >
              Code
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-purple-800/40"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="p-0 m-0">
            <pre 
              ref={codeRef} 
              className="bg-purple-950/60 p-4 overflow-x-auto text-sm text-purple-100"
            >
              <code>{code}</code>
            </pre>
          </TabsContent>
          <TabsContent value="preview" className="p-0 m-0">
            <div className={`bg-white p-4 h-full ${isMobile ? 'min-h-[200px]' : 'min-h-[250px]'} w-full overflow-auto`}>
              <div className={isMobile ? "mobile-preview-container" : ""}>
                <iframe 
                  srcDoc={code}
                  title="HTML Preview"
                  className={`w-full h-full ${isMobile ? 'min-h-[300px] mobile-preview-frame' : 'min-h-[250px]'} border-0 transform transition-transform duration-300 animate-fade-in`}
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <pre 
          ref={codeRef} 
          className="bg-purple-950/60 p-4 overflow-x-auto text-sm text-purple-100"
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
