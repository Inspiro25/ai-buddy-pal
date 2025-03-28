
import { useState } from 'react';
import { useGeminiChat } from '@/hooks/use-gemini-chat';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatHistory() {
  const { chatHistory, loadChat, deleteChat, currentChatId } = useGeminiChat();
  
  const handleChatSelect = (chatId: string) => {
    // Load the selected chat history
    loadChat(chatId);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2 className="text-lg font-semibold text-purple-300 mb-2">Chat History</h2>
      
      {chatHistory.length === 0 ? (
        <p className="text-sm text-gray-400">No previous chats</p>
      ) : (
        <div className="flex flex-col gap-2">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                currentChatId === chat.id ? 'bg-purple-900/50 border border-purple-500/50' : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-purple-200 truncate">
                  {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-gray-400 truncate">{chat.lastMessage || 'No messages'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {chat.timestamp ? formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true }) : ''}
                  {' · '}{chat.messageCount || 0} messages
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="opacity-50 hover:opacity-100 hover:bg-red-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
