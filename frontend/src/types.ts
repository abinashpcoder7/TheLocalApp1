
export type Page = 'chat' | 'models' | 'settings';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastActivity: string;
  messages: Message[];
}

export interface Model {
  id: string;
  name: string;
  description: string;
  // FIX: Updated model category type to allow 'cortex', resolving type errors.
  category: 'cortex' | 'local' | 'cloud';
  size: string;
  type: 'GGUF' | 'Cloud';
  rating: number;
  downloads: string;
  recommended: boolean;
  isInstalled: boolean;
  isDownloading?: boolean;
  requiresApiKey?: boolean;
}

export type Settings = {
  general: {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'es' | 'fr' | 'de' | 'zh';
    defaultModel: string;
  };
  privacy: {
    localMode: boolean;
    telemetry: boolean;
    crashReporting: boolean;
  };
  models: {
    autoDownloadUpdates: boolean;
    downloadPath: string;
    maxConcurrentDownloads: number;
  };
  apiKeys: {
    openai: string;
    anthropic: string;
    google: string;
    groq: string;
  };
  advanced: {
    serverPort: number;
    enableApi: boolean;
    maxTokens: number;
    temperature: number;
  };
};

export interface Toast {
  id: string;
  title: string;
  description: string;
}
