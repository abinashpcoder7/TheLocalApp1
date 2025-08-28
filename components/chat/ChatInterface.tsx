
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ScrollArea } from '../ui/ScrollArea';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { 
  Send, 
  Flame, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  Zap,
  Bot
} from 'lucide-react';
import { Message, Model } from '../../types';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    currentModel: Model;
    onRegenerateResponse: (messageId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  currentModel,
  onRegenerateResponse 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const isCloudModel = currentModel.category === 'cloud';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Cortex</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              <Bot className="h-3 w-3 mr-1" />
              {currentModel.name}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isCloudModel ? 'secondary' : 'default'}
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              {isCloudModel ? 'Cloud' : 'Local'}
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          {messages.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                  <Flame className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Cortex</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Your private AI assistant that runs 100% offline. Start a conversation below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {["Help me write a technical blog post", "Explain quantum computing simply", "Review my code for improvements", "Generate creative writing ideas"].map((prompt) => (
                  <Button key={prompt} variant="outline" className="text-left h-auto p-4 justify-start" onClick={() => setInputMessage(prompt)}>
                    <span className="text-sm">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex gap-4 items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-sm"><Flame className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex-grow max-w-3xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <Card className={`p-4 ${message.role === 'user' ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/50' : 'bg-gray-50 dark:bg-gray-900'}`}>
                    <div className="prose dark:prose-invert max-w-none text-sm text-gray-900 dark:text-gray-100">{formatMessage(message.content)}</div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 -mb-2 -mx-2">
                        <Button size="sm" variant="ghost" className="text-gray-500" onClick={() => copyToClipboard(message.content)}><Copy className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="text-gray-500"><ThumbsUp className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="text-gray-500"><ThumbsDown className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="text-gray-500" onClick={() => onRegenerateResponse(message.id)}><RotateCcw className="h-3 w-3" /></Button>
                      </div>
                    )}
                  </Card>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-blue-500 text-white"><User className="h-4 w-4" /></AvatarFallback></Avatar>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4 items-start">
              <Avatar className="h-8 w-8 border"><AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white"><Flame className="h-4 w-4" /></AvatarFallback></Avatar>
              <Card className="p-4 bg-gray-50 dark:bg-gray-900 flex-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cortex is thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Cortex..."
              className="pr-12 py-3 h-12 text-base"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0" onClick={handleSend} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Cortex can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;