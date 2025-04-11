
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Database, Server, Lock, Shield, RefreshCw, Check, X } from 'lucide-react';
import { useDatabase } from '@/context/DatabaseContext';
import { toast } from 'sonner';

const DatabasePage = () => {
  const { isConnected, connectionConfig, connect, disconnect, connecting } = useDatabase();
  
  const [host, setHost] = useState(connectionConfig?.host || 'localhost');
  const [port, setPort] = useState(connectionConfig?.port || 3306);
  const [user, setUser] = useState(connectionConfig?.user || 'root');
  const [password, setPassword] = useState(connectionConfig?.password || '');
  const [database, setDatabase] = useState(connectionConfig?.database || 'itams');
  const [showForm, setShowForm] = useState(!isConnected);

  const handleConnect = async () => {
    const config = { host, port, user, password, database };
    const success = await connect(config);
    if (success) {
      setShowForm(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowForm(true);
  };

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Database Connection</h2>
        
        <Card className="p-6 mb-6">
          <div className="flex items-start md:items-center gap-4 flex-col md:flex-row mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">MySQL Database Connection</h3>
              <p className="text-muted-foreground">
                {isConnected 
                  ? "Your database is connected. Asset data will be stored permanently."
                  : "Connect to your MySQL database to start storing asset data permanently."
                }
              </p>
            </div>
            <div className="md:ml-auto">
              {isConnected ? (
                <Button onClick={() => setShowForm(!showForm)} variant="outline">
                  {showForm ? "Hide Settings" : "View Settings"}
                </Button>
              ) : (
                <Button onClick={() => setShowForm(!showForm)}>
                  Configure Connection
                </Button>
              )}
            </div>
          </div>
          
          {showForm && (
            <Card className="p-4 mb-6 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input 
                    id="host" 
                    value={host} 
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port" 
                    type="number" 
                    value={port} 
                    onChange={(e) => setPort(Number(e.target.value))}
                    placeholder="3306"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">Username</Label>
                  <Input 
                    id="user" 
                    value={user} 
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="root"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input 
                    id="database" 
                    value={database} 
                    onChange={(e) => setDatabase(e.target.value)}
                    placeholder="itams"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isConnected && (
                  <Button onClick={handleDisconnect} variant="outline" className="text-red-500">
                    <X className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                )}
                <Button onClick={handleConnect} disabled={connecting}>
                  {connecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {isConnected ? "Reconnect" : "Connect"}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Database Server</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected ? `${host}:${port}` : "Not configured"}
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Database Name</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected ? database : "Not configured"}
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Authentication</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {isConnected ? `User: ${user}` : "Not configured"}
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Connection Status</h4>
              </div>
              <p className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
                {isConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Schema Information</h3>
          <p className="text-muted-foreground mb-6">
            The ITAMS application uses the following database schema to store asset information.
            {!isConnected && " Connect your database to implement persistent storage."}
          </p>
          
          <div className="bg-muted/30 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs text-muted-foreground">
{`CREATE DATABASE itams;
USE itams;

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
);`}
            </pre>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DatabasePage;
