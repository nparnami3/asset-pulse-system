
import Layout from '@/components/Layout';
import AssetView from '@/components/AssetView';
import { AssetProvider } from '@/context/AssetContext';

const AssetViewPage = () => {
  return (
    <AssetProvider>
      <Layout>
        <AssetView />
      </Layout>
    </AssetProvider>
  );
};

export default AssetViewPage;
