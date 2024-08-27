"use client";

import { signup, googleAuthenticate } from "@/lib/actions";
import { lusitana } from "@/app/ui/standalone/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { FcGoogle } from "react-icons/fc";


export default function SignupForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    signup,
    undefined
  );

  return (
    <div className="max-w-md w-full bg-blue-50/10 rounded-lg shadow-md p-8 space-y-7">
      <h1
        className={`${lusitana.className} text-2xl font-bold text-center text-gray-800`}
      >
        Please signup to continue
      </h1>
      <form action={googleAuthenticate} className="mt-4">
        <button
          type="submit"
          className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-blue-50/10 hover:bg-gray-100 transition duration-300"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Sign up with Google
        </button>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-gray-300"></div>
        <span className="absolute  px-4 mt-6">or</span>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="flex-1 rounded-lg bg-blue-50/10 px-6 pb-4 pt-4 shadow-lg">
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                Username
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your username"
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-8 w-full #0284c7 text-white border border-gray-200/80 hover:border-blue-400 hover:shadow-md bg-transparent hover:bg-blue-50/20 hover:text-blue-600 group"
            aria-disabled={isPending}
          >
            Signup <ArrowRightIcon className="ml-auto h-5 w-5 text-white group-hover:text-blue-600" />
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
