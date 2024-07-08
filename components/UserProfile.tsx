// UserProfile.tsx
import { Button } from "./ui/button";
import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SignIn } from "./auth-components";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default async function UserProfile() {
  const session = await auth();
  if (!session?.user) return <SignIn />;

  return (
    <div className="flex flex-col items-center gap-3"> 
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
        <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={5} forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p> 
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <form
              action={async () => {
                'use server';
                await signOut({ redirect: true, redirectTo: '/' });
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
    </div>
  );
}

