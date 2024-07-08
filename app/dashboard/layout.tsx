import SideNav from '@/app/ui/dashboard/sidenav';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full md:w-64 flex-shrink-0 h-full">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:p-12 h-full">
        {children}
      </div>
    </div>
  );
}
