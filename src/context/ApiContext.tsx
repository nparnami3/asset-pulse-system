
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ApiConfig,
  getApiConfig,
  saveApiConfig,
  isApiConfigured,
  testApiConnection
} from '@/utils/apiConnection';

interface ApiContextType {
  isConnected: boolean;
  connecting: boolean;
  apiConfig: ApiConfig;
  updateApiConfig: (config: ApiConfig) => void;
  testConnection: () => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig());

  // Check for existing configuration on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isApiConfigured()) {
        setConnecting(true);
        const connected = await testApiConnection();
        setIsConnected(connected);
        setConnecting(false);
      }
    };
    
    checkConnection();
  }, []);

  const updateApiConfig = (config: ApiConfig) => {
    setApiConfig(config);
    saveApiConfig(config);
  };

  const testConnection = async (): Promise<boolean> => {
    setConnecting(true);
    try {
      const connected = await testApiConnection();
      setIsConnected(connected);
      
      if (connected) {
        toast.success("Successfully connected to API server");
      } else {
        toast.error("Failed to connect to API server");
      }
      
      return connected;
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Error connecting to API server");
      return false;
    } finally {
      setConnecting(false);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        isConnected,
        connecting,
        apiConfig,
        updateApiConfig,
        testConnection
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
