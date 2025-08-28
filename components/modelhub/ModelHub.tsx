
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ScrollArea } from '../ui/ScrollArea';
import { 
  Download, Search, Star, HardDrive, Cloud, Flame, CheckCircle, Clock, FileText
} from 'lucide-react';
import { Model } from '../../types';

interface ModelHubProps {
  models: Model[];
  onDownloadModel: (modelId: string) => void;
  onSelectModel: (modelId: string) => void;
  selectedModel: Model;
}

const ModelHub: React.FC<ModelHubProps> = ({ models, onDownloadModel, onSelectModel, selectedModel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const localModels = filteredModels.filter(m => m.category === 'local');
  const cloudModels = filteredModels.filter(m => m.category === 'cloud');
  const cortexModels = filteredModels.filter(m => m.category === 'cortex');

  const ModelCard: React.FC<{ model: Model }> = ({ model }) => (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              model.category === 'cortex' ? 'bg-gradient-to-br from-orange-400 to-red-500' 
              : model.category === 'local' ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              {model.category === 'cortex' ? <Flame className="h-5 w-5 text-white" />
              : model.category === 'local' ? <HardDrive className="h-5 w-5 text-white" />
              : <Cloud className="h-5 w-5 text-white" />}
            </div>
            <div>
              <CardTitle className="text-base">{model.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{model.size}</Badge>
                {model.recommended && <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700">Recommended</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{model.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{model.description}</p>
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {model.downloads}</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {model.type}</span>
        </div>
        <div className="flex gap-2 mt-auto">
          {model.isInstalled ? (
            <Button className="flex-1" onClick={() => onSelectModel(model.id)} variant={selectedModel?.id === model.id ? "default" : "outline"}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {selectedModel?.id === model.id ? 'Active' : 'Use Model'}
            </Button>
          ) : model.isDownloading ? (
            <Button className="flex-1" disabled variant="secondary"><Clock className="h-4 w-4 mr-2 animate-spin" /> Downloading...</Button>
          ) : (
            <Button className="flex-1" onClick={() => onDownloadModel(model.id)} variant="outline"><Download className="h-4 w-4 mr-2" /> Download</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = (title: string, description: string, modelList: Model[]) => (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelList.map((model) => <ModelCard key={model.id} model={model} />)}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Model Hub</h1>
        <p className="text-gray-600 dark:text-gray-400">Download and manage AI models for local use or connect to cloud providers</p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search models..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue="cortex" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cortex"><Flame className="h-4 w-4 mr-2" /> Cortex Models</TabsTrigger>
            <TabsTrigger value="local"><HardDrive className="h-4 w-4 mr-2" /> Local Models</TabsTrigger>
            <TabsTrigger value="cloud"><Cloud className="h-4 w-4 mr-2" /> Cloud Models</TabsTrigger>
          </TabsList>
          <div className="flex-grow mt-2 overflow-hidden">
            <TabsContent value="cortex">{renderTabContent("Cortex's Custom Models", "Optimized models built specifically for Cortex's local AI experience", cortexModels)}</TabsContent>
            <TabsContent value="local">{renderTabContent("Open Source Models", "Community models from HuggingFace that run locally on your device", localModels)}</TabsContent>
            <TabsContent value="cloud">{renderTabContent("Cloud Providers", "Connect your API keys to use cloud-based AI models", cloudModels)}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ModelHub;