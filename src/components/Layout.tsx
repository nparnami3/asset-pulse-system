
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  FileSpreadsheet, 
  Settings, 
  Users,
  MonitorSmartphone,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
};

const NavItem = ({ to, icon, text, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
      active ? "bg-primary text-primary-foreground" : "text-gray-700 hover:text-primary-foreground"
    )}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            <span>ITAMS</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">IT Asset Management System</p>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} text="Dashboard" active={path === '/'} />
          <NavItem to="/assets" icon={<MonitorSmartphone size={18} />} text="Assets" active={path.startsWith('/assets')} />
          <NavItem to="/import" icon={<FileSpreadsheet size={18} />} text="Import Data" active={path === '/import'} />
          <NavItem to="/database" icon={<Database size={18} />} text="Database" active={path === '/database'} />
          <NavItem to="/users" icon={<Users size={18} />} text="Users" active={path === '/users'} />
          <NavItem to="/settings" icon={<Settings size={18} />} text="Settings" active={path === '/settings'} />
        </nav>
        <div className="absolute bottom-0 p-4 w-64 border-t text-xs text-muted-foreground">
          <p>© 2025 Uttam Bharat IT Department</p>
          <p>Version 1.0.0</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm p-4 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            <span>ITAMS</span>
          </h2>
          <div className="space-x-2">
            {/* Mobile navigation would go here */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pt-8 md:pt-6 overflow-auto">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
