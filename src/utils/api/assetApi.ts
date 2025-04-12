
import { toast } from "sonner";
import { Asset } from "@/context/AssetContext";
import { getApiConfig, testApiConnection } from "./apiConfig";

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
