
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Database, Link } from 'lucide-react';
import { Asset } from '@/context/AssetContext';
import { useApi } from '@/context/ApiContext';
import { Link as RouterLink } from 'react-router-dom';

interface DashboardStatusCardsProps {
  assets: Asset[];
}

const DashboardStatusCards: React.FC<DashboardStatusCardsProps> = ({ assets }) => {
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;
  const activeCount = assets.filter(a => a.status === 'Active').length;
  const { isConnected: apiConnected } = useApi();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Active Assets</p>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">In Maintenance</p>
          <p className="text-2xl font-bold">{maintenanceCount}</p>
        </div>
      </Card>
      
      <RouterLink to="/api-config">
        <Card className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className={`${apiConnected ? 'bg-green-100' : 'bg-gray-100'} p-3 rounded-full`}>
            <Link className={`h-6 w-6 ${apiConnected ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">API Connection</p>
            <p className="text-lg font-bold">{apiConnected ? 'Connected' : 'Not Connected'}</p>
          </div>
        </Card>
      </RouterLink>
    </div>
  );
};

export default DashboardStatusCards;
