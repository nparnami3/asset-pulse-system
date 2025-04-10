
import Layout from '@/components/Layout';
import AssetList from '@/components/AssetList';
import { AssetProvider } from '@/context/AssetContext';

const AssetsPage = () => {
  return (
    <AssetProvider>
      <Layout>
        <AssetList />
      </Layout>
    </AssetProvider>
  );
};

export default AssetsPage;
