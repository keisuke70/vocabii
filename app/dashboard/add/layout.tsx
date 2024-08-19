'use client'

import { TooltipProvider } from "@/components/ui/tooltip";
import useIsOnScreenKeyboardOpen from '@/lib/useIsKeyboardOpen';
import { useEffect } from 'react';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const isKeyboardOpen = useIsOnScreenKeyboardOpen();

  useEffect(() => {
    if (isKeyboardOpen) {
      // Prevent scrolling when the keyboard is open
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll behavior when the keyboard is closed
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isKeyboardOpen]);

  return (
    <div>
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
