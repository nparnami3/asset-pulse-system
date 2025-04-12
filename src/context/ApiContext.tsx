import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ApiConfig,
  getApiConfig,
  saveApiConfig,
  isApiConfigured,
  testApiConnection
} from '@/utils/api';

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

  useEffect(() => {
    const checkConnection = async () => {
      if (isApiConfigured()) {
        setConnecting(true);
        try {
          const connected = await testApiConnection();
          setIsConnected(connected);
          if (connected) {
            console.log("API connected successfully on load");
          } else {
            console.log("API connection failed on load");
          }
        } catch (error) {
          console.error("Error checking API connection:", error);
          setIsConnected(false);
        } finally {
          setConnecting(false);
        }
      }
    };
    
    checkConnection();
  }, []);

  const updateApiConfig = async (config: ApiConfig) => {
    setApiConfig(config);
    saveApiConfig(config);
    toast.success("API configuration updated");
    
    const connected = await testConnection();
    if (connected) {
      toast.success("Successfully connected to new API URL");
    }
  };

  const testConnection = async (): Promise<boolean> => {
    setConnecting(true);
    try {
      console.log("Testing connection to:", apiConfig.url);
      const connected = await testApiConnection();
      setIsConnected(connected);
      
      if (connected) {
        toast.success("Successfully connected to API server");
      } else {
        toast.error("Failed to connect to API server. Make sure the server is running at " + apiConfig.url);
      }
      
      return connected;
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error(`Connection error: ${error.message || 'Unknown error'}`);
      setIsConnected(false);
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
