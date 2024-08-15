import { auth } from "@/auth";
import { SignIn } from "../../auth-components";
import UserButton from "../../userButton";

export default async function UserProfile() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="p-2 bg-#f3f4f6 border border-gray-500 rounded-lg shadow-sm">
      <div className="flex items-center md:gap-1 lg:gap-3">
        <UserButton
          imageUrl={session.user.image!}
          userName={session.user.name!}
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">
            {session.user.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground whitespace-normal break-all">
            {session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
