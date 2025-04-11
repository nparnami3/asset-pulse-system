
import Layout from '@/components/Layout';
import ImportData from '@/components/ImportData';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ApiProvider } from '@/context/ApiContext';

const ImportPage = () => {
  return (
    <ApiProvider>
      <DatabaseProvider>
        <AssetProvider>
          <Layout>
            <ImportData />
          </Layout>
        </AssetProvider>
      </DatabaseProvider>
    </ApiProvider>
  );
};

export default ImportPage;
