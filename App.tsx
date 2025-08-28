
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import ChatInterface from './components/chat/ChatInterface';
import ModelHub from './components/modelhub/ModelHub';
import Settings from './components/settings/Settings';
import { Toaster } from './components/ui/Toast';
import { mockModels, mockConversations, mockSettings, createNewConversation } from './data/mockData';
import { Conversation, Model, Page, Settings as SettingsType, Message } from './types';
import { getAiResponse } from './services/geminiService';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(mockConversations[0]?.id || null);
  const [models, setModels] = useState<Model[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<Model>(mockModels.find(m => m.id === mockSettings.general.defaultModel) || mockModels[0]);
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      // Logic for theme changes
      if (settings.general.theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else if (settings.general.theme === 'light') {
          document.documentElement.classList.remove('dark');
      } else {
          // Auto theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
              document.documentElement.classList.add('dark');
          } else {
              document.documentElement.classList.remove('dark');
          }
      }
  }, [settings.general.theme]);


  const currentConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const handleNewChat = useCallback(() => {
    const newConv = createNewConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentPage('chat');
  }, []);

  const handleSelectChat = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setCurrentPage('chat');
  }, []);

  const handleDeleteChat = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remainingConvs = conversations.filter(c => c.id !== conversationId);
      setActiveConversationId(remainingConvs[0]?.id || null);
    }
  }, [activeConversationId, conversations]);

  const updateConversation = (convId: string, updateFn: (conv: Conversation) => Conversation) => {
    setConversations(prev => prev.map(conv => conv.id === convId ? updateFn(conv) : conv));
  };
  
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!activeConversationId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    updateConversation(activeConversationId, conv => ({
        ...conv,
        messages: [...conv.messages, userMessage],
        lastActivity: new Date().toISOString(),
        title: conv.messages.length === 0 ? messageContent.slice(0, 50) : conv.title
    }));

    setIsLoading(true);
    try {
        const aiResponseContent = await getAiResponse(messageContent);
        const aiResponse: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant', 
            content: aiResponseContent,
            timestamp: new Date().toISOString(),
        };
        updateConversation(activeConversationId, conv => ({
            ...conv,
            messages: [...conv.messages, aiResponse],
            lastActivity: new Date().toISOString()
        }));
    } catch (error) {
        console.error("Failed to get AI response:", error);
         const errorResponse: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date().toISOString(),
        };
         updateConversation(activeConversationId, conv => ({
            ...conv,
            messages: [...conv.messages, errorResponse],
        }));
    } finally {
        setIsLoading(false);
    }
  }, [activeConversationId]);

 const handleRegenerateResponse = useCallback(async (messageId: string) => {
    if (!activeConversationId) return;
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;
    
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0 || conversation.messages[messageIndex-1].role !== 'user') return;

    const userMessage = conversation.messages[messageIndex - 1];
    const messagesToKeep = conversation.messages.slice(0, messageIndex);

    updateConversation(activeConversationId, conv => ({ ...conv, messages: messagesToKeep }));

    setIsLoading(true);
    try {
        const aiResponseContent = await getAiResponse(userMessage.content);
        const newResponse: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: aiResponseContent,
          timestamp: new Date().toISOString(),
        };
        updateConversation(activeConversationId, conv => ({ ...conv, messages: [...messagesToKeep, newResponse] }));
    } catch (error) {
        console.error("Failed to regenerate AI response:", error);
    } finally {
        setIsLoading(false);
    }
 }, [activeConversationId, conversations]);

  const handleDownloadModel = useCallback((modelId: string) => {
    setModels(prev => prev.map(model => model.id === modelId ? { ...model, isDownloading: true } : model));
    setTimeout(() => {
      setModels(prev => prev.map(model => model.id === modelId ? { ...model, isDownloading: false, isInstalled: true } : model));
    }, 3000);
  }, []);

  const handleSelectModel = useCallback((modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) setSelectedModel(model);
  }, [models]);

  const renderContent = () => {
    switch (currentPage) {
      case 'models':
        return <ModelHub models={models} selectedModel={selectedModel} onDownloadModel={handleDownloadModel} onSelectModel={handleSelectModel} />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={setSettings} />;
      default:
        return <ChatInterface messages={currentConversation?.messages || []} onSendMessage={handleSendMessage} onRegenerateResponse={handleRegenerateResponse} isLoading={isLoading} currentModel={selectedModel} />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversationId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      <Toaster toasts={[]} removeToast={() => {}} />
    </div>
  );
}

export default App;
