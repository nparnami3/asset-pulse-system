
import { toast } from "sonner";

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
