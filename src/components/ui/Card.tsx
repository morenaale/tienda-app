"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, glass = false, onClick }: CardProps) {
  return (
    <motion.div
      className={clsx(
        "rounded-2xl p-4",
        glass
          ? "glass"
          : "bg-[var(--surface)] border border-[var(--border-color)]",
        "card-shadow",
        hover && "transition-shadow hover:card-shadow-hover",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
