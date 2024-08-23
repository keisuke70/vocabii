import SideNav from "@/app/ui/dashboard/sidebar/sideNav";
import DashboardHeader from "@/app/ui/dashboard/header/DashboardHeader";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col md:flex-row h-[100dvh]"
      style={{
        background: 'linear-gradient(150deg, #334491, #344592, #476db8,  #6a9cd7, #c8d2dc,#dac9b9)',
      }}
    >
      <div className="block md:hidden w-full h-auto">
        <DashboardHeader />
      </div>

      <div className="hidden md:block w-full md:w-40 lg:w-64 flex-shrink-0 h-full">
        <SideNav />
      </div>

      <div className="flex-grow p-3 md:p-10 overflow-y-auto h-full">
        {children}
      </div>
    </div>
  );
}
