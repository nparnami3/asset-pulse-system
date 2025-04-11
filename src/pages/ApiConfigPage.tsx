
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/context/ApiContext';
import { Server, RefreshCw, Check, Link } from 'lucide-react';

const ApiConfigPage = () => {
  const { isConnected, connecting, apiConfig, updateApiConfig, testConnection } = useApi();
  const [apiUrl, setApiUrl] = useState(apiConfig.url);

  const handleUpdateConfig = () => {
    updateApiConfig({ url: apiUrl });
  };

  const handleTestConnection = async () => {
    await testConnection();
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
        
        <Card className="p-6 mb-6">
          <div className="flex items-start md:items-center gap-4 flex-col md:flex-row mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">API Connection</h3>
              <p className="text-muted-foreground">
                {isConnected 
                  ? "Your API server is connected. Asset data will be stored in your MySQL database."
                  : "Connect to your API server to start storing asset data in your MySQL database."
                }
              </p>
            </div>
          </div>
          
          <Card className="p-4 mb-6 bg-muted/50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API Server URL</Label>
                <Input 
                  id="apiUrl" 
                  value={apiUrl} 
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of your API server. Default is http://localhost:3001
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleUpdateConfig} variant="outline">
                <Link className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
              <Button onClick={handleTestConnection} disabled={connecting}>
                {connecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </Card>
          
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Connection Status</h4>
            </div>
            <p className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {isConnected ? `Connected to API server at ${apiConfig.url}` : "Not connected to any API server"}
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Setting up the API Server</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Step 1: Create a new directory for your API server</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  mkdir itams-api
                  cd itams-api
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 2: Initialize a new Node.js project</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  npm init -y
                  npm install express cors mysql2 dotenv
                  npm install --save-dev nodemon @types/express @types/cors @types/node typescript ts-node
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 3: Create a .env file for your database credentials</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
{`# .env file content
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=itams
PORT=3001`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 4: Create server.js file</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
{`// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ status: 'ok', message: 'API server running and database connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Get all assets
app.get('/api/assets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assets');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Failed to fetch assets' });
  }
});

// Get asset by ID
app.get('/api/assets/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assets WHERE asset_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ message: 'Failed to fetch asset' });
  }
});

// Create new asset
app.post('/api/assets', async (req, res) => {
  try {
    const asset = req.body;
    const columns = Object.keys(asset).join(', ');
    const placeholders = Object.keys(asset).map(() => '?').join(', ');
    
    const query = \`INSERT INTO assets (\${columns}) VALUES (\${placeholders})\`;
    const values = Object.values(asset);
    
    await pool.query(query, values);
    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ message: 'Failed to create asset' });
  }
});

// Update asset
app.put('/api/assets/:id', async (req, res) => {
  try {
    const asset = req.body;
    const id = req.params.id;
    
    // Build SET clause for SQL update
    const setClause = Object.keys(asset)
      .filter(key => key !== 'asset_id') // Don't update the primary key
      .map(key => \`\${key} = ?\`)
      .join(', ');
    
    const query = \`UPDATE assets SET \${setClause} WHERE asset_id = ?\`;
    const values = [
      ...Object.keys(asset)
        .filter(key => key !== 'asset_id')
        .map(key => asset[key]),
      id
    ];
    
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Failed to update asset' });
  }
});

// Delete asset
app.delete('/api/assets/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM assets WHERE asset_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: 'Failed to delete asset' });
  }
});

// Import multiple assets
app.post('/api/assets/import', async (req, res) => {
  try {
    const assets = req.body;
    let imported = 0;
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const asset of assets) {
        const columns = Object.keys(asset).join(', ');
        const placeholders = Object.keys(asset).map(() => '?').join(', ');
        
        const query = \`INSERT INTO assets (\${columns}) VALUES (\${placeholders})\`;
        const values = Object.values(asset);
        
        await connection.query(query, values);
        imported++;
      }
      
      await connection.commit();
      res.status(200).json({ message: \`Successfully imported \${imported} assets\` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error importing assets:', error);
    res.status(500).json({ message: 'Failed to import assets' });
  }
});

// Setup database schema if not exists
async function setupDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Check if assets table exists
    const [tables] = await connection.query(
      "SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = 'assets'",
      [process.env.DB_DATABASE]
    );
    
    // Create table if it doesn't exist
    if (tables.length === 0) {
      console.log('Creating assets table...');
      await connection.query(\`
        CREATE TABLE assets (
          asset_id VARCHAR(15) PRIMARY KEY,
          hostname VARCHAR(15),
          location VARCHAR(100),
          floor VARCHAR(50),
          status VARCHAR(20),
          ip_address VARCHAR(15),
          lan_mac_address VARCHAR(17),
          used_by VARCHAR(100),
          last_used_by VARCHAR(100),
          ip_type VARCHAR(20),
          category VARCHAR(20),
          company VARCHAR(50),
          model_no VARCHAR(100),
          serial_number VARCHAR(100),
          processor VARCHAR(100),
          generation VARCHAR(20),
          ram VARCHAR(20),
          hdd_ssd VARCHAR(20),
          hdd_nvme VARCHAR(20),
          hdd_sata VARCHAR(20),
          monitor_type VARCHAR(50),
          monitor_model VARCHAR(50),
          monitor_serial VARCHAR(50),
          keyboard VARCHAR(50),
          mouse VARCHAR(50),
          graphics_card VARCHAR(100),
          laptop_battery VARCHAR(50),
          antivirus VARCHAR(50),
          definitions VARCHAR(50),
          domain_workgroup VARCHAR(100),
          domain_user VARCHAR(50),
          domain_password VARCHAR(50),
          local_user VARCHAR(50),
          local_password VARCHAR(50),
          windows_version VARCHAR(50),
          windows_key VARCHAR(100),
          ms_office_version VARCHAR(50),
          email_id VARCHAR(100),
          internet_enabled VARCHAR(10),
          asset_type VARCHAR(50),
          printer_model VARCHAR(50),
          printer_serial VARCHAR(50),
          date_of_issue DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      \`);
      console.log('Assets table created successfully');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Start server after setup
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(\`API server running on port \${PORT}\`);
  });
});`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 5: Update package.json with start scripts</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
{`"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 6: Start the API server</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  npm run dev
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This will start the API server on port 3001. Make sure your MySQL server is running and the credentials in your .env file are correct.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ApiConfigPage;
