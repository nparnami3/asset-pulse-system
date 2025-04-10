
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Asset {
  asset_id: string;
  hostname: string;
  location: string;
  floor: string;
  status: string;
  ip_address: string;
  lan_mac_address: string;
  used_by: string;
  last_used_by: string;
  ip_type: string;
  category: string;
  company: string;
  model_no: string;
  serial_number: string;
  processor: string;
  generation: string;
  ram: string;
  hdd_ssd: string;
  hdd_nvme: string;
  hdd_sata: string;
  monitor_type: string;
  monitor_model: string;
  monitor_serial: string;
  keyboard: string;
  mouse: string;
  graphics_card: string;
  laptop_battery: string;
  antivirus: string;
  definitions: string;
  domain_workgroup: string;
  domain_user: string;
  domain_password: string;
  local_user: string;
  local_password: string;
  windows_version: string;
  windows_key: string;
  ms_office_version: string;
  email_id: string;
  internet_enabled: string;
  asset_type: string;
  printer_model: string;
  printer_serial: string;
  date_of_issue: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssetFilter {
  location?: string;
  status?: string;
  category?: string;
  company?: string;
  asset_type?: string;
  search?: string;
}

interface AssetContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  importAssets: (assets: Asset[]) => void;
  getAssetById: (id: string) => Asset | undefined;
  updateAsset: (id: string, asset: Asset) => void;
  deleteAsset: (id: string) => void;
  filteredAssets: Asset[];
  setFilter: (filter: AssetFilter) => void;
  filter: AssetFilter;
  loading: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

// Sample asset data
const initialAssets: Asset[] = [
  {
    asset_id: "UBITASTPC001",
    hostname: "UB-DEV-001",
    location: "Headquarters",
    floor: "3rd Floor",
    status: "Active",
    ip_address: "192.168.1.101",
    lan_mac_address: "00:1A:2B:3C:4D:5E",
    used_by: "John Doe",
    last_used_by: "",
    ip_type: "Static",
    category: "Development",
    company: "Dell",
    model_no: "Optiplex 7090",
    serial_number: "DEL7090123456",
    processor: "Intel Core i7",
    generation: "11th Gen",
    ram: "16GB",
    hdd_ssd: "512GB",
    hdd_nvme: "Not Applicable",
    hdd_sata: "1TB",
    monitor_type: "LED",
    monitor_model: "Dell P2419H",
    monitor_serial: "CN123456",
    keyboard: "Dell KB216",
    mouse: "Dell MS116",
    graphics_card: "Intel UHD Graphics",
    laptop_battery: "Not Applicable",
    antivirus: "Windows Defender",
    definitions: "Updated",
    domain_workgroup: "UBDOMAIN",
    domain_user: "john.doe",
    domain_password: "********",
    local_user: "admin",
    local_password: "********",
    windows_version: "Windows 10 Pro",
    windows_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    ms_office_version: "Microsoft 365",
    email_id: "john.doe@example.com",
    internet_enabled: "Yes",
    asset_type: "Desktop",
    printer_model: "Not Applicable",
    printer_serial: "Not Applicable",
    date_of_issue: "2023-05-15",
    created_at: "2023-05-15T10:30:00Z",
    updated_at: "2023-05-15T10:30:00Z"
  },
  {
    asset_id: "UBITASTLP001",
    hostname: "UB-LAP-001",
    location: "Branch Office",
    floor: "2nd Floor",
    status: "Active",
    ip_address: "192.168.2.105",
    lan_mac_address: "00:2C:3D:4E:5F:6G",
    used_by: "Jane Smith",
    last_used_by: "Tom Wilson",
    ip_type: "DHCP",
    category: "Management",
    company: "Lenovo",
    model_no: "ThinkPad X1 Carbon",
    serial_number: "LNV23456789",
    processor: "Intel Core i5",
    generation: "10th Gen",
    ram: "8GB",
    hdd_ssd: "256GB",
    hdd_nvme: "256GB",
    hdd_sata: "Not Applicable",
    monitor_type: "LED",
    monitor_model: "Built-in",
    monitor_serial: "Built-in",
    keyboard: "Built-in",
    mouse: "Built-in Trackpad",
    graphics_card: "Intel Iris Xe",
    laptop_battery: "Good",
    antivirus: "McAfee",
    definitions: "Updated",
    domain_workgroup: "UBDOMAIN",
    domain_user: "jane.smith",
    domain_password: "********",
    local_user: "admin",
    local_password: "********",
    windows_version: "Windows 11 Pro",
    windows_key: "YYYYY-YYYYY-YYYYY-YYYYY-YYYYY",
    ms_office_version: "Office 2019",
    email_id: "jane.smith@example.com",
    internet_enabled: "Yes",
    asset_type: "Laptop",
    printer_model: "Not Applicable",
    printer_serial: "Not Applicable",
    date_of_issue: "2023-06-20",
    created_at: "2023-06-20T09:15:00Z",
    updated_at: "2023-06-20T09:15:00Z"
  },
  {
    asset_id: "UBITASTPR001",
    hostname: "UB-PRN-001",
    location: "Headquarters",
    floor: "1st Floor",
    status: "Maintenance",
    ip_address: "192.168.1.201",
    lan_mac_address: "00:3D:4E:5F:6G:7H",
    used_by: "IT Department",
    last_used_by: "",
    ip_type: "Static",
    category: "Printing",
    company: "HP",
    model_no: "LaserJet Pro MFP M428fdw",
    serial_number: "HPPRN789012",
    processor: "Not Applicable",
    generation: "Not Applicable",
    ram: "Not Applicable",
    hdd_ssd: "Not Applicable",
    hdd_nvme: "Not Applicable",
    hdd_sata: "Not Applicable",
    monitor_type: "Built-in LCD",
    monitor_model: "Built-in",
    monitor_serial: "Built-in",
    keyboard: "Not Applicable",
    mouse: "Not Applicable",
    graphics_card: "Not Applicable",
    laptop_battery: "Not Applicable",
    antivirus: "Not Applicable",
    definitions: "Not Applicable",
    domain_workgroup: "UBDOMAIN",
    domain_user: "Not Applicable",
    domain_password: "Not Applicable",
    local_user: "admin",
    local_password: "admin123",
    windows_version: "Not Applicable",
    windows_key: "Not Applicable",
    ms_office_version: "Not Applicable",
    email_id: "Not Applicable",
    internet_enabled: "Yes",
    asset_type: "Printer",
    printer_model: "HP LaserJet Pro MFP M428fdw",
    printer_serial: "HPPRN789012",
    date_of_issue: "2023-03-10",
    created_at: "2023-03-10T14:45:00Z",
    updated_at: "2023-03-10T14:45:00Z"
  }
];

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [filter, setFilter] = useState<AssetFilter>({});
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
  const [loading, setLoading] = useState(false);

  // Update filtered assets when assets or filter changes
  useEffect(() => {
    setLoading(true);
    const results = assets.filter(asset => {
      // Apply filters
      return Object.entries(filter).every(([key, value]) => {
        if (!value || value === "") return true;
        if (key === 'search') {
          const searchTerm = value.toLowerCase();
          return (
            asset.asset_id.toLowerCase().includes(searchTerm) ||
            asset.hostname.toLowerCase().includes(searchTerm) ||
            asset.used_by.toLowerCase().includes(searchTerm) ||
            asset.serial_number.toLowerCase().includes(searchTerm) ||
            asset.model_no.toLowerCase().includes(searchTerm)
          );
        }
        return asset[key as keyof Asset]?.toLowerCase() === value.toLowerCase();
      });
    });
    
    // Short timeout to simulate database query
    setTimeout(() => {
      setFilteredAssets(results);
      setLoading(false);
    }, 300);
  }, [assets, filter]);

  const addAsset = (asset: Asset) => {
    // Simulate a database insert
    setLoading(true);
    setTimeout(() => {
      setAssets(prev => [...prev, { 
        ...asset,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      setLoading(false);
      toast.success("Asset added successfully!");
    }, 500);
  };

  const importAssets = (newAssets: Asset[]) => {
    // Simulate bulk import
    setLoading(true);
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      const assetsWithTimestamp = newAssets.map(asset => ({
        ...asset,
        created_at: timestamp,
        updated_at: timestamp
      }));
      
      setAssets(prev => [...prev, ...assetsWithTimestamp]);
      setLoading(false);
      toast.success(`Successfully imported ${newAssets.length} assets`);
    }, 1000);
  };

  const getAssetById = (id: string) => {
    return assets.find(asset => asset.asset_id === id);
  };

  const updateAsset = (id: string, updatedAsset: Asset) => {
    setLoading(true);
    setTimeout(() => {
      setAssets(prev => prev.map(asset => 
        asset.asset_id === id 
          ? { ...updatedAsset, updated_at: new Date().toISOString() } 
          : asset
      ));
      setLoading(false);
      toast.success("Asset updated successfully!");
    }, 500);
  };

  const deleteAsset = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setAssets(prev => prev.filter(asset => asset.asset_id !== id));
      setLoading(false);
      toast.success("Asset deleted successfully!");
    }, 500);
  };

  return (
    <AssetContext.Provider 
      value={{ 
        assets, 
        addAsset, 
        importAssets,
        getAssetById,
        updateAsset,
        deleteAsset,
        filteredAssets,
        setFilter,
        filter,
        loading
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
