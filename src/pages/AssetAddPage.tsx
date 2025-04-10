
import Layout from '@/components/Layout';
import AssetForm from '@/components/AssetForm';
import { AssetProvider } from '@/context/AssetContext';

const AssetAddPage = () => {
  return (
    <AssetProvider>
      <Layout>
        <AssetForm />
      </Layout>
    </AssetProvider>
  );
};

export default AssetAddPage;
