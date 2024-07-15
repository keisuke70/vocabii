import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignIn } from "../../auth-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PowerIcon, CogIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import Link from "next/link";

export default async function UserProfile() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="p-2 bg-#f3f4f6 border border-gray-500 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-12 h-12 rounded-full">
              <Avatar className="w-10 h-10">
                {session.user.image && (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                  />
                )}
                <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            side="right"
            sideOffset={5}
            forceMount
          >
            <DropdownMenuItem asChild>
              <Link href="/dashboard/setting" passHref>
                <button className="flex items-center gap-2">
                  <CogIcon className="w-6" />
                  <span>Settings</span>
                </button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirect: true, redirectTo: "/" });
                }}
              >
                <button className="flex items-center gap-2">
                  <PowerIcon className="w-6" />
                  <span>Sign Out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-none">
            {session.user.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
