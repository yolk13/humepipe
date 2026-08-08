"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/components/cn";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds to wait before animating in (stagger). */
  delay?: number;
  /** Animation duration in seconds (Fibonacci: 150/250/400/650ms). */
  duration?: number;
  className?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered reveal: fade + 16px slide + subtle blur, once.
 * Transform/filter are disabled automatically for reduced-motion users.
 */
export function Reveal({ children, delay = 0, duration = 0.4, className }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
