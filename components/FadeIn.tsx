"use client";

import { motion, MotionConfig } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * FadeIn component provides smooth fade-in animation for content
 * Duration is set to 200ms (within the 150-300ms requirement)
 * Respects prefers-reduced-motion user preference
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.2,
  className,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      <motion.div
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : duration,
          delay: prefersReducedMotion ? 0 : delay,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
