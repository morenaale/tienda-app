"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: "bg-chambray text-white hover:bg-chambray-dark",
  accent: "bg-terracotta text-white hover:bg-terracotta-dark",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
  outline: "border border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled,
  icon,
}: ButtonProps) {
  return (
    <motion.button
      className={clsx(
        "rounded-xl font-medium flex items-center gap-2 transition-colors",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </motion.button>
  );
}
