"use client";

import { motion } from "framer-motion";

const base =
  "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full " +
  "font-display font-bold min-h-[52px] px-7 text-lg select-none focus:outline-none " +
  "focus-visible:ring-4 focus-visible:ring-pink-300/60 transition-colors";

const variants = {
  primary:
    "text-white shadow-[0_10px_24px_-6px_rgba(255,91,160,0.7)] " +
    "bg-[linear-gradient(180deg,#ff8fc0_0%,#ff5ba0_100%)]",
  secondary:
    "text-ink bg-white/80 backdrop-blur shadow-[0_8px_20px_-8px_rgba(176,125,255,0.6)] " +
    "border-2 border-pink-200",
  ghost: "text-ink-soft bg-white/50 backdrop-blur border-2 border-dashed border-pink-300",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* glossy highlight */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-1 h-1/3 rounded-full bg-white/30 blur-[2px]"
        />
      )}
      {children}
    </motion.button>
  );
}
