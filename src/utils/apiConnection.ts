
import { toast } from "sonner";
import { Asset } from "@/context/AssetContext";

// Store API configuration
export interface ApiConfig {
  url: string;
  token?: string;
}

// Default API configuration
const defaultConfig: ApiConfig = {
  url: "http://localhost:3001",
  token: ""
};

// Get stored API configuration from localStorage
export const getApiConfig = (): ApiConfig => {
  try {
    const savedConfig = localStorage.getItem('apiConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error("Error loading API config:", error);
  }
  return defaultConfig;
};

// Check if API is configured
export const isApiConfigured = (): boolean => {
  const config = getApiConfig();
  return Boolean(config && config.url && config.url.trim() !== "");
};

// Save API configuration to localStorage
export const saveApiConfig = (config: ApiConfig): void => {
  try {
    localStorage.setItem('apiConfig', JSON.stringify(config));
  } catch (error) {
    console.error("Error saving API config:", error);
  }
};

// Test connection to API server
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const config = getApiConfig();
    console.info("Testing API connection to:", config.url);
    
    // Try accessing the health check endpoint
    const response = await fetch(`${config.url}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      }
    });

    if (!response.ok) {
      console.error(`API connection failed with status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    console.info("API health check response:", data);
    return data.status === "ok";
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};

// Fetch assets from API
export const fetchAssetsFromApi = async (): Promise<Asset[]> => {
  try {
    const config = getApiConfig();
    console.info("Fetching assets from API:", config.url);

    // Try connecting to API first
    const isConnected = await testApiConnection();
    if (!isConnected) {
      throw new Error("Cannot connect to API server. Please check your API configuration.");
    }
    
    const response = await fetch(`${config.url}/api/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status}`);
    }

    const assets = await response.json();
    console.info("Successfully fetched assets from API:", assets.length);
    return assets;
  } catch (error) {
    console.error("Error fetching assets from API:", error);
    toast.error(`Failed to load assets: ${error.message}`);
    return [];
  }
};

// Alias for backward compatibility
export const fetchAllAssets = fetchAssetsFromApi;

// Create a new asset via API
export const createAssetViaApi = async (asset: Asset): Promise<Asset | null> => {
  try {
    const config = getApiConfig();
    
    const response = await fetch(`${config.url}/api/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      },
      body: JSON.stringify(asset)
    });

    if (!response.ok) {
      throw new Error(`Failed to create asset: ${response.status}`);
    }

    const createdAsset = await response.json();
    toast.success("Asset created successfully");
    return createdAsset;
  } catch (error) {
    console.error("Error creating asset:", error);
    toast.error(`Failed to create asset: ${error.message}`);
    return null;
  }
};

// Update an asset via API
export const updateAssetViaApi = async (asset: Asset): Promise<Asset | null> => {
  try {
    const config = getApiConfig();
    
    const response = await fetch(`${config.url}/api/assets/${asset.asset_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      },
      body: JSON.stringify(asset)
    });

    if (!response.ok) {
      throw new Error(`Failed to update asset: ${response.status}`);
    }

    const updatedAsset = await response.json();
    toast.success("Asset updated successfully");
    return updatedAsset;
  } catch (error) {
    console.error("Error updating asset:", error);
    toast.error(`Failed to update asset: ${error.message}`);
    return null;
  }
};

// Delete an asset via API
export const deleteAssetViaApi = async (assetId: string): Promise<boolean> => {
  try {
    const config = getApiConfig();
    
    const response = await fetch(`${config.url}/api/assets/${assetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete asset: ${response.status}`);
    }

    toast.success("Asset deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting asset:", error);
    toast.error(`Failed to delete asset: ${error.message}`);
    return false;
  }
};

// Import multiple assets with improved error handling
export const importAssets = async (assets: Asset[]): Promise<boolean> => {
  try {
    const config = getApiConfig();
    
    // Validate API connection first
    const isConnected = await testApiConnection();
    if (!isConnected) {
      throw new Error("Cannot connect to API server. Please check your API configuration.");
    }
    
    console.log(`Importing ${assets.length} assets to ${config.url}/api/assets/import`);
    
    // Show loading toast
    toast.loading(`Importing ${assets.length} assets...`, {
      id: "import-toast"
    });
    
    const response = await fetch(`${config.url}/api/assets/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
      },
      body: JSON.stringify({ assets })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Import failed with status:", response.status, errorText);
      
      // Parse JSON error if possible
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.includes("Duplicate entry")) {
          toast.error("Import failed: Duplicate asset ID exists in the database. Try regenerating IDs.", {
            id: "import-toast"
          });
          return false;
        }
      } catch (e) {
        // Not JSON, continue with regular error handling
      }
      
      toast.error(`Failed to import assets: ${response.status} - ${errorText}`, {
        id: "import-toast"
      });
      return false;
    }
    
    const result = await response.json();
    toast.success(`Successfully imported ${result.imported || assets.length} assets`, {
      id: "import-toast"
    });
    return true;
  } catch (error) {
    console.error("Error importing assets:", error);
    
    // Special handling for duplicate key errors
    if (error.message && error.message.includes('Duplicate entry')) {
      toast.error("Import failed: Asset with same ID already exists in database", {
        id: "import-toast"
      });
    } else {
      toast.error(`Failed to import assets: ${error.message || 'Unknown error'}`, {
        id: "import-toast"
      });
    }
    return false;
  }
};
