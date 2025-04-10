
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings, Building, Users, FileBarChart } from 'lucide-react';

const SettingsPage = () => {
  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Organization Settings</h3>
            </div>
            <Separator className="mb-6" />
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org_name">Organization Name</Label>
                  <Input id="org_name" defaultValue="Uttam Bharat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org_code">Organization Code</Label>
                  <Input id="org_code" defaultValue="UB" />
                  <p className="text-xs text-muted-foreground mt-1">Used in Asset ID generation</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept_name">Department Name</Label>
                  <Input id="dept_name" defaultValue="IT Department" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept_code">Department Code</Label>
                  <Input id="dept_code" defaultValue="IT" />
                  <p className="text-xs text-muted-foreground mt-1">Used in Asset ID generation</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
          
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileBarChart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Reports</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <Button className="w-full" variant="outline">Generate Asset Report</Button>
                <Button className="w-full" variant="outline">Export All Assets</Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Preferences</h3>
              </div>
              <Separator className="mb-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkmode">Dark Mode</Label>
                  <Switch id="darkmode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autosave">Auto-save changes</Label>
                  <Switch id="autosave" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable notifications</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">User Management</h3>
          </div>
          <Separator className="mb-6" />
          
          <p className="text-muted-foreground mb-4">
            User management features will be available when connected to the database.
          </p>
          
          <Button variant="outline" disabled>Manage Users</Button>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
