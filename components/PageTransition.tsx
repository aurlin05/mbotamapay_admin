"use client";

import { motion, MotionConfig } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition component provides smooth fade animations for page navigation
 * Animation duration is set to 200ms (within the 150-300ms requirement)
 * Respects prefers-reduced-motion user preference
 */
export function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      <motion.div
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.2, // 200ms - within 150-300ms range
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
