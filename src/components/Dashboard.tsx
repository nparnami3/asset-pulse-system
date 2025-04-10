
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Monitor, Laptop, Printer, HardDrive, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAssets } from '@/context/AssetContext';

const colorPalette = ['#1a365d', '#7e69ab', '#38b2ac', '#fc8181', '#f6ad55', '#f6e05e', '#68d391'];

const Dashboard = () => {
  const { assets, loading } = useAssets();

  const assetTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const type = asset.asset_type || 'Unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const assetStatusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const status = asset.status || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const assetLocationData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const location = asset.location || 'Unknown';
      counts[location] = (counts[location] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  // Get counts for various asset types
  const desktopCount = assets.filter(a => a.asset_type === 'Desktop').length;
  const laptopCount = assets.filter(a => a.asset_type === 'Laptop').length;
  const printerCount = assets.filter(a => a.asset_type === 'Printer').length;
  const serverCount = assets.filter(a => a.asset_type === 'Server').length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;
  const activeCount = assets.filter(a => a.status === 'Active').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Asset Overview Cards */}
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

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Types Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Asset Distribution by Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Asset Status Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Location Bar Chart */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Assets by Location</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetLocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Assets" fill="#1a365d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
