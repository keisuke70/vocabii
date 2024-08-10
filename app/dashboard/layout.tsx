import SideNav from '@/app/ui/dashboard/sidebar/sideNav';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full md:w-40 lg:w-64 flex-shrink-0 h-1/3 md:h-full overflow-y-auto md:overflow-hidden">
        <SideNav />
      </div>
      <div className="flex-grow p-4 md:p-8 md:overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
