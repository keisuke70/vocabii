import { auth } from "@/auth";
import { SignIn } from "../../standalone/auth-components";
import UserButton from "../../standalone/userButton";

export default async function UserProfile() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="p-2 bg-blue-50/10 border border-white rounded-lg shadow-sm">
      <div className="flex items-center md:gap-1 lg:gap-3">
        <UserButton
          imageUrl={session.user.image!}
          userName={session.user.name!}
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none text-white">
            {session.user.name}
          </p>
          <p className="text-xs leading-none whitespace-normal break-all text-gray-600 pr-1">
            {session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
