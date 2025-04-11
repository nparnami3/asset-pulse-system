
import React from 'react';
import { Card } from '@/components/ui/card';
import { Monitor, Laptop, Printer, HardDrive } from 'lucide-react';
import { Asset } from '@/context/AssetContext';

interface DashboardMetricsCardsProps {
  assets: Asset[];
}

const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({ assets }) => {
  // Get counts for various asset types
  const desktopCount = assets.filter(a => a.asset_type === 'Desktop').length;
  const laptopCount = assets.filter(a => a.asset_type === 'Laptop').length;
  const printerCount = assets.filter(a => a.asset_type === 'Printer').length;
  const serverCount = assets.filter(a => a.asset_type === 'Server').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Monitor className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Desktops</p>
          <p className="text-2xl font-bold">{desktopCount}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-secondary/10 p-3 rounded-full">
          <Laptop className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Laptops</p>
          <p className="text-2xl font-bold">{laptopCount}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-accent/10 p-3 rounded-full">
          <Printer className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Printers</p>
          <p className="text-2xl font-bold">{printerCount}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <HardDrive className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Servers</p>
          <p className="text-2xl font-bold">{serverCount}</p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardMetricsCards;
