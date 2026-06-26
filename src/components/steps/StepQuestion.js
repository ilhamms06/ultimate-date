"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Bunny from "../Bunny";
import Button from "../Button";
import { FloatingHearts } from "../Decor";
import { HeartIcon } from "../icons";

const TOOLTIPS = [
  "Are you sure? 😢",
  "Think again... pretty please? 🥺",
  "Wrong answer detected 🚨",
  "My heart just cracked a little 💔",
  "The button refuses to be pressed 🙈",
];

export default function StepQuestion({ onYes }) {
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);

  const yesScale = Math.min(1 + dodges * 0.12, 1.9);

  function dodge() {
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 240;
    setPos({ x, y });
    setTooltip(TOOLTIPS[dodges % TOOLTIPS.length]);
    setDodges((d) => d + 1);
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <Image
        src="/images/background/bg2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={12} />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="relative z-10 flex flex-col items-center gap-5"
      >
        <div className="animate-wobble drop-shadow-[0_16px_22px_rgba(255,122,178,0.3)]">
          <Bunny className="h-44 w-44" mood={dodges > 0 ? "sad" : "happy"} />
        </div>
        <h1 className="font-display max-w-sm text-3xl font-extrabold leading-tight text-pink-500">
          Would you like to go on a date with me? 🥺💖
        </h1>
      </motion.div>

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-4">
        <motion.div
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="w-full origin-center"
        >
          <Button onClick={onYes} className="w-full text-2xl">
            YES
            <HeartIcon className="h-7 w-7" />
          </Button>
        </motion.div>

        <div className="relative h-16 w-full">
          <AnimatePresence>
            {tooltip && (
              <motion.span
                key={tooltip + dodges}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 top-[-10px] -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-pink-500 shadow"
              >
                {tooltip}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onMouseEnter={dodge}
            onClick={dodge}
            onFocus={dodge}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute left-1/2 top-3 min-h-[44px] -translate-x-1/2 rounded-full border-2 border-dashed border-pink-300 bg-white/60 px-6 py-2 font-display font-bold text-ink-soft backdrop-blur"
          >
            NO
          </motion.button>
        </div>
      </div>
    </div>
  );
}
