import React from "react";

import { cn } from "@/components/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-xl flex flex-col gap-sm",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-label-md uppercase tracking-wider text-royal">{eyebrow}</p>
      )}
      <h2 className="text-headline-lg text-ink">{title}</h2>
      {description && (
        <p className={cn("max-w-2xl text-body-lg text-ink-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
