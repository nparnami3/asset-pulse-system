
import { Asset } from "../context/AssetContext";
import { deviceTypes } from "./assetIdGenerator";
import * as XLSX from 'xlsx';

export function readExcelFile(file: File): Promise<Asset[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        // Convert Excel data to Asset objects
        const assets: Asset[] = jsonData.map((row: any, index) => {
          // Create a valid asset_id based on the data
          const deviceTypeCode = deviceTypes[row.asset_type] || 'OT';
          const sequentialNumber = (index + 1).toString().padStart(3, '0');
          const asset_id = `UBITAST${deviceTypeCode}${sequentialNumber}`;
          
          return {
            asset_id,
            hostname: row.hostname || '',
            location: row.location || '',
            floor: row.floor || '',
            status: row.status || 'Active',
            ip_address: row.ip_address || '',
            lan_mac_address: row.lan_mac_address || '',
            used_by: row.used_by || '',
            last_used_by: row.last_used_by || '',
            ip_type: row.ip_type || '',
            category: row.category || '',
            company: row.company || '',
            model_no: row.model_no || '',
            serial_number: row.serial_number || '',
            processor: row.processor || '',
            generation: row.generation || '',
            ram: row.ram || '',
            hdd_ssd: row.hdd_ssd || '',
            hdd_nvme: row.hdd_nvme || '',
            hdd_sata: row.hdd_sata || '',
            monitor_type: row.monitor_type || '',
            monitor_model: row.monitor_model || '',
            monitor_serial: row.monitor_serial || '',
            keyboard: row.keyboard || '',
            mouse: row.mouse || '',
            graphics_card: row.graphics_card || '',
            laptop_battery: row.laptop_battery || '',
            antivirus: row.antivirus || '',
            definitions: row.definitions || '',
            domain_workgroup: row.domain_workgroup || '',
            domain_user: row.domain_user || '',
            domain_password: row.domain_password || '',
            local_user: row.local_user || '',
            local_password: row.local_password || '',
            windows_version: row.windows_version || '',
            windows_key: row.windows_key || '',
            ms_office_version: row.ms_office_version || '',
            email_id: row.email_id || '',
            internet_enabled: row.internet_enabled || '',
            asset_type: row.asset_type || '',
            printer_model: row.printer_model || '',
            printer_serial: row.printer_serial || '',
            date_of_issue: row.date_of_issue ? new Date(row.date_of_issue).toISOString().split('T')[0] : ''
          };
        });
        
        resolve(assets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
}

export function generateExcelTemplate(): void {
  // Create a template Excel file with all the required columns
  const templateData = [
    {
      hostname: 'UB-DEV-001',
      location: 'Headquarters',
      floor: '3rd Floor',
      status: 'Active',
      ip_address: '192.168.1.101',
      lan_mac_address: '00:1A:2B:3C:4D:5E',
      used_by: 'John Doe',
      last_used_by: '',
      ip_type: 'Static',
      category: 'Development',
      company: 'Dell',
      model_no: 'Optiplex 7090',
      serial_number: 'DEL7090123456',
      processor: 'Intel Core i7',
      generation: '11th Gen',
      ram: '16GB',
      hdd_ssd: '512GB',
      hdd_nvme: 'Not Applicable',
      hdd_sata: '1TB',
      monitor_type: 'LED',
      monitor_model: 'Dell P2419H',
      monitor_serial: 'CN123456',
      keyboard: 'Dell KB216',
      mouse: 'Dell MS116',
      graphics_card: 'Intel UHD Graphics',
      laptop_battery: 'Not Applicable',
      antivirus: 'Windows Defender',
      definitions: 'Updated',
      domain_workgroup: 'UBDOMAIN',
      domain_user: 'john.doe',
      domain_password: '********',
      local_user: 'admin',
      local_password: '********',
      windows_version: 'Windows 10 Pro',
      windows_key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
      ms_office_version: 'Microsoft 365',
      email_id: 'john.doe@example.com',
      internet_enabled: 'Yes',
      asset_type: 'Desktop',
      printer_model: 'Not Applicable',
      printer_serial: 'Not Applicable',
      date_of_issue: '2023-05-15'
    }
  ];
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  
  // Save to file
  XLSX.writeFile(workbook, 'asset_import_template.xlsx');
}

export function exportAssetsToExcel(assets: Asset[]): void {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(assets);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
  
  // Save to file
  XLSX.writeFile(workbook, 'assets_export.xlsx');
}
