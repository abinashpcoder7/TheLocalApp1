
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children, className }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || '');

  const activeTab = value !== undefined ? value : internalActiveTab;
  
  const setActiveTab = (newValue: string) => {
    onValueChange?.(newValue);
    if (value === undefined) { // Uncontrolled component
      setInternalActiveTab(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}>
    {children}
  </div>
);

const TabsTrigger: React.FC<{ value: string; children: ReactNode; className?: string }> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) return null;

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-950 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50 ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<{ value: string; children: ReactNode; className?: string }> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context || context.activeTab !== value) return null;

  return <div className={`mt-2 ${className}`}>{children}</div>;
};


export { Tabs, TabsList, TabsTrigger, TabsContent };
