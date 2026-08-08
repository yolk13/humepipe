import React from "react";

import { cn } from "@/components/cn";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Infinite marquee (trust bar). Content is duplicated for a seamless loop;
 * pauses on hover; animation disabled under prefers-reduced-motion.
 */
export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track flex w-max items-center">
        <div className="flex items-center gap-xl md:gap-xxl">{children}</div>
        <div className="flex items-center gap-xl md:gap-xxl" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
