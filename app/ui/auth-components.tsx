import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


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
