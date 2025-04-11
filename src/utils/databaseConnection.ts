
import { toast } from "sonner";

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// This is a frontend-only application, so we'll simulate a database connection
// In a real production environment, you would never connect directly to MySQL from the frontend
// Instead, use an API server or a service like Supabase for secure database operations
export const testDatabaseConnection = async (config: DatabaseConfig): Promise<boolean> => {
  try {
    // Simulate a database connection test
    console.log("Testing database connection with config:", {
      ...config,
      password: "********" // Don't log actual password
    });
    
    // Validate basic connection parameters
    if (!config.host || !config.user || !config.password) {
      throw new Error("Missing required connection parameters");
    }
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For demo purposes, we'll assume the connection is successful if basic validation passes
    // In a real app, this would be an actual MySQL connection test
    
    // Store connection in localStorage for persistence between sessions
    localStorage.setItem('itams-database-config', JSON.stringify({
      ...config,
      password: btoa(config.password) // Simple obfuscation, not secure encryption
    }));
    
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

export const getDatabaseConfig = (): DatabaseConfig | null => {
  const storedConfig = localStorage.getItem('itams-database-config');
  if (!storedConfig) return null;
  
  try {
    const config = JSON.parse(storedConfig);
    // Decode password
    if (config.password) {
      config.password = atob(config.password);
    }
    return config;
  } catch (error) {
    console.error("Error parsing stored database config:", error);
    return null;
  }
};

export const checkDatabaseConnection = (): boolean => {
  return !!localStorage.getItem('itams-database-config');
};

export const disconnectDatabase = (): void => {
  localStorage.removeItem('itams-database-config');
};
