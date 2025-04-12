
import { toast } from "sonner";
import { Asset } from "@/context/AssetContext";
import { getApiConfig, testApiConnection } from "./apiConfig";

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
