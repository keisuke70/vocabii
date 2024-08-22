import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/sidebar/navLinks";
import AcmeLogo from "@/app/ui/standalone/acme-logo";
import UserProfile from "./UserProfile";

export default function SideNav() {
  return (
    <div className="flex h-screen flex-col p-4 lg:p-6 backdrop-blur bg-white/10 shadow-lg rounded-lg">
      <Link
        className="mb-6 flex h-15 items-center justify-center rounded-md md:h-29 hover:shadow-md transition-shadow duration-200"
        href="/"
      >
        <AcmeLogo />
      </Link>
      <div className="flex-grow flex flex-col space-y-6">
        <NavLinks />
      </div>
      <div className="my-3 hover:shadow-md">
        <UserProfile />
      </div>
    </div>
  );
}
