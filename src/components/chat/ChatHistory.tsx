
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeminiChat } from "@/hooks/use-gemini-chat";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// For demo purposes, we'll create some sample chat history
const generateChatHistory = () => {
  const dates = ['Today', 'Yesterday', 'Previous 7 days'];
  
  return dates.map(date => ({
    date,
    chats: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
      id: `${date}-${i}`,
      title: [
        "How to optimize React performance",
        "Explain quantum computing",
        "Writing effective CSS animations",
        "Modern JavaScript patterns",
        "AI ethics discussion"
      ][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7)
    }))
  }));
};

export function ChatHistory() {
  const { clearMessages } = useGeminiChat();
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, you would fetch this from an API or local storage
    setHistory(generateChatHistory());
  }, []);
  
  return (
    <ScrollArea className="flex-1 pt-0">
      <div className="p-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-purple-800/50 border-purple-600/20 hover:bg-purple-700/40 text-purple-100 mb-4"
          onClick={() => {
            clearMessages();
            toast.success("Chat cleared successfully");
          }}
        >
          <Trash2 size={16} />
          <span>Clear current chat</span>
        </Button>
        
        <div className="space-y-6">
          {history.map((section) => (
            <div key={section.date}>
              <h3 className="text-xs font-medium text-purple-400 mb-2 px-2">{section.date}</h3>
              <div className="space-y-1">
                {section.chats.map((chat: any) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left p-2 h-auto items-start hover:bg-purple-800/30 group"
                    onClick={() => toast.info("Chat history loading not implemented in this demo")}
                  >
                    <MessageCircle size={14} className="mr-2 mt-0.5 flex-shrink-0 text-purple-400 group-hover:text-purple-300" />
                    <div className="truncate">
                      <p className="text-sm text-purple-200 truncate">{chat.title}</p>
                      <p className="text-xs text-purple-400/60">
                        {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
