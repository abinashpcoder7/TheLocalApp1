import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Switch } from '../ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectItem } from '../ui/Select';
import { Separator } from '../ui/Separator';
import { ScrollArea } from '../ui/ScrollArea';
import { 
  Settings as SettingsIcon, Shield, HardDrive, Cloud, Key, Cog, Palette, Download, Server, Eye, EyeOff, Save, RotateCcw
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Settings as SettingsType } from '../../types';
import { mockSettings } from '../../data/mockData';

interface SettingsProps {
  settings: SettingsType;
  onUpdateSettings: (settings: SettingsType) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleSettingChange = <T extends keyof SettingsType, K extends keyof SettingsType[T]>(category: T, key: K, value: SettingsType[T][K]) => {
    setLocalSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    toast({ title: "Settings saved", description: "Your preferences have been updated successfully." });
  };

  const handleResetSettings = () => {
    setLocalSettings(mockSettings); // Resets to original mock data
    toast({ title: "Settings reset", description: "All changes have been reverted to default." });
  };

  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><SettingsIcon className="h-6 w-6" />Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure Cortex to work exactly how you want</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
            <Button onClick={handleSaveSettings}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue="general" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2"><Palette className="h-4 w-4" />General</TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2"><Shield className="h-4 w-4" />Privacy</TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2"><HardDrive className="h-4 w-4" />Models</TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2"><Key className="h-4 w-4" />API Keys</TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2"><Cog className="h-4 w-4" />Advanced</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-grow mt-6 pr-4">
            <div className="space-y-6 pb-6">
                <TabsContent value="general" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Appearance</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="theme">Theme</Label>
                                <Select id="theme" value={localSettings.general.theme} onChange={(e) => handleSettingChange('general', 'theme', e.target.value as SettingsType['general']['theme'])}><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="auto">Auto (System)</SelectItem></Select>
                            </div>
                            <div><Label htmlFor="language">Language</Label>
                                <Select id="language" value={localSettings.general.language} onChange={(e) => handleSettingChange('general', 'language', e.target.value as SettingsType['general']['language'])}><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem><SelectItem value="zh">Chinese</SelectItem></Select>
                            </div>
                        </div>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="h-5 w-5" />Default Model</CardTitle></CardHeader>
                    <CardContent>
                        <Label htmlFor="defaultModel">Default Model</Label>
                        <Select id="defaultModel" value={localSettings.general.defaultModel} onChange={(e) => handleSettingChange('general', 'defaultModel', e.target.value)}>
                            <SelectItem value="cortex-v1">Cortex-v1</SelectItem><SelectItem value="llama-3-8b">Llama 3 8B</SelectItem><SelectItem value="mistral-7b">Mistral 7B</SelectItem><SelectItem value="openai-gpt4">GPT-4 (Cloud)</SelectItem>
                        </Select>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">The model that will be selected by default for new conversations</p>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="privacy" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Privacy & Data</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between"><div><Label htmlFor="localMode">Local Mode</Label><p className="text-sm text-gray-600 dark:text-gray-400">Keep all data on your device. No internet required after model download.</p></div><Switch id="localMode" checked={localSettings.privacy.localMode} onCheckedChange={(c) => handleSettingChange('privacy', 'localMode', c)}/></div><Separator />
                        <div className="flex items-center justify-between"><div><Label htmlFor="telemetry">Usage Analytics</Label><p className="text-sm text-gray-600 dark:text-gray-400">Send anonymous usage data to help improve Cortex</p></div><Switch id="telemetry" checked={localSettings.privacy.telemetry} onCheckedChange={(c) => handleSettingChange('privacy', 'telemetry', c)}/></div>
                        <div className="flex items-center justify-between"><div><Label htmlFor="crashReporting">Crash Reporting</Label><p className="text-sm text-gray-600 dark:text-gray-400">Automatically send crash reports to help fix bugs</p></div><Switch id="crashReporting" checked={localSettings.privacy.crashReporting} onCheckedChange={(c) => handleSettingChange('privacy', 'crashReporting', c)}/></div>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="models" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Model Downloads</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label htmlFor="downloadPath">Download Path</Label><div className="flex gap-2"><Input id="downloadPath" value={localSettings.models.downloadPath} onChange={(e) => handleSettingChange('models', 'downloadPath', e.target.value)}/><Button variant="outline">Browse</Button></div><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Where downloaded models will be stored</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="maxConcurrentDownloads">Max Concurrent Downloads</Label><Select id="maxConcurrentDownloads" value={String(localSettings.models.maxConcurrentDownloads)} onChange={(e) => handleSettingChange('models', 'maxConcurrentDownloads', parseInt(e.target.value, 10))}><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></Select></div>
                            <div className="flex items-center justify-between pt-4"><div><Label>Auto-update Models</Label><p className="text-xs text-gray-600 dark:text-gray-400">Download updates automatically</p></div><Switch checked={localSettings.models.autoDownloadUpdates} onCheckedChange={(c) => handleSettingChange('models', 'autoDownloadUpdates', c)}/></div>
                        </div>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="api" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5" />Cloud Providers</CardTitle></CardHeader>
                    <CardContent className="space-y-4">{Object.entries(localSettings.apiKeys).map(([provider, key]) => (<div key={provider}><Label htmlFor={provider} className="capitalize">{provider} API Key</Label><div className="flex gap-2"><Input id={provider} type={showApiKeys[provider] ? "text" : "password"} value={key} onChange={(e) => handleSettingChange('apiKeys', provider as keyof SettingsType['apiKeys'], e.target.value)} placeholder={`Enter your ${provider} API key`}/><Button variant="outline" size="sm" onClick={() => toggleApiKeyVisibility(provider)}>{showApiKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>))}</CardContent></Card>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" />Local API Server</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><div><Label htmlFor="enableApi">Enable Local API</Label><p className="text-sm text-gray-600 dark:text-gray-400">Allow other applications to connect to Cortex</p></div><Switch id="enableApi" checked={localSettings.advanced.enableApi} onCheckedChange={(c) => handleSettingChange('advanced', 'enableApi', c)}/></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="serverPort">Server Port</Label><Input id="serverPort" type="number" value={localSettings.advanced.serverPort} onChange={(e) => handleSettingChange('advanced', 'serverPort', parseInt(e.target.value, 10))}/></div>
                            <div><Label htmlFor="maxTokens">Max Tokens</Label><Input id="maxTokens" type="number" value={localSettings.advanced.maxTokens} onChange={(e) => handleSettingChange('advanced', 'maxTokens', parseInt(e.target.value, 10))}/></div>
                        </div>
                        <div><Label htmlFor="temperature">Temperature</Label><Input id="temperature" type="number" step="0.1" min="0" max="2" value={localSettings.advanced.temperature} onChange={(e) => handleSettingChange('advanced', 'temperature', parseFloat(e.target.value))}/></div>
                        {localSettings.advanced.enableApi && (<div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg"><h4 className="font-medium mb-2 text-gray-900 dark:text-white">API Endpoint</h4><code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">http://localhost:{localSettings.advanced.serverPort}</code></div>)}
                    </CardContent></Card>
                </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;