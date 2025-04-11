
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
import { Asset } from '@/context/AssetContext';

interface DashboardChartsProps {
  assets: Asset[];
}

const colorPalette = ['#1a365d', '#7e69ab', '#38b2ac', '#fc8181', '#f6ad55', '#f6e05e', '#68d391'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ assets }) => {
  // Asset type data for pie chart
  const assetTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const type = asset.asset_type || 'Unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  // Asset status data for pie chart
  const assetStatusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const status = asset.status || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  // Asset location data for bar chart
  const assetLocationData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach(asset => {
      const location = asset.location || 'Unknown';
      counts[location] = (counts[location] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);
  
  return (
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
  );
};

export default DashboardCharts;
