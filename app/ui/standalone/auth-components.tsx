import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SignIn(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Link href="/login" passHref>
      <Button
        {...props}
        className="text-white bg-blue-500 hover:bg-blue-600 text-sm md:text-base px-2 md:px-4 py-2 md:py-3"
      >
        Sign In
      </Button>
    </Link>
  );
}

export function SignUp(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Link href="/signup" passHref>
      <Button
        {...props}
        className="text-white bg-lime-500 hover:bg-lime-600 text-sm md:text-base px-2 md:px-4 py-2 md:py-3"
      >
        Sign Up
      </Button>
    </Link>
  );
}
