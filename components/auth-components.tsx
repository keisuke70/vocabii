import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";


export function SignIn({
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Link href="/login" passHref>
      <Button {...props}>
        Sign In
      </Button>
    </Link>
  );
}

export function SignOut({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form>
      <Button variant="ghost" className="w-full p-0" {...props}>
        ログアウト
      </Button>
    </form>
  );
}
