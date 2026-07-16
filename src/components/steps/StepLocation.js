"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import Button from "../Button";
import { CheckIcon, ArrowRightIcon, HeartIcon } from "../icons";
import { GradientIcon, IconBadge } from "../GradientIcon";
import { useContent } from "../ContentProvider";
import Emphasis from "../Emphasis";

function BurstHearts({ show }) {
  const particles = [
    { x: -16, y: -20, delay: 0, size: 0.7 },
    { x: 14, y: -24, delay: 0.05, size: 0.55 },
    { x: -6, y: -30, delay: 0.08, size: 0.45 },
    { x: 10, y: -14, delay: 0.03, size: 0.6 },
  ];

  return (
    <AnimatePresence>
      {show &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, p.size, 0.2], x: p.x, y: p.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, delay: p.delay, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 text-pink-400"
            aria-hidden="true"
          >
            <HeartIcon className="h-3.5 w-3.5" />
          </motion.span>
        ))}
    </AnimatePresence>
  );
}

function LocationCard({ location, isActive, onSelect, index }) {
  return (
    <div className="relative overflow-visible">
      <motion.button
        type="button"
        onClick={() => onSelect(location.id)}
        initial={{ opacity: 0, y: 28, scale: 0.82, rotate: index % 2 === 0 ? -4 : 4 }}
        animate={{
          opacity: 1,
          y: isActive ? -4 : 0,
          scale: isActive ? 1.04 : 1,
          rotate: 0,
        }}
        transition={{
          delay: isActive ? 0 : 0.12 + index * 0.08,
          type: "spring",
          stiffness: 340,
          damping: 15,
        }}
        whileHover={{
          scale: isActive ? 1.06 : 1.05,
          y: -6,
          rotate: index % 2 === 0 ? -1.5 : 1.5,
        }}
        whileTap={{ scale: 0.92, y: 3, rotate: 0 }}
        aria-pressed={isActive}
        aria-label={location.placeName}
        className={`relative flex w-full items-center gap-2.5 overflow-hidden rounded-[1.4rem] border px-2.5 py-2.5 text-left backdrop-blur-xl ${
          isActive
            ? "border-pink-300/70 bg-white/25 shadow-[0_0_0_3px_rgba(255,182,213,0.35),0_14px_32px_-8px_rgba(255,91,160,0.35)]"
            : "border-white/40 bg-white/10 shadow-[0_8px_32px_-12px_rgba(176,125,255,0.3)]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${location.tint}`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-white/25 blur-sm"
        />

        {isActive && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.12, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-pink-200/35 via-transparent to-purple-200/20"
          />
        )}

        <motion.div
          animate={
            isActive
              ? { y: [0, -6, 0], rotate: [0, -6, 6, 0], scale: [1, 1.08, 1] }
              : { y: [0, -3, 0], rotate: [0, -2, 2, 0] }
          }
          transition={{
            duration: isActive ? 1.8 : 3.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          className="relative z-10 h-16 w-16 shrink-0"
        >
          <Image
            src={location.img}
            alt={location.label}
            fill
            sizes="64px"
            className="object-contain drop-shadow-[0_4px_8px_rgba(176,125,255,0.35)]"
          />
        </motion.div>

        <motion.div
          key={isActive ? `on-${location.id}` : `off-${location.id}`}
          initial={isActive ? { x: -6, opacity: 0.6 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
          className="relative z-10 min-w-0 flex-1"
        >
          <span
            className={`block font-display text-[0.8rem] font-extrabold leading-snug ${
              isActive ? "text-pink-500" : "text-ink"
            }`}
          >
            {location.placeName}
          </span>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 12 }}
            className="pointer-events-none absolute -right-2 -top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-pink-400 text-white shadow-md"
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>

      <BurstHearts show={isActive} />
    </div>
  );
}

export default function StepLocation({ locations = [], selected, onSelect, onNext }) {
  const { t } = useContent();
  const leftCol = locations.filter((l) => l.col === "left");
  const rightCol = locations.filter((l) => l.col === "right");

  return (
    <div className="relative flex h-full w-full flex-col px-4 pb-6 pt-14">
      <Image
        src="/images/background/bg-location.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />

      <div className="relative z-10 mb-2 flex items-center justify-end">
        <motion.div
          animate={{ rotate: [0, 12, -12, 0], y: [0, -4, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <IconBadge icon={Star} gradient="gold" className="h-9 w-9" iconClassName="h-4.5 w-4.5" />
        </motion.div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative z-10 mb-5 text-center"
      >
        <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink">
          <Emphasis text={t("location.title", "Mau *ke mana* kita?")} animate />
          <motion.span
            animate={{ y: [0, -5, 0], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="ml-1 inline-block align-middle"
          >
            <GradientIcon icon={MapPin} className="h-6 w-6" />
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-2.5 mb-2 flex items-center justify-center gap-2.5"
          aria-hidden="true"
        >
          <span className="h-px w-10 bg-pink-300/80" />
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartIcon className="h-3 w-3 text-pink-400" />
          </motion.span>
          <span className="h-px w-10 bg-pink-300/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-semibold text-ink-soft"
        >
          {t("location.subtitle", "Pilih tempat untuk mulai kencan kita")}
        </motion.p>
      </motion.header>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto pb-2 mt-16 scrollbar-none">
        <div className="relative grid grid-cols-2 gap-x-3 px-2.5 pt-2.5">
          <div className="flex flex-col gap-5 pt-1">
            {leftCol.map((location, i) => (
              <LocationCard
                key={location.id}
                location={location}
                isActive={selected === location.id}
                onSelect={onSelect}
                index={i * 2}
              />
            ))}
          </div>
          <div className="flex flex-col gap-5 pt-10">
            {rightCol.map((location, i) => (
              <LocationCard
                key={location.id}
                location={location}
                isActive={selected === location.id}
                onSelect={onSelect}
                index={i * 2 + 1}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-3">
        <Button
          onClick={onNext}
          disabled={!selected}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("location.nextButton", "Jadi Kencan!")}
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
