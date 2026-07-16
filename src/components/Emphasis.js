"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";

/**
 * Renders a CMS template string:
 *  - `{name}` style placeholders are replaced from `values`
 *  - `*word*` segments are wrapped in a styled (optionally animated) <em>
 *
 * Lets admin-editable copy keep its emphasized word + dynamic parts.
 */
export default function Emphasis({
  text,
  values = {},
  emClassName = "font-serif italic font-medium text-pink-500",
  animate = false,
}) {
  if (text == null) return null;

  const interpolated = String(text).replace(/\{(\w+)\}/g, (_, k) =>
    values[k] != null ? values[k] : ""
  );

  const parts = interpolated.split(/(\*[^*]+\*)/g).filter((p) => p !== "");

  return parts.map((p, i) => {
    const isEm = p.length > 1 && p.startsWith("*") && p.endsWith("*");
    if (!isEm) return <Fragment key={i}>{p}</Fragment>;
    const word = p.slice(1, -1);
    if (animate) {
      return (
        <motion.em
          key={i}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className={`inline-block ${emClassName}`}
        >
          {word}
        </motion.em>
      );
    }
    return (
      <em key={i} className={emClassName}>
        {word}
      </em>
    );
  });
}
