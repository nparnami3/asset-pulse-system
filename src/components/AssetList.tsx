
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAssets } from '@/context/AssetContext';
import { assetDropdownOptions } from '@/utils/assetIdGenerator';
import { exportAssetsToExcel } from '@/utils/excelHandler';
import { Monitor, Laptop, Server, Printer, Smartphone, Edit, Trash2, Eye, FileSpreadsheet, Loader2 } from 'lucide-react';

const AssetList = () => {
  const { filteredAssets, setFilter, filter, loading, deleteAsset } = useAssets();
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (assetToDelete) {
      deleteAsset(assetToDelete);
      setAssetToDelete(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleExport = () => {
    exportAssetsToExcel(filteredAssets);
  };

  // Function to get icon for asset type
  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'Desktop':
        return <Monitor className="h-4 w-4" />;
      case 'Laptop':
        return <Laptop className="h-4 w-4" />;
      case 'Server':
        return <Server className="h-4 w-4" />;
      case 'Printer':
        return <Printer className="h-4 w-4" />;
      case 'Phone':
      case 'Tablet':
        return <Smartphone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Assets</h2>
          <p className="text-muted-foreground">Manage your IT assets</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/assets/add">Add New Asset</Link>
          </Button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          placeholder="Search assets..."
          value={filter.search || ''}
          onChange={handleSearchChange}
          className="md:col-span-2"
        />
        
        <Select
          value={filter.location || ''}
          onValueChange={(value) => setFilter({ ...filter, location: value === 'All' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Locations</SelectItem>
            {assetDropdownOptions.locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filter.status || ''}
          onValueChange={(value) => setFilter({ ...filter, status: value === 'All' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {assetDropdownOptions.statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filter.asset_type || ''}
          onValueChange={(value) => setFilter({ ...filter, asset_type: value === 'All' ? '' : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {assetDropdownOptions.assetTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Asset table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-lg text-muted-foreground">Loading assets...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Type</TableHead>
                    <TableHead className="w-[150px]">Asset ID</TableHead>
                    <TableHead className="w-[150px]">Hostname</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No assets found. Try adjusting your filters or add a new asset.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssets.map((asset) => (
                      <TableRow key={asset.asset_id}>
                        <TableCell>
                          <div className="bg-secondary/10 w-8 h-8 rounded-full flex items-center justify-center">
                            {getAssetIcon(asset.asset_type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{asset.asset_id}</TableCell>
                        <TableCell>{asset.hostname}</TableCell>
                        <TableCell>{asset.used_by || '-'}</TableCell>
                        <TableCell>{asset.location}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded text-xs font-medium inline-block
                            ${asset.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                            ${asset.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : ''}
                            ${asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${asset.status === 'Decommissioned' ? 'bg-red-100 text-red-700' : ''}
                            ${asset.status === 'In Storage' ? 'bg-blue-100 text-blue-700' : ''}
                            ${asset.status === 'Lost/Stolen' ? 'bg-red-100 text-red-700' : ''}
                          `}>
                            {asset.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/assets/view/${asset.asset_id}`} className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/assets/edit/${asset.asset_id}`} className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => setAssetToDelete(asset.asset_id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the asset {asset.asset_id} ({asset.hostname}).
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setAssetToDelete(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="bg-muted/20 px-4 py-2 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAssets.length} assets
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetList;
