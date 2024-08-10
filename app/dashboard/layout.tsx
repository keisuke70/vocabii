import SideNav from '@/app/ui/dashboard/sidebar/sideNav';
import DashboardHeader from '@/app/ui/dashboard/header/DashboardHeader';
export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="block md:hidden w-full h-auto">
        <DashboardHeader />
      </div>
      
      <div className="hidden md:block w-full md:w-40 lg:w-64 flex-shrink-0 h-full">
        <SideNav />
      </div>

      <div className="flex-grow p-3 md:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
