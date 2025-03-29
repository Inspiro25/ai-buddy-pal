
import { useState } from 'react';
import { PanelLeft, Sparkles, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGeminiChat } from '@/hooks/use-gemini-chat';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { chatHistory = [], loadChat = () => {}, deleteChat = () => {}, currentChatId = '' } = useGeminiChat() || {};

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-gemini-teal-dark/90 backdrop-blur-lg border-r border-gemini-teal/20 transition-all duration-300",
      open ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gemini-teal-light">Chat History</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <PanelLeft className="h-5 w-5 text-gemini-teal-light" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {chatHistory && chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center justify-between group p-2 rounded-lg hover:bg-gemini-teal/20 transition-all",
                chat.id === currentChatId ? 'bg-gemini-teal/20' : ''
              )}
            >
              <button
                className="flex-1 flex items-center gap-2 text-left"
                onClick={() => loadChat(chat.id)}
              >
                <MessageSquare className="h-4 w-4 text-gemini-teal-light/70" />
                <span className="truncate text-sm">{chat.title || 'New Chat'}</span>
              </button>
              
              <button
                className="h-6 w-6 text-gemini-teal-light/70 hover:text-gemini-teal-light rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <Button className="mt-4 bg-gemini-teal hover:bg-gemini-teal-dark text-white" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </aside>
  );
}
