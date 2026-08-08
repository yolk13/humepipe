import React from "react";

import { cn } from "@/components/cn";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  /** Amber pulse dot used for the "live" certification badge. */
  dot?: boolean;
}

export function Tag({ children, className, dot = false }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-xs border border-outline bg-surface-low px-sm py-xs text-label-md uppercase tracking-wider text-ink-muted",
        className,
      )}
    >
      {dot && <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />}
      {children}
    </span>
  );
}
