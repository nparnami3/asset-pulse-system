
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getDatabaseConfig, 
  testDatabaseConnection, 
  checkDatabaseConnection, 
  DatabaseConfig,
  disconnectDatabase
} from '@/utils/databaseConnection';
import { toast } from 'sonner';

interface DatabaseContextType {
  isConnected: boolean;
  connectionConfig: DatabaseConfig | null;
  connect: (config: DatabaseConfig) => Promise<boolean>;
  disconnect: () => void;
  connecting: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionConfig, setConnectionConfig] = useState<DatabaseConfig | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  // Check for existing connection on component mount
  useEffect(() => {
    const connected = checkDatabaseConnection();
    if (connected) {
      const config = getDatabaseConfig();
      setConnectionConfig(config);
      setIsConnected(true);
    }
  }, []);

  const connect = async (config: DatabaseConfig): Promise<boolean> => {
    setConnecting(true);
    try {
      const success = await testDatabaseConnection(config);
      if (success) {
        setIsConnected(true);
        setConnectionConfig(config);
        toast.success("Successfully connected to MySQL database");
        return true;
      } else {
        toast.error("Failed to connect to database");
        return false;
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Error connecting to database");
      return false;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    disconnectDatabase();
    setIsConnected(false);
    setConnectionConfig(null);
    toast.success("Database disconnected");
  };

  return (
    <DatabaseContext.Provider 
      value={{ 
        isConnected, 
        connectionConfig,
        connect, 
        disconnect,
        connecting
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
