import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PowerIcon, CogIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut } from "@/auth";


interface UserButtonProps {
  imageUrl?: string;
  userName?: string;
}

export default function UserButton({ imageUrl, userName }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full p-0 mr-3 md:mr-1 lg:mr-3">
          <Avatar className="md:w-8 md:h-8 lg:w-10 lg:h-10">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={userName ?? ""} />
            ) : (
                <AvatarImage src={"defaulticon.png"} alt={userName ?? ""} />
            )}
            <AvatarFallback>{userName?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 md:w-56"
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
  );
}
