
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssets, Asset } from '@/context/AssetContext';
import { DeviceType, deviceTypes, getNextAssetId, assetDropdownOptions } from '@/utils/assetIdGenerator';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AssetFormProps {
  editMode?: boolean;
  assetId?: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ editMode = false, assetId }) => {
  const { assets, addAsset, updateAsset, getAssetById } = useAssets();
  const navigate = useNavigate();
  
  const initialAssetState: Asset = {
    asset_id: '',
    hostname: '',
    location: '',
    floor: '',
    status: 'Active',
    ip_address: '',
    lan_mac_address: '',
    used_by: '',
    last_used_by: '',
    ip_type: '',
    category: '',
    company: '',
    model_no: '',
    serial_number: '',
    processor: '',
    generation: '',
    ram: '',
    hdd_ssd: '',
    hdd_nvme: '',
    hdd_sata: '',
    monitor_type: '',
    monitor_model: '',
    monitor_serial: '',
    keyboard: '',
    mouse: '',
    graphics_card: '',
    laptop_battery: '',
    antivirus: '',
    definitions: '',
    domain_workgroup: '',
    domain_user: '',
    domain_password: '',
    local_user: '',
    local_password: '',
    windows_version: '',
    windows_key: '',
    ms_office_version: '',
    email_id: '',
    internet_enabled: '',
    asset_type: '',
    printer_model: '',
    printer_serial: '',
    date_of_issue: new Date().toISOString().split('T')[0]
  };

  const [asset, setAsset] = useState<Asset>(initialAssetState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load asset data if in edit mode
  useEffect(() => {
    if (editMode && assetId) {
      const existingAsset = getAssetById(assetId);
      if (existingAsset) {
        setAsset(existingAsset);
      } else {
        toast.error("Asset not found");
        navigate("/assets");
      }
    }
  }, [editMode, assetId, getAssetById, navigate]);

  // Generate asset ID when asset type changes (only in create mode)
  useEffect(() => {
    if (!editMode && asset.asset_type) {
      const deviceType = deviceTypes[asset.asset_type] as DeviceType;
      if (deviceType) {
        const newAssetId = getNextAssetId(
          assets.map(a => a.asset_id),
          deviceType
        );
        setAsset(prev => ({ ...prev, asset_id: newAssetId }));
      }
    }
  }, [asset.asset_type, assets, editMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: keyof Asset, value: string) => {
    setAsset(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!asset.hostname) newErrors.hostname = "Hostname is required";
    if (!asset.asset_type) newErrors.asset_type = "Asset type is required";
    if (!asset.serial_number) newErrors.serial_number = "Serial number is required";
    if (!asset.location) newErrors.location = "Location is required";
    if (!asset.status) newErrors.status = "Status is required";
    
    // Asset ID length check
    if (asset.asset_id && asset.asset_id.length > 15) {
      newErrors.asset_id = "Asset ID must not exceed 15 characters";
    }
    
    // Hostname length check
    if (asset.hostname && asset.hostname.length > 15) {
      newErrors.hostname = "Hostname must not exceed 15 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editMode && assetId) {
        updateAsset(assetId, asset);
      } else {
        addAsset(asset);
      }
      
      // Navigate back to asset list after successful submission
      setTimeout(() => {
        navigate("/assets");
      }, 1000);
    } catch (error) {
      console.error("Error submitting asset:", error);
      toast.error("Failed to save asset");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{editMode ? 'Edit Asset' : 'Add New Asset'}</h2>
        <p className="text-muted-foreground">
          {editMode ? 'Update the asset information below' : 'Fill in the details to register a new asset'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset ID</Label>
              <Input
                id="asset_id"
                name="asset_id"
                value={asset.asset_id}
                onChange={handleChange}
                disabled={true} // Auto-generated, so disabled
                className="bg-muted"
              />
              {errors.asset_id && <p className="text-sm text-destructive">{errors.asset_id}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname*</Label>
              <Input
                id="hostname"
                name="hostname"
                value={asset.hostname}
                onChange={handleChange}
                maxLength={15}
                required
              />
              {errors.hostname && <p className="text-sm text-destructive">{errors.hostname}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="asset_type">Asset Type*</Label>
              <Select
                value={asset.asset_type}
                onValueChange={(value) => handleSelectChange('asset_type', value)}
                disabled={editMode} // Can't change asset type in edit mode
              >
                <SelectTrigger id="asset_type" className={errors.asset_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.asset_type && <p className="text-sm text-destructive">{errors.asset_type}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number*</Label>
              <Input
                id="serial_number"
                name="serial_number"
                value={asset.serial_number}
                onChange={handleChange}
                required
              />
              {errors.serial_number && <p className="text-sm text-destructive">{errors.serial_number}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location*</Label>
              <Select
                value={asset.location}
                onValueChange={(value) => handleSelectChange('location', value)}
              >
                <SelectTrigger id="location" className={errors.location ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={asset.floor}
                onValueChange={(value) => handleSelectChange('floor', value)}
              >
                <SelectTrigger id="floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.floors.map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={asset.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status" className={errors.status ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>
          </div>
        </div>
        
        {/* Network Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Network Information</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip_address">IP Address</Label>
              <Input
                id="ip_address"
                name="ip_address"
                value={asset.ip_address}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lan_mac_address">MAC Address</Label>
              <Input
                id="lan_mac_address"
                name="lan_mac_address"
                value={asset.lan_mac_address}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ip_type">IP Type</Label>
              <Select
                value={asset.ip_type}
                onValueChange={(value) => handleSelectChange('ip_type', value)}
              >
                <SelectTrigger id="ip_type">
                  <SelectValue placeholder="Select IP type" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.ipTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain_workgroup">Domain/Workgroup</Label>
              <Input
                id="domain_workgroup"
                name="domain_workgroup"
                value={asset.domain_workgroup}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internet_enabled">Internet Access</Label>
              <Select
                value={asset.internet_enabled}
                onValueChange={(value) => handleSelectChange('internet_enabled', value)}
              >
                <SelectTrigger id="internet_enabled">
                  <SelectValue placeholder="Internet access?" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.internetEnabled.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Hardware Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hardware Specifications</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Manufacturer</Label>
              <Select
                value={asset.company}
                onValueChange={(value) => handleSelectChange('company', value)}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model_no">Model</Label>
              <Input
                id="model_no"
                name="model_no"
                value={asset.model_no}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="processor">Processor</Label>
              <Input
                id="processor"
                name="processor"
                value={asset.processor}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="generation">Generation</Label>
              <Select
                value={asset.generation}
                onValueChange={(value) => handleSelectChange('generation', value)}
              >
                <SelectTrigger id="generation">
                  <SelectValue placeholder="Select generation" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.generations.map((gen) => (
                    <SelectItem key={gen} value={gen}>
                      {gen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Select
                value={asset.ram}
                onValueChange={(value) => handleSelectChange('ram', value)}
              >
                <SelectTrigger id="ram">
                  <SelectValue placeholder="Select RAM" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.ramSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hdd_ssd">SSD Storage</Label>
              <Select
                value={asset.hdd_ssd}
                onValueChange={(value) => handleSelectChange('hdd_ssd', value)}
              >
                <SelectTrigger id="hdd_ssd">
                  <SelectValue placeholder="Select SSD size" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.storageSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hdd_nvme">NVME Storage</Label>
              <Select
                value={asset.hdd_nvme}
                onValueChange={(value) => handleSelectChange('hdd_nvme', value)}
              >
                <SelectTrigger id="hdd_nvme">
                  <SelectValue placeholder="Select NVME size" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.storageSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hdd_sata">SATA Storage</Label>
              <Select
                value={asset.hdd_sata}
                onValueChange={(value) => handleSelectChange('hdd_sata', value)}
              >
                <SelectTrigger id="hdd_sata">
                  <SelectValue placeholder="Select SATA size" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.storageSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Accessories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="keyboard">Keyboard</Label>
              <Select
                value={asset.keyboard}
                onValueChange={(value) => handleSelectChange('keyboard', value)}
              >
                <SelectTrigger id="keyboard">
                  <SelectValue placeholder="Select keyboard" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.keyboards.map((kb) => (
                    <SelectItem key={kb} value={kb}>
                      {kb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mouse">Mouse</Label>
              <Select
                value={asset.mouse}
                onValueChange={(value) => handleSelectChange('mouse', value)}
              >
                <SelectTrigger id="mouse">
                  <SelectValue placeholder="Select mouse" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.mice.map((mouse) => (
                    <SelectItem key={mouse} value={mouse}>
                      {mouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="laptop_battery">Laptop Battery</Label>
              <Select
                value={asset.laptop_battery}
                onValueChange={(value) => handleSelectChange('laptop_battery', value)}
              >
                <SelectTrigger id="laptop_battery">
                  <SelectValue placeholder="Select battery status" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.laptopBatteries.map((battery) => (
                    <SelectItem key={battery} value={battery}>
                      {battery}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Software Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Software Information</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windows_version">Windows Version</Label>
              <Select
                value={asset.windows_version}
                onValueChange={(value) => handleSelectChange('windows_version', value)}
              >
                <SelectTrigger id="windows_version">
                  <SelectValue placeholder="Select Windows version" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.windowsVersions.map((win) => (
                    <SelectItem key={win} value={win}>
                      {win}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ms_office_version">Office Version</Label>
              <Select
                value={asset.ms_office_version}
                onValueChange={(value) => handleSelectChange('ms_office_version', value)}
              >
                <SelectTrigger id="ms_office_version">
                  <SelectValue placeholder="Select Office version" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.officeVersions.map((office) => (
                    <SelectItem key={office} value={office}>
                      {office}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="antivirus">Antivirus</Label>
              <Select
                value={asset.antivirus}
                onValueChange={(value) => handleSelectChange('antivirus', value)}
              >
                <SelectTrigger id="antivirus">
                  <SelectValue placeholder="Select antivirus" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.antivirusSoftware.map((av) => (
                    <SelectItem key={av} value={av}>
                      {av}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="definitions">Definitions Status</Label>
              <Select
                value={asset.definitions}
                onValueChange={(value) => handleSelectChange('definitions', value)}
              >
                <SelectTrigger id="definitions">
                  <SelectValue placeholder="Select definitions status" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.definitions.map((def) => (
                    <SelectItem key={def} value={def}>
                      {def}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="windows_key">Windows Key</Label>
              <Input
                id="windows_key"
                name="windows_key"
                value={asset.windows_key}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email_id">Email ID</Label>
              <Input
                id="email_id"
                name="email_id"
                value={asset.email_id}
                onChange={handleChange}
                type="email"
              />
            </div>
          </div>
        </div>
        
        {/* User Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">User Information</h3>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="used_by">Current User</Label>
              <Input
                id="used_by"
                name="used_by"
                value={asset.used_by}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_used_by">Previous User</Label>
              <Input
                id="last_used_by"
                name="last_used_by"
                value={asset.last_used_by}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_of_issue">Issue Date</Label>
              <Input
                id="date_of_issue"
                name="date_of_issue"
                value={asset.date_of_issue}
                onChange={handleChange}
                type="date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Department Category</Label>
              <Select
                value={asset.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {assetDropdownOptions.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/assets")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editMode ? 'Update Asset' : 'Add Asset'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;
