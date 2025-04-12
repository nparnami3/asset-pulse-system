
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';
import { useEffect } from 'react';
import { useApi } from '@/context/ApiContext';

// Inner component to access hooks
const DashboardWithApi = () => {
  const { testConnection } = useApi();
  
  // Test API connection when dashboard loads
  useEffect(() => {
    const checkApiConnection = async () => {
      await testConnection();
    };
    checkApiConnection();
  }, [testConnection]);

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
