"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../Button";
import { FloatingHearts } from "../Decor";
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon } from "../icons";

export const ACTIVITIES = [
  { id: "dinner", label: "Dinner Date", emoji: "🍝" },
  { id: "coffee", label: "Coffee Date", emoji: "☕" },
  { id: "movie", label: "Movie Date", emoji: "🎬" },
  { id: "icecream", label: "Ice Cream Date", emoji: "🍦" },
  { id: "bowling", label: "Bowling Date", emoji: "🎳" },
  { id: "gaming", label: "Gaming Date", emoji: "🎮" },
  { id: "park", label: "Park Walk", emoji: "🌳" },
  { id: "funfair", label: "Funfair Date", emoji: "🎡" },
];

export default function StepActivity({ selected, onSelect, onNext, onBack }) {
  return (
    <div className="relative flex h-full w-full flex-col px-5 py-8">
      <Image
        src="/images/background/bg2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={8} />

      <header className="relative z-10 mb-5 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-pink-400">
          Step 1 of 2
        </p>
        <h1 className="font-display text-3xl font-extrabold text-pink-500">
          What should we do? 💕
        </h1>
        <p className="text-sm font-semibold text-ink-soft">Pick our perfect activity</p>
      </header>

      <div className="relative z-10 grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto pb-2">
        {ACTIVITIES.map((a, i) => {
          const isActive = selected === a.id;
          return (
            <motion.button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.94 }}
              aria-pressed={isActive}
              className={`relative flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-3xl border-2 p-3 text-center transition-colors ${
                isActive
                  ? "border-pink-400 bg-white shadow-[0_12px_26px_-10px_rgba(255,91,160,0.7)]"
                  : "border-white/70 bg-white/60 backdrop-blur"
              }`}
            >
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.4 }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-400 text-white"
                >
                  <CheckIcon className="h-4 w-4" />
                </motion.span>
              )}
              <motion.span
                animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-4xl"
              >
                {a.emoji}
              </motion.span>
              <span className="font-display text-base font-bold text-ink">
                {a.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-3">
        <Button variant="secondary" onClick={onBack} aria-label="Go back" className="px-5">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <Button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
