
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';

const Index = () => {
  return (
    <DatabaseProvider>
      <AssetProvider>
        <Layout>
          <Dashboard />
        </Layout>
      </AssetProvider>
    </DatabaseProvider>
  );
};

export default Index;
