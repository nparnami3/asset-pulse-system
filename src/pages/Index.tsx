
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';
import { useEffect } from 'react';
import { useApi } from '@/context/ApiContext';
import { useAssets } from '@/context/AssetContext';

// Inner component to access hooks
const DashboardWithApi = () => {
  const { testConnection, isConnected } = useApi();
  const { refreshAssets } = useAssets();
  
  // Test API connection when dashboard loads
  useEffect(() => {
    const checkApiConnection = async () => {
      const connected = await testConnection();
      
      // If connected to API, refresh assets data
      if (connected) {
        console.log("API connection successful, refreshing assets data");
        await refreshAssets();
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
