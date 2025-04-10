
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Lock, ShieldAlert } from 'lucide-react';

const UsersPage = () => {
  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Users</h2>
            <p className="text-muted-foreground">Manage user access to the ITAMS</p>
          </div>
          <Button className="mt-4 md:mt-0" disabled>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
        
        <Card className="p-6 mb-6 flex justify-center items-center flex-col">
          <Lock className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            User management features will be available when connected to the database and authentication system.
          </p>
          <Button variant="outline">Configure Database Connection</Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Access Control</h3>
          </div>
          <Separator className="mb-6" />
          
          <p className="text-muted-foreground mb-4">
            ITAMS provides role-based access control with the following permission levels:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Administrator</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Full system access</li>
                <li>User management</li>
                <li>Configuration settings</li>
                <li>Add, edit, delete all assets</li>
                <li>Export and reporting</li>
              </ul>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Manager</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>View all assets</li>
                <li>Add and edit assets</li>
                <li>Export and reporting</li>
                <li>No user management</li>
                <li>Limited configuration</li>
              </ul>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Viewer</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>View assets only</li>
                <li>Generate reports</li>
                <li>No editing capabilities</li>
                <li>No configuration access</li>
                <li>No user management</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default UsersPage;
