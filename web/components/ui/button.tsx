import Link from "next/link";
import React from "react";

import { cn } from "@/components/cn";

type Variant = "primary" | "action" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-xs rounded-none text-label-md font-semibold uppercase tracking-wider transition-colors duration-150 border-2";

const variants: Record<Variant, string> = {
  primary: "bg-royal text-white border-royal hover:bg-royal-deep hover:border-royal-deep",
  action: "bg-amber text-amber-ink border-amber hover:brightness-90",
  outline: "bg-transparent text-ink border-outline hover:border-royal hover:text-royal",
};

const sizes: Record<Size, string> = {
  md: "px-md py-sm",
  lg: "px-lg py-sm",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href">)
    | React.ComponentProps<"button">
  );

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
