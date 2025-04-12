
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileSpreadsheet, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useAssets } from '@/context/AssetContext';
import { readExcelFile, generateExcelTemplate } from '@/utils/excelHandler';
import { importAssets as apiImportAssets } from '@/utils/apiConnection';
import { useApi } from '@/context/ApiContext';
import { toast } from 'sonner';

const ImportData = () => {
  const { importAssets, refreshAssets } = useAssets();
  const { isConnected: apiConnected } = useApi();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is Excel format
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        setFile(null);
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const assets = await readExcelFile(file);
      
      if (assets.length === 0) {
        setError('No data found in the Excel file');
        setLoading(false);
        return;
      }
      
      console.log("Assets read from file:", assets.length);
      console.log("Sample asset:", assets[0]);
      console.log("API Connected status:", apiConnected);
      
      if (apiConnected) {
        // If API is connected, use it for import
        const success = await apiImportAssets(assets);
        if (success) {
          // After successful API import, refresh data from API
          await refreshAssets();
          setSuccess(`Successfully imported ${assets.length} assets via API`);
        } else {
          throw new Error('API import failed. Make sure your API server is running correctly.');
        }
      } else {
        // Fall back to local import if API not connected
        importAssets(assets);
        setSuccess(`Successfully imported ${assets.length} assets locally`);
      }
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
    } catch (error) {
      console.error('Import error:', error);
      setError(`Error importing data: ${error.message || 'Please check file format and try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      generateExcelTemplate();
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Template generation error:', error);
      toast.error('Error generating template');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Import Asset Data</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h3 className="text-lg font-semibold mb-4">Upload Excel File</h3>
          
          <div className="mb-6">
            <Label htmlFor="file" className="mb-2 block">Select Excel File</Label>
            <div className="flex gap-4">
              <Input 
                id="file" 
                type="file" 
                ref={fileInputRef}
                accept=".xlsx,.xls" 
                onChange={handleFileChange} 
              />
              <Button 
                onClick={handleImport} 
                disabled={!file || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Import
              </Button>
            </div>
            {file && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <h4 className="font-medium mb-2">Import Instructions</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Use the template format for best results</li>
              <li>Required columns: hostname, asset_type, serial_number, location, status</li>
              <li>Asset IDs will be automatically generated</li>
              <li>Maximum file size: 5MB</li>
              <li>Large files may take a few moments to process</li>
              {apiConnected ? (
                <li className="text-green-600 font-medium">API Connected: Data will be imported to database</li>
              ) : (
                <li className="text-amber-600 font-medium">API Not Connected: Data will only be imported locally</li>
              )}
            </ul>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Templates</h3>
          <p className="text-muted-foreground mb-6">
            Download an Excel template to ensure your data is formatted correctly for import.
          </p>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownloadTemplate}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Template Preview</h4>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left">hostname</th>
                    <th className="p-2 text-left">asset_type</th>
                    <th className="p-2 text-left">serial_number</th>
                    <th className="p-2 text-left">location</th>
                    <th className="p-2 text-left">status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">UB-DEV-001</td>
                    <td className="p-2">Desktop</td>
                    <td className="p-2">DEL7090123456</td>
                    <td className="p-2">Headquarters</td>
                    <td className="p-2">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImportData;
