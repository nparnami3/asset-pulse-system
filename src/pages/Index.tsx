
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';

const Index = () => {
  return (
    <ApiProvider>
      <DatabaseProvider>
        <AssetProvider>
          <Layout>
            <Dashboard />
          </Layout>
        </AssetProvider>
      </DatabaseProvider>
    </ApiProvider>
  );
};

export default Index;
