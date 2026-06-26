"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../Button";
import { FloatingHearts } from "../Decor";
import { StarIcon, CheckIcon, ArrowRightIcon, ArrowLeftIcon } from "../icons";

export const LOCATIONS = [
  { id: "cafe", label: "Cozy Cafe", emoji: "☕", rating: 5, x: 22, y: 24 },
  { id: "rooftop", label: "Rooftop Spot", emoji: "🌆", rating: 4, x: 74, y: 20 },
  { id: "cinema", label: "Cinema", emoji: "🎬", rating: 4, x: 30, y: 54 },
  { id: "restaurant", label: "Romantic Restaurant", emoji: "🍽️", rating: 5, x: 78, y: 56 },
  { id: "citypark", label: "City Park", emoji: "🌳", rating: 5, x: 24, y: 82 },
  { id: "amusement", label: "Amusement Park", emoji: "🎡", rating: 5, x: 72, y: 84 },
];

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400" : "text-pink-200"}`}
        />
      ))}
    </span>
  );
}

export default function StepLocation({ selected, onSelect, onNext, onBack }) {
  const chosen = LOCATIONS.find((l) => l.id === selected);

  return (
    <div className="relative flex h-full w-full flex-col px-5 py-8">
      <Image
        src="/images/background/bg3.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={6} />

      <header className="relative z-10 mb-4 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-pink-400">
          Step 2 of 2
        </p>
        <h1 className="font-display text-3xl font-extrabold text-pink-500">
          Where to, cutie? 🗺️
        </h1>
        <p className="text-sm font-semibold text-ink-soft">Tap a pin on our little map</p>
      </header>

      {/* Illustrated map */}
      <div className="relative z-10 mb-4 aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-white/80 bg-[linear-gradient(160deg,#eafff3_0%,#e7f3ff_50%,#fef0ff_100%)] shadow-inner">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d="M22 24 Q50 18 74 20 Q60 40 78 56 Q50 60 30 54 Q26 70 24 82 Q50 88 72 84"
            fill="none"
            stroke="#ffb6d5"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
          <circle cx="50" cy="48" r="34" fill="#ffffff" opacity="0.18" />
        </svg>

        {LOCATIONS.map((l) => {
          const isActive = selected === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelect(l.id)}
              aria-pressed={isActive}
              aria-label={l.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
            >
              <motion.span
                animate={isActive ? { y: [0, -6, 0] } : {}}
                transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl shadow-md transition-colors ${
                  isActive
                    ? "border-pink-400 bg-white scale-110"
                    : "border-white bg-white/80"
                }`}
              >
                {l.emoji}
                {isActive && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-400 text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                )}
              </motion.span>
            </button>
          );
        })}
      </div>

      {/* Selected detail card */}
      <div className="relative z-10 min-h-[64px]">
        {chosen ? (
          <motion.div
            key={chosen.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border-2 border-pink-200 bg-white/80 px-4 py-3 backdrop-blur"
          >
            <span className="text-3xl">{chosen.emoji}</span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-ink">{chosen.label}</span>
              <Stars rating={chosen.rating} />
            </div>
          </motion.div>
        ) : (
          <p className="py-4 text-center text-sm font-semibold text-ink-soft">
            No spot picked yet 🥺
          </p>
        )}
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
          It&apos;s a Date!
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
