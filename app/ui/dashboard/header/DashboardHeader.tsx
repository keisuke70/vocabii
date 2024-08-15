import UserButton from "../../standalone/userButton";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { SignIn } from "../../standalone/auth-components";
import NavLinks from "../sidebar/navLinks";

export default async function DashboardHeader() {
  const session = await auth();
  if (!session?.user) return <SignIn />;
  return (
    <header className="flex justify-between items-center w-full h-20 px-4 py-2 bg-gradient-to-b from-customBlue to-white">
      <div className="flex items-center space-x-4">
        <Link
          className="flex h-5 items-center justify-center rounded-md hover:shadow-lg transition-shadow duration-200"
          href="/"
        >
          <div className="overflow-hidden rounded-lg">
            <Image src="/logoww.png" alt="logo" width={100} height={50} />
          </div>
        </Link>
      </div>
      <div className="flex space-x-4">
        <NavLinks />
      </div>
      <div className="flex items-center space-x-4">
        <UserButton
          imageUrl={session.user.image!}
          userName={session.user.name!}
        />
      </div>
    </header>
  );
}
