import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import ChatInterface from './components/chat/ChatInterface';
import ModelHub from './components/modelhub/ModelHub';
import Settings from './components/settings/Settings';
import { mockModels, mockConversations, mockSettings, createNewConversation } from './data/mockData';
import { Conversation, Model, Page, Settings as SettingsType, Message } from './types';
import { getAiResponse, getChatTitle } from './services/geminiService';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(mockConversations[0]?.id || null);
  const [models, setModels] = useState<Model[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<Model>(mockModels.find(m => m.id === mockSettings.general.defaultModel) || mockModels[0]);
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const applyTheme = () => {
        if (settings.general.theme === 'dark' || (settings.general.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
      };
      
      applyTheme();

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
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
    setConversations(prevConvs => {
        const newConvs = prevConvs.filter(c => c.id !== conversationId);
        if (activeConversationId === conversationId) {
            setActiveConversationId(newConvs[0]?.id || null);
        }
        return newConvs;
    });
  }, [activeConversationId]);

  const updateConversation = (convId: string, updateFn: (conv: Conversation) => Conversation) => {
    setConversations(prev => prev.map(conv => conv.id === convId ? updateFn(conv) : conv));
  };
  
  const handleSendMessage = useCallback(async (messageContent: string) => {
    const convId = activeConversationId;
    if (!convId) return;

    const isFirstMessage = conversations.find(c => c.id === convId)?.messages.length === 0;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    updateConversation(convId, conv => ({
        ...conv,
        messages: [...(conv.messages || []), userMessage],
        lastActivity: new Date().toISOString(),
    }));

    if (isFirstMessage) {
      getChatTitle(messageContent).then(newTitle => {
        updateConversation(convId, conv => ({ ...conv, title: newTitle }));
      });
    }

    setIsLoading(true);
    try {
        const aiResponseContent = await getAiResponse(messageContent);
        const aiResponse: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant', 
            content: aiResponseContent,
            timestamp: new Date().toISOString(),
        };
        updateConversation(convId, conv => ({
            ...conv,
            messages: [...(conv.messages || []), aiResponse],
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
         updateConversation(convId, conv => ({
            ...conv,
            messages: [...(conv.messages || []), errorResponse],
        }));
    } finally {
        setIsLoading(false);
    }
  }, [activeConversationId, conversations]);

  const handleRegenerateResponse = useCallback(async (messageId: string) => {
    const convId = activeConversationId;
    if (!convId) return;

    let userMessageContent: string | null = null;
    
    setConversations(prev =>
        prev.map(conv => {
            if (conv.id === convId) {
                const messageIndex = conv.messages.findIndex(m => m.id === messageId);
                if (messageIndex > 0 && conv.messages[messageIndex - 1].role === 'user') {
                    userMessageContent = conv.messages[messageIndex - 1].content;
                    return { ...conv, messages: conv.messages.slice(0, messageIndex) };
                }
            }
            return conv;
        })
    );
    
    if (userMessageContent) {
        setIsLoading(true);
        try {
            const aiResponseContent = await getAiResponse(userMessageContent);
            const newResponse: Message = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: aiResponseContent,
                timestamp: new Date().toISOString(),
            };
            updateConversation(convId, conv => ({ ...conv, messages: [...conv.messages, newResponse] }));
        } catch (error) {
            console.error("Failed to regenerate AI response:", error);
        } finally {
            setIsLoading(false);
        }
    }
  }, [activeConversationId]);

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
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
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
    </div>
  );
}

export default App;
