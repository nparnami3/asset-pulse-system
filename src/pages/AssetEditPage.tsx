
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import AssetForm from '@/components/AssetForm';
import { AssetProvider } from '@/context/AssetContext';

const AssetEditPage = () => {
  const { assetId } = useParams<{ assetId: string }>();

  return (
    <AssetProvider>
      <Layout>
        <AssetForm editMode={true} assetId={assetId} />
      </Layout>
    </AssetProvider>
  );
};

export default AssetEditPage;
