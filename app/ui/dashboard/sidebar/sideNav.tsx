import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/sidebar/navLinks";
import AcmeLogo from "@/app/ui/acme-logo";
import UserProfile from "./UserProfile";

export default function SideNav() {
  return (
    <div className="flex h-50 h-screen flex-col p-4 lg:p-6 bg-gradient-to-b from-customGray to-customWhite shadow-lg rounded-lg text-gray-900">
      <Link
        className="mb-6 flex h-15 items-center justify-center rounded-md md:h-29 hover:shadow-md transition-shadow duration-200"
        href="/"
      >
        <AcmeLogo />
      </Link>
      <div className="flex-grow flex flex-col space-y-6">
        <NavLinks />
      </div>
      <div className="my-3">
        <UserProfile />
      </div>
    </div>
  );
}
