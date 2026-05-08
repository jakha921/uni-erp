import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '@/components/overlays/ToastContainer';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/lib/utils';

export function AppShell() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-200',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-60',
        )}
      >
        <Topbar />
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}
