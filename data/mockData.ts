
import { Model, Conversation, Settings } from '../types';

export const mockModels: Model[] = [
  // Jan Models
  {
    id: 'jan-v1',
    name: 'Jan-v1',
    description: '4B reasoning model specialized in web search and tool integration. Optimized for local deployment.',
    category: 'jan',
    size: '2.3GB',
    type: 'GGUF',
    rating: 4.8,
    downloads: '125K',
    recommended: true,
    isInstalled: true,
  },
  {
    id: 'jan-nano-32k',
    name: 'Jan-Nano (32k)',
    description: 'Compact 4B model for web search with extended context window and MCP tool support.',
    category: 'jan', 
    size: '2.1GB',
    type: 'GGUF',
    rating: 4.6,
    downloads: '89K',
    recommended: false,
    isInstalled: false,
  },
  {
    id: 'lucy',
    name: 'Lucy',
    description: '1.7B mobile-optimized model for web search. Perfect for resource-constrained environments.',
    category: 'jan',
    size: '980MB', 
    type: 'GGUF',
    rating: 4.4,
    downloads: '67K',
    recommended: false,
    isInstalled: false,
  },

  // Local Models
  {
    id: 'llama-3-8b',
    name: 'Llama 3 8B',
    description: 'Meta\'s latest open-source language model with excellent reasoning capabilities.',
    category: 'local',
    size: '4.7GB',
    type: 'GGUF',
    rating: 4.9,
    downloads: '2.1M',
    recommended: true,
    isInstalled: true,
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    description: 'Fast and efficient model with strong performance on coding and reasoning tasks.',
    category: 'local',
    size: '4.1GB',
    type: 'GGUF', 
    rating: 4.7,
    downloads: '1.8M',
    recommended: true,
    isInstalled: false,
  },
  {
    id: 'qwen-14b',
    name: 'Qwen 14B',
    description: 'Large multilingual model with excellent performance across various tasks.',
    category: 'local',
    size: '8.2GB',
    type: 'GGUF',
    rating: 4.8,
    downloads: '890K',
    recommended: false,
    isInstalled: false,
  },
  {
    id: 'gemma-7b', 
    name: 'Gemma 7B',
    description: 'Google\'s open-source model with strong safety features and performance.',
    category: 'local',
    size: '4.9GB',
    type: 'GGUF',
    rating: 4.6,
    downloads: '1.2M',
    recommended: false,
    isInstalled: false,
  },

  // Cloud Models
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    description: 'OpenAI\'s most capable model for complex reasoning and creative tasks.',
    category: 'cloud',
    size: 'API',
    type: 'Cloud',
    rating: 4.9,
    downloads: 'N/A',
    recommended: true,
    isInstalled: false,
    requiresApiKey: true,
  },
  {
    id: 'anthropic-claude',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s latest model with strong reasoning and code generation capabilities.',
    category: 'cloud',
    size: 'API', 
    type: 'Cloud',
    rating: 4.8,
    downloads: 'N/A',
    recommended: true,
    isInstalled: false,
    requiresApiKey: true,
  },
  {
    id: 'google-gemini',
    name: 'Gemini Pro',
    description: 'Google\'s multimodal AI model with text, image, and code understanding.',
    category: 'cloud',
    size: 'API',
    type: 'Cloud', 
    rating: 4.7,
    downloads: 'N/A',
    recommended: false,
    isInstalled: false,
    requiresApiKey: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Getting Started with Jan',
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What can Jan do?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2', 
        role: 'assistant',
        content: 'Jan is your private AI assistant that runs 100% offline on your device. Here\'s what I can help you with:\n\n• **Local AI Models**: I can run powerful language models directly on your computer without internet\n• **Privacy First**: All conversations stay on your device - no data is sent to external servers\n• **Model Flexibility**: Choose from local models like Llama, Mistral, or connect to cloud providers\n• **Tool Integration**: Connect to external tools through MCP (Model Context Protocol)\n• **Code & Writing**: Help with programming, creative writing, analysis, and more\n\nWould you like to know more about any specific feature?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 4 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Python Code Review',
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [],
  },
];

export const mockSettings: Settings = {
  general: {
    theme: 'light',
    language: 'en',
    defaultModel: 'jan-v1',
  },
  privacy: {
    localMode: true,
    telemetry: false,
    crashReporting: false,
  },
  models: {
    autoDownloadUpdates: false,
    downloadPath: '/Users/username/Jan/models',
    maxConcurrentDownloads: 2,
  },
  apiKeys: {
    openai: '',
    anthropic: '',
    google: '',
    groq: '',
  },
  advanced: {
    serverPort: 1337,
    enableApi: true,
    maxTokens: 4096,
    temperature: 0.7,
  },
};

export const createNewConversation = (): Conversation => ({
  id: `conv-${Date.now()}`,
  title: 'New Chat',
  lastActivity: new Date().toISOString(),
  messages: [],
});
