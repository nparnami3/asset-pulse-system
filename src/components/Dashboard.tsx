
import React from 'react';
import { useAssets } from '@/context/AssetContext';
import DashboardMetricsCards from '@/components/dashboard/DashboardMetricsCards';
import DashboardStatusCards from '@/components/dashboard/DashboardStatusCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { assets, loading } = useAssets();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {loading ? (
        // Loading skeletons
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full lg:col-span-2" />
          </div>
        </div>
      ) : (
        // Dashboard content
        <>
          <DashboardMetricsCards assets={assets} />
          <DashboardStatusCards assets={assets} />
          <DashboardCharts assets={assets} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
