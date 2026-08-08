import React from "react";

import { cn } from "@/components/cn";

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Amber top rule — "work in progress" / factory-processing indicator. */
  accent?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ header, footer, accent = false, className, children }: CardProps) {
  return (
    <div className={cn("relative flex flex-col border border-border bg-surface-lowest", className)}>
      {accent && <div className="absolute top-0 left-0 h-1 w-full bg-amber" aria-hidden="true" />}
      {header && <div className="border-b border-outline-variant p-md">{header}</div>}
      <div className="flex-1 p-md">{children}</div>
      {footer && <div className="border-t border-outline-variant p-md">{footer}</div>}
    </div>
  );
}
