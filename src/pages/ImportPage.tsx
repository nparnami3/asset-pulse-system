
import Layout from '@/components/Layout';
import ImportData from '@/components/ImportData';
import { AssetProvider } from '@/context/AssetContext';
import { DatabaseProvider } from '@/context/DatabaseContext';

const ImportPage = () => {
  return (
    <DatabaseProvider>
      <AssetProvider>
        <Layout>
          <ImportData />
        </Layout>
      </AssetProvider>
    </DatabaseProvider>
  );
};

export default ImportPage;
