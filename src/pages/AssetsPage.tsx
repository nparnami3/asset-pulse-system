
import Layout from '@/components/Layout';
import AssetList from '@/components/AssetList';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';

const AssetsPage = () => {
  return (
    <ApiProvider>
      <DatabaseProvider>
        <AssetProvider>
          <Layout>
            <AssetList />
          </Layout>
        </AssetProvider>
      </DatabaseProvider>
    </ApiProvider>
  );
};

export default AssetsPage;
