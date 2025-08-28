
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { Badge } from '../ui/Badge';
import { Separator } from '../ui/Separator';
import { 
  MessageSquarePlus, 
  Flame, 
  Settings, 
  Download, 
  HardDrive, 
  Cloud,
  History,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Conversation, Page } from '../../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onNewChat: () => void;
  onSelectChat: (conversationId: string) => void;
  onDeleteChat: (conversationId: string) => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  conversations, 
  activeConversation, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat, 
  currentPage, 
  onPageChange 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: { icon: React.ElementType; label: string; action?: () => void; page?: Page }[] = [
    { icon: MessageSquarePlus, label: 'New Chat', action: onNewChat, page: 'chat' },
    { icon: Download, label: 'Model Hub', page: 'models' },
    { icon: Settings, label: 'Settings', page: 'settings' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  const sortedConversations = [...conversations].sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());


  return (
    <div className={`relative bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Flame className="h-6 w-6 text-orange-500" />
            {!isCollapsed && <span className="text-gray-900 dark:text-white">Cortex</span>}
          </div>
        </div>
      </div>

      <div className="p-2 flex-shrink-0">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={currentPage === item.page ? "secondary" : "ghost"}
            className={`w-full justify-start mb-1 ${isCollapsed ? 'px-2' : 'px-3'}`}
            onClick={() => {
              if (item.action) item.action();
              if (item.page) onPageChange(item.page);
            }}
          >
            <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && item.label}
          </Button>
        ))}
      </div>

      <Separator className="mx-2" />

      {!isCollapsed && (
        <div className="flex-1 p-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-2 flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Chats</h3>
            <History className="h-4 w-4 text-gray-500" />
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="space-y-1 pr-2">
              {sortedConversations.map((conv) => (
                <div key={conv.id} className="group relative">
                  <Button
                    variant={activeConversation === conv.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto p-2 group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                    onClick={() => onSelectChat(conv.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(conv.lastActivity)}
                      </div>
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(conv.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className={`p-3 border-t border-gray-200 dark:border-gray-800 mt-auto flex-shrink-0 ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-green-500" />
            {!isCollapsed && <span className="text-xs text-gray-600 dark:text-gray-400">Local Mode</span>}
          </div>
          {!isCollapsed && (
            <Badge variant="outline" className="text-xs">
              <Cloud className="h-3 w-3 mr-1" />
              API Ready
            </Badge>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 -right-3 h-6 w-6 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <MoreHorizontal className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default Sidebar;