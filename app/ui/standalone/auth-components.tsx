import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SignIn(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Link href="/login" passHref>
      <Button
        {...props}
        className="text-white bg-blue-300/50 hover:bg-blue-200/20 text-sm md:text-base px-4 md:px-6 py-2 md:py-3 shadow-md"
      >
        Log In
      </Button>
    </Link>
  );
}

export function SignUp(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Link href="/signup" passHref>
      <Button
        {...props}
        className="text-white bg-green-600 hover:bg-green-700 text-sm md:text-base px-2 md:px-4 py-2 md:py-3 shadow-md"
      >
        Sign Up
      </Button>
    </Link>
  );
}
