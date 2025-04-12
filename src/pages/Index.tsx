
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/ApiContext';
import { useAssets } from '@/context/AssetContext';
import { toast } from 'sonner';

// Inner component to access hooks
const DashboardWithApi = () => {
  const { testConnection, isConnected } = useApi();
  const { refreshAssets } = useAssets();
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  
  // Test API connection when dashboard loads
  useEffect(() => {
    const checkApiConnection = async () => {
      setLoadingStatus('loading');
      try {
        const connected = await testConnection();
        
        // If connected to API, refresh assets data
        if (connected) {
          console.log("API connection successful, refreshing assets data");
          setLoadingStatus('connected');
          await refreshAssets();
        } else {
          console.error("API connection failed");
          setLoadingStatus('error');
          toast.error("Could not connect to API server. Please check your API configuration in Settings.");
        }
      } catch (error) {
        console.error("API connection check failed:", error);
        setLoadingStatus('error');
        toast.error(`API connection error: ${error.message || 'Unknown error'}`);
      }
    };
    
    checkApiConnection();
  }, [testConnection, refreshAssets]);

  return <Dashboard />;
};

const Index = () => {
  return (
    <ApiProvider>
      <DatabaseProvider>
        <AssetProvider>
          <Layout>
            <DashboardWithApi />
          </Layout>
        </AssetProvider>
      </DatabaseProvider>
    </ApiProvider>
  );
};

export default Index;
