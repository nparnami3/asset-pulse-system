
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { AssetProvider } from '@/context/AssetContext';

const Index = () => {
  return (
    <AssetProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AssetProvider>
  );
};

export default Index;
