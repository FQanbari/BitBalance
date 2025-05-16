
import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, PieChart, BarChart, Bell, Settings, 
  Menu, X, LogOut, ChevronRight, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore, useAuthStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, icon, label, isActive, isCollapsed 
}) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-secondary text-foreground"
    )}
  >
    <div className="flex shrink-0 items-center justify-center w-6 h-6">
      {icon}
    </div>
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

const AppShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { theme, setTheme } = useSettingsStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { path: '/portfolios', label: 'Portfolios', icon: <BarChart size={18} /> },
    { path: '/analysis', label: 'Analysis', icon: <PieChart size={18} /> },
    { path: '/alerts', label: 'Alerts', icon: <Bell size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };
  
  // Apply theme on component mount
  React.useEffect(() => {
    if (theme === 'dark' || 
       (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card flex flex-col border-r transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-3 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">B</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-semibold">BitBalance</span>
            )}
          </Link>
          <button 
            onClick={toggleSidebar}
            className="ml-auto rounded-md p-1 hover:bg-secondary"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <Menu size={16} />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-4 px-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <SidebarLink
                key={item.path}
                to={item.path}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.path}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="mt-auto border-t p-3">
          <div className="flex items-center">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-secondary"
            >
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {!isSidebarCollapsed && (
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              )}
            </button>
            
            <button 
              onClick={handleLogout}
              className="ml-auto rounded-md p-2 hover:bg-secondary text-destructive"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-auto">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-card px-4 md:hidden">
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-2 hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
          <h1 className="mx-auto font-semibold">BitBalance</h1>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppShell;
