"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
};

/**
 * Scroll-triggered fade-and-rise. Lets server components stay on the server —
 * only this wrapper ships to the client.
 */
export default function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
