"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { cn } from "@/components/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/quality", label: "Quality" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant bg-surface">
      <div className="container-max flex h-xl items-center justify-between px-sm md:px-lg">
        <Link href="/" className="text-headline-md font-bold text-royal">
          CONTECH
        </Link>

        <nav className="hidden h-full items-center gap-lg md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-full items-center text-label-md uppercase tracking-wider transition-colors duration-150",
                  active ? "border-b-2 border-royal pb-1 font-bold text-royal" : "text-ink-muted hover:text-royal",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/rfq"
          className="hidden bg-royal px-md py-sm text-label-md uppercase tracking-wider text-white transition-colors duration-150 hover:bg-royal-deep md:inline-flex"
        >
          Request Quote
        </Link>

        <button
          type="button"
          className="text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-outline-variant bg-surface px-sm py-md md:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block border-b border-outline-variant py-sm text-label-md uppercase tracking-wider last:border-b-0",
                pathname === link.href ? "font-bold text-royal" : "text-ink-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rfq"
            onClick={() => setOpen(false)}
            className="mt-sm block bg-royal px-md py-sm text-center text-label-md uppercase tracking-wider text-white"
          >
            Request Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
