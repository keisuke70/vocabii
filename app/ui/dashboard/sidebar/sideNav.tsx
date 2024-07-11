import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/sidebar/navLinks";
import AcmeLogo from "@/app/ui/acme-logo";
import UserProfile from "./UserProfile";

export default function SideNav() {
  return (
    <div className="flex h-screen flex-col px-3 py-4 md:px-4 bg-customGray text-white">
      <Link
        className="mb-6 flex h-25 items-center justify-center rounded-md p-2 md:h-29"
        href="/"
      >
        <AcmeLogo />

      </Link>
      <div className="flex flex-grow flex-col space-y-4">
        <NavLinks />
      </div>
      <div className="mt-auto mb-6">
        <UserProfile />
      </div>
    </div>
  );
}
