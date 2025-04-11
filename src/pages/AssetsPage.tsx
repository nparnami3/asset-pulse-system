
import Layout from '@/components/Layout';
import AssetList from '@/components/AssetList';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';

const AssetsPage = () => {
  return (
    <DatabaseProvider>
      <AssetProvider>
        <Layout>
          <AssetList />
        </Layout>
      </AssetProvider>
    </DatabaseProvider>
  );
};

export default AssetsPage;
