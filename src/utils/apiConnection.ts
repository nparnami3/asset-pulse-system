
import { toast } from "sonner";
import { Asset } from "@/context/AssetContext";

const API_URL = "http://localhost:3001"; // Default API URL

export interface ApiConfig {
  url: string;
}

// Get the API configuration from localStorage
export const getApiConfig = (): ApiConfig => {
  const storedConfig = localStorage.getItem('itams-api-config');
  if (!storedConfig) return { url: API_URL };
  
  try {
    return JSON.parse(storedConfig);
  } catch (error) {
    console.error("Error parsing stored API config:", error);
    return { url: API_URL };
  }
};

// Save API configuration to localStorage
export const saveApiConfig = (config: ApiConfig): void => {
  localStorage.setItem('itams-api-config', JSON.stringify(config));
};

// Check if API connection is configured
export const isApiConfigured = (): boolean => {
  return !!localStorage.getItem('itams-api-config');
};

// Test API connection with more detailed error handling
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const config = getApiConfig();
    console.log("Testing API connection to:", config.url);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${config.url}/api/health`, {
      signal: controller.signal,
      // Add no-cache to prevent cached responses
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`API server responded with status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    console.log("API health check response:", data);
    
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("API connection timeout - server not responding");
      return false;
    }
    console.error("API connection error:", error);
    return false;
  }
};

// Get all assets from API
export const fetchAllAssets = async (): Promise<Asset[]> => {
  try {
    const config = getApiConfig();
    console.log("Fetching assets from API:", config.url);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${config.url}/api/assets`, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API responded with error:", response.status, errorText);
      throw new Error(`Failed to fetch assets: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Successfully fetched assets from API:", data.length);
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    toast.error(`Failed to fetch assets: ${error.message || 'Unknown error'}`);
    return [];
  }
};

// Add a new asset
export const addAsset = async (asset: Asset): Promise<Asset | null> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add asset: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    toast.success("Asset added successfully!");
    return data;
  } catch (error) {
    console.error("Error adding asset:", error);
    toast.error(`Failed to add asset: ${error.message || 'Unknown error'}`);
    return null;
  }
};

// Update an existing asset
export const updateAsset = async (id: string, asset: Asset): Promise<Asset | null> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/assets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update asset: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    toast.success("Asset updated successfully!");
    return data;
  } catch (error) {
    console.error("Error updating asset:", error);
    toast.error(`Failed to update asset: ${error.message || 'Unknown error'}`);
    return null;
  }
};

// Delete an asset
export const deleteAsset = async (id: string): Promise<boolean> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/assets/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete asset: ${response.status} - ${errorText}`);
    }
    
    toast.success("Asset deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting asset:", error);
    toast.error(`Failed to delete asset: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Import multiple assets
export const importAssets = async (assets: Asset[]): Promise<boolean> => {
  try {
    const config = getApiConfig();
    console.log("Importing assets via API:", config.url);
    console.log("Number of assets to import:", assets.length);
    console.log("First asset sample:", assets[0]);
    
    const response = await fetch(`${config.url}/api/assets/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assets),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Import failed with status:", response.status, errorText);
      throw new Error(`Failed to import assets: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Import API response:", result);
    toast.success(`Successfully imported ${assets.length} assets to database`);
    return true;
  } catch (error) {
    console.error("Error importing assets:", error);
    toast.error(`Failed to import assets: ${error.message || 'Unknown error'}`);
    return false;
  }
};
