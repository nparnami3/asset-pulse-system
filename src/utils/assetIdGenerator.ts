
export type DeviceType = 'PC' | 'LP' | 'SV' | 'PR' | 'NW' | 'TB' | 'PH' | 'OT';

export interface AssetIdConfig {
  organization: string;
  department: string;
  assetPrefix: string;
  deviceType: DeviceType;
  sequentialNumber: number;
}

export const deviceTypes: Record<string, DeviceType> = {
  'Desktop': 'PC',
  'Laptop': 'LP',
  'Server': 'SV',
  'Printer': 'PR',
  'Network Device': 'NW',
  'Tablet': 'TB',
  'Phone': 'PH',
  'Other': 'OT'
};

/**
 * Generates a unique asset ID based on the provided configuration
 * Format: {ORG}{DEPT}{AST}{DEVICETYPE}{SEQUENTIAL}
 * Example: UBITASTPC001
 */
export function generateAssetId(
  config: AssetIdConfig
): string {
  // Default values
  const organization = config.organization || 'UB';
  const department = config.department || 'IT';
  const assetPrefix = config.assetPrefix || 'AST';
  const deviceType = config.deviceType || 'OT';
  
  // Format sequential number with leading zeros
  const sequentialPart = String(config.sequentialNumber).padStart(3, '0');
  
  // Combine all parts
  return `${organization}${department}${assetPrefix}${deviceType}${sequentialPart}`;
}

/**
 * Calculate the next sequential number based on existing asset IDs
 */
export function getNextSequentialNumber(
  existingIds: string[],
  deviceType: DeviceType
): number {
  const regex = new RegExp(`^[A-Z]{2}[A-Z]{2}[A-Z]{3}${deviceType}(\\d{3})$`);
  
  const sequentialNumbers = existingIds
    .map(id => {
      const match = id.match(regex);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));
  
  if (sequentialNumbers.length === 0) {
    return 1; // Start from 1 if no existing IDs
  }
  
  return Math.max(...sequentialNumbers) + 1;
}

/**
 * Generate the next available asset ID for a given device type
 */
export function getNextAssetId(
  existingIds: string[],
  deviceType: DeviceType,
  organization = 'UB',
  department = 'IT'
): string {
  const nextNum = getNextSequentialNumber(existingIds, deviceType);
  
  return generateAssetId({
    organization,
    department,
    assetPrefix: 'AST',
    deviceType,
    sequentialNumber: nextNum
  });
}

export const assetDropdownOptions = {
  locations: ['Headquarters', 'Branch Office', 'Data Center', 'Remote Office', 'Warehouse'],
  floors: ['Basement', 'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'],
  statuses: ['Active', 'Inactive', 'Maintenance', 'Decommissioned', 'In Storage', 'Lost/Stolen'],
  ipTypes: ['Static', 'DHCP', 'Not Applicable'],
  categories: ['Development', 'Management', 'Accounting', 'Marketing', 'Sales', 'HR', 'Printing', 'Networking', 'General Use'],
  companies: ['Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Asus', 'Acer', 'Cisco', 'Samsung'],
  generations: ['8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen', 'Not Applicable'],
  ramSizes: ['4GB', '8GB', '16GB', '32GB', '64GB', 'Not Applicable'],
  storageSizes: ['128GB', '256GB', '512GB', '1TB', '2TB', 'Not Applicable'],
  keyboards: ['Dell KB216', 'Logitech K120', 'Microsoft Ergonomic', 'HP Standard', 'Built-in', 'Not Applicable'],
  mice: ['Dell MS116', 'Logitech M100', 'Microsoft Basic', 'HP Standard', 'Built-in Trackpad', 'Not Applicable'],
  laptopBatteries: ['New', 'Good', 'Fair', 'Poor', 'Needs Replacement', 'Not Applicable'],
  antivirusSoftware: ['Windows Defender', 'McAfee', 'Norton', 'Avast', 'Kaspersky', 'AVG', 'Bitdefender', 'Not Applicable'],
  definitions: ['Updated', 'Outdated', 'Not Applicable'],
  windowsVersions: ['Windows 10 Home', 'Windows 10 Pro', 'Windows 10 Enterprise', 'Windows 11 Home', 'Windows 11 Pro', 'Windows 11 Enterprise', 'Not Applicable'],
  officeVersions: ['Microsoft 365', 'Office 2021', 'Office 2019', 'Office 2016', 'Office 2013', 'Not Applicable'],
  internetEnabled: ['Yes', 'No', 'Limited'],
  assetTypes: ['Desktop', 'Laptop', 'Server', 'Printer', 'Network Device', 'Tablet', 'Phone', 'Monitor', 'Other']
};
