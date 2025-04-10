
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAssets, Asset } from '@/context/AssetContext';
import { Edit, ArrowLeft, MonitorSmartphone, MapPin, User, Network, Cpu, Monitor, Calendar, Database } from 'lucide-react';

const AssetView = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { getAssetById } = useAssets();
  const [asset, setAsset] = useState<Asset | undefined>(undefined);

  useEffect(() => {
    if (assetId) {
      const fetchedAsset = getAssetById(assetId);
      if (fetchedAsset) {
        setAsset(fetchedAsset);
      } else {
        navigate("/assets");
      }
    }
  }, [assetId, getAssetById, navigate]);

  if (!asset) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading asset details...</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Basic Information",
      icon: <MonitorSmartphone className="h-5 w-5" />,
      items: [
        { label: "Asset ID", value: asset.asset_id },
        { label: "Hostname", value: asset.hostname },
        { label: "Asset Type", value: asset.asset_type },
        { label: "Serial Number", value: asset.serial_number },
        { label: "Status", value: asset.status },
      ],
    },
    {
      title: "Location",
      icon: <MapPin className="h-5 w-5" />,
      items: [
        { label: "Location", value: asset.location },
        { label: "Floor", value: asset.floor },
      ],
    },
    {
      title: "User Information",
      icon: <User className="h-5 w-5" />,
      items: [
        { label: "Current User", value: asset.used_by || "Not assigned" },
        { label: "Previous User", value: asset.last_used_by || "None" },
        { label: "Department Category", value: asset.category || "Not specified" },
        { label: "Email ID", value: asset.email_id || "None" },
        { label: "Issue Date", value: asset.date_of_issue || "Not recorded" },
      ],
    },
    {
      title: "Network",
      icon: <Network className="h-5 w-5" />,
      items: [
        { label: "IP Address", value: asset.ip_address || "Not assigned" },
        { label: "MAC Address", value: asset.lan_mac_address || "Not recorded" },
        { label: "IP Type", value: asset.ip_type || "Not specified" },
        { label: "Domain/Workgroup", value: asset.domain_workgroup || "Not specified" },
        { label: "Domain User", value: asset.domain_user || "Not specified" },
        { label: "Internet Enabled", value: asset.internet_enabled || "Not specified" },
      ],
    },
    {
      title: "Hardware",
      icon: <Cpu className="h-5 w-5" />,
      items: [
        { label: "Manufacturer", value: asset.company || "Not specified" },
        { label: "Model", value: asset.model_no || "Not specified" },
        { label: "Processor", value: asset.processor || "Not specified" },
        { label: "Generation", value: asset.generation || "Not specified" },
        { label: "RAM", value: asset.ram || "Not specified" },
        { label: "SSD Storage", value: asset.hdd_ssd || "Not specified" },
        { label: "NVME Storage", value: asset.hdd_nvme || "Not specified" },
        { label: "SATA Storage", value: asset.hdd_sata || "Not specified" },
        { label: "Graphics Card", value: asset.graphics_card || "Not specified" },
        { label: "Laptop Battery", value: asset.laptop_battery || "Not specified" },
      ],
    },
    {
      title: "Peripherals",
      icon: <Monitor className="h-5 w-5" />,
      items: [
        { label: "Monitor Type", value: asset.monitor_type || "Not specified" },
        { label: "Monitor Model", value: asset.monitor_model || "Not specified" },
        { label: "Monitor Serial", value: asset.monitor_serial || "Not specified" },
        { label: "Keyboard", value: asset.keyboard || "Not specified" },
        { label: "Mouse", value: asset.mouse || "Not specified" },
      ],
    },
    {
      title: "Software",
      icon: <Database className="h-5 w-5" />,
      items: [
        { label: "Windows Version", value: asset.windows_version || "Not specified" },
        { label: "Windows Key", value: asset.windows_key || "Not specified" },
        { label: "MS Office Version", value: asset.ms_office_version || "Not specified" },
        { label: "Antivirus", value: asset.antivirus || "Not specified" },
        { label: "Definitions Status", value: asset.definitions || "Not specified" },
      ],
    },
    {
      title: "History",
      icon: <Calendar className="h-5 w-5" />,
      items: [
        { label: "Created At", value: asset.created_at ? new Date(asset.created_at).toLocaleString() : "Unknown" },
        { label: "Last Updated", value: asset.updated_at ? new Date(asset.updated_at).toLocaleString() : "Unknown" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/assets")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{asset.hostname}</h1>
            <p className="text-muted-foreground">{asset.asset_id} · {asset.asset_type}</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate(`/assets/edit/${asset.asset_id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <Separator className="mb-4" />
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                    <dd className="mt-1 text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Status</h3>
            <div className={`px-3 py-2 rounded font-medium text-center mb-4
              ${asset.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
              ${asset.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : ''}
              ${asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${asset.status === 'Decommissioned' ? 'bg-red-100 text-red-700' : ''}
              ${asset.status === 'In Storage' ? 'bg-blue-100 text-blue-700' : ''}
              ${asset.status === 'Lost/Stolen' ? 'bg-red-100 text-red-700' : ''}
            `}>
              {asset.status}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Current User</p>
                <p className="text-base font-semibold">{asset.used_by || "Not assigned"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-base">{asset.category || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base">{asset.location} {asset.floor ? `(${asset.floor})` : ''}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hardware Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Manufacturer & Model</p>
                <p className="text-base">{asset.company} {asset.model_no}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Processor</p>
                <p className="text-base">{asset.processor} {asset.generation}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Memory</p>
                <p className="text-base">{asset.ram}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Storage</p>
                <p className="text-base">
                  {asset.hdd_ssd !== 'Not Applicable' ? `${asset.hdd_ssd} SSD` : ''}
                  {asset.hdd_nvme !== 'Not Applicable' ? (asset.hdd_ssd !== 'Not Applicable' ? `, ${asset.hdd_nvme} NVMe` : `${asset.hdd_nvme} NVMe`) : ''}
                  {asset.hdd_sata !== 'Not Applicable' ? (asset.hdd_ssd !== 'Not Applicable' || asset.hdd_nvme !== 'Not Applicable' ? `, ${asset.hdd_sata} SATA` : `${asset.hdd_sata} SATA`) : ''}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetView;
