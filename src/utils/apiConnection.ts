
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

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/health`);
    
    if (!response.ok) {
      throw new Error(`API server responded with status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("API connection error:", error);
    return false;
  }
};

// Get all assets from API
export const fetchAllAssets = async (): Promise<Asset[]> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/assets`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    toast.error("Failed to fetch assets from server");
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
      throw new Error(`Failed to add asset: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Asset added successfully!");
    return data;
  } catch (error) {
    console.error("Error adding asset:", error);
    toast.error("Failed to add asset");
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
      throw new Error(`Failed to update asset: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Asset updated successfully!");
    return data;
  } catch (error) {
    console.error("Error updating asset:", error);
    toast.error("Failed to update asset");
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
      throw new Error(`Failed to delete asset: ${response.status}`);
    }
    
    toast.success("Asset deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting asset:", error);
    toast.error("Failed to delete asset");
    return false;
  }
};

// Import multiple assets
export const importAssets = async (assets: Asset[]): Promise<boolean> => {
  try {
    const config = getApiConfig();
    const response = await fetch(`${config.url}/api/assets/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assets),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to import assets: ${response.status}`);
    }
    
    toast.success(`Successfully imported ${assets.length} assets`);
    return true;
  } catch (error) {
    console.error("Error importing assets:", error);
    toast.error("Failed to import assets");
    return false;
  }
};
