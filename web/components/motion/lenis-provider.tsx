"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import React, { useEffect } from "react";

/**
 * Smooth-scroll provider (Lenis) + global reduced-motion handling.
 * Lenis is disabled entirely when the user prefers reduced motion.
 * MotionConfig `reducedMotion="user"` disables transform/layout
 * animations (keeps opacity fades) for those users.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
