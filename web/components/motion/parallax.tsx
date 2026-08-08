"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ParallaxProps {
  children?: React.ReactNode;
  /** Scroll rate; higher drifts more. Subtle values (0.1–0.3). */
  speed?: number;
  className?: string;
}

/**
 * Transform-only parallax wrapper. Runs useScroll against its own bounds and
 * drifts the child as it crosses the viewport. Disabled for reduced motion.
 */
export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
