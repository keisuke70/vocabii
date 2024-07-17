import SideNav from '@/app/ui/dashboard/sidebar/sideNav';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full md:w-64 flex-shrink-0 h-full overflow-hidden">
        <SideNav />
      </div>
      <div className="flex-grow p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
