
import Layout from '@/components/Layout';
import ImportData from '@/components/ImportData';
import { AssetProvider } from '@/context/AssetContext';

const ImportPage = () => {
  return (
    <AssetProvider>
      <Layout>
        <ImportData />
      </Layout>
    </AssetProvider>
  );
};

export default ImportPage;
