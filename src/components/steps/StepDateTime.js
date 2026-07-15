"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart, Heart as HeartIconLucide } from "lucide-react";
import Button from "../Button";
import { HeartIcon, ArrowRightIcon, CheckIcon } from "../icons";
import { IconBadge } from "../GradientIcon";
import { formatDateLabel } from "@/lib/dateConfig";

function SectionLabel({ children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <HeartIcon className="h-3.5 w-3.5 text-pink-400" />
      <span className="font-display text-sm font-extrabold text-ink">{children}</span>
    </div>
  );
}

function BurstHearts({ show }) {
  const particles = [
    { x: -18, y: -22, delay: 0, size: 0.7 },
    { x: 16, y: -26, delay: 0.05, size: 0.55 },
    { x: -8, y: -34, delay: 0.08, size: 0.45 },
    { x: 10, y: -18, delay: 0.03, size: 0.6 },
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
            transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 text-pink-400"
            aria-hidden="true"
          >
            <HeartIcon className="h-3.5 w-3.5" />
          </motion.span>
        ))}
    </AnimatePresence>
  );
}

function DayCard({ day, isActive, onSelect, index }) {
  return (
    <div className="relative shrink-0 px-0.5 py-1">
      <motion.button
        type="button"
        onClick={() => onSelect(day.value)}
        initial={{ opacity: 0, y: 16, scale: 0.88 }}
        animate={{
          opacity: 1,
          y: isActive ? -2 : 0,
          scale: isActive ? 1.04 : 1,
        }}
        transition={{
          delay: isActive ? 0 : 0.05 + index * 0.04,
          type: "spring",
          stiffness: 380,
          damping: 16,
        }}
        whileHover={{ y: isActive ? -3 : -2, scale: isActive ? 1.05 : 1.03 }}
        whileTap={{ scale: 0.92, y: 2 }}
        aria-pressed={isActive}
        className={`relative flex min-w-18 flex-col items-center gap-0.5 overflow-hidden rounded-2xl px-2.5 py-3 ${
          isActive
            ? "bg-[linear-gradient(165deg,#ff9bc8_0%,#ff5ba0_55%,#f03d8a_100%)] text-white shadow-[0_14px_28px_-10px_rgba(255,91,160,0.85),inset_0_1px_0_rgba(255,255,255,0.45)]"
            : "border border-white/60 bg-white/35 text-ink shadow-[0_6px_16px_-10px_rgba(176,125,255,0.4)] backdrop-blur-md"
        }`}
      >
        {isActive && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-full bg-white/35 blur-[1px]"
          />
        )}

        <span
          className={`relative text-[0.68rem] font-bold uppercase tracking-wide ${
            isActive ? "text-white/95" : "text-ink-soft"
          }`}
        >
          {day.isToday ? "Hari ini" : day.dayName}
        </span>

        <motion.span
          key={isActive ? `on-${day.value}` : `off-${day.value}`}
          initial={isActive ? { scale: 0.6, y: 6 } : false}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 14 }}
          className="relative font-display text-[1.7rem] font-extrabold leading-none"
        >
          {day.dayNum}
        </motion.span>

        <span
          className={`relative text-[0.65rem] font-semibold ${
            isActive ? "text-white/90" : "text-ink-soft"
          }`}
        >
          {day.monthName}
        </span>
      </motion.button>

      <BurstHearts show={isActive} />
    </div>
  );
}

function TimeCard({ slot, isActive, onSelect, index }) {
  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => onSelect(slot.id)}
        initial={{ opacity: 0, y: 14, scale: 0.92 }}
        animate={{
          opacity: 1,
          y: isActive ? -3 : 0,
          scale: isActive ? 1.03 : 1,
        }}
        transition={{
          delay: isActive ? 0 : 0.1 + index * 0.04,
          type: "spring",
          stiffness: 360,
          damping: 16,
        }}
        whileHover={{ y: -4, scale: isActive ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.92, y: 3 }}
        aria-pressed={isActive}
        className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left backdrop-blur-md ${
          isActive
            ? "border-pink-400 bg-[linear-gradient(135deg,rgba(255,143,192,0.55)_0%,rgba(255,255,255,0.55)_100%)] shadow-[0_12px_28px_-10px_rgba(255,91,160,0.55),inset_0_1px_0_rgba(255,255,255,0.65)]"
            : "border-white/55 bg-white/25 shadow-[0_6px_16px_-10px_rgba(176,125,255,0.35)]"
        }`}
      >
        <motion.span
          animate={
            isActive
              ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[0_4px_10px_-4px_rgba(255,91,160,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] ${
            isActive
              ? "bg-[linear-gradient(160deg,#ff9bc8_0%,#ff5ba0_60%,#f03d8a_100%)]"
              : "bg-[linear-gradient(160deg,#ffffff_0%,#ffe7f2_60%,#ffd0e6_100%)]"
          }`}
        >
          <slot.Icon
            className={isActive ? "h-5 w-5 text-white" : "h-5 w-5 text-pink-500"}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </motion.span>

        <div className="relative min-w-0 flex-1">
          <motion.span
            key={isActive ? `t-on-${slot.id}` : `t-off-${slot.id}`}
            initial={isActive ? { scale: 0.85, x: -4 } : false}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 15 }}
            className={`block font-display text-xl font-extrabold leading-none ${
              isActive ? "text-pink-500" : "text-ink"
            }`}
          >
            {slot.label}
          </motion.span>
          <span
            className={`mt-0.5 block text-[0.7rem] font-semibold ${
              isActive ? "text-pink-400" : "text-ink-soft"
            }`}
          >
            {slot.part}
          </span>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-400 text-white shadow-md"
            >
              <CheckIcon className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <BurstHearts show={isActive} />
    </div>
  );
}

export default function StepDateTime({
  days = [],
  timeSlots = [],
  date,
  time,
  onDateChange,
  onTimeChange,
  onNext,
}) {
  const canContinue = Boolean(date && time);
  const summary =
    date && time
      ? `${formatDateLabel(date)} · ${time}`
      : "Pilih hari & waktu";

  return (
    <div className="relative flex h-full w-full flex-col px-4 pb-5 pt-14">
      <Image
        src="/images/background/bg-date.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="420px"
      />

      <div className="relative z-10 mb-1 flex items-center justify-end">
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <IconBadge icon={CalendarHeart} className="h-9 w-9" iconClassName="h-4.5 w-4.5" />
        </motion.div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative z-10 mb-4 text-center"
      >
        <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink">
          Kapan kita{" "}
          <motion.em
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block font-serif italic font-medium text-pink-500"
          >
            ketemu
          </motion.em>
          ?
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
          Pilih hari, lalu waktunya.
        </motion.p>
      </motion.header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_16px_40px_-20px_rgba(255,91,160,0.35)] backdrop-blur-xl scrollbar-none">
        <section className="mb-5">
          <SectionLabel>Pilih hari</SectionLabel>
          <div className="flex gap-2 overflow-x-auto px-1.5 pb-3 pt-2 scrollbar-none">
            {days.map((d, i) => (
              <DayCard
                key={d.value}
                day={d}
                isActive={date === d.value}
                onSelect={onDateChange}
                index={i}
              />
            ))}
          </div>
        </section>

        <section className="mb-4">
          <SectionLabel>Pilih waktu</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5 px-0.5 pt-1">
            {timeSlots.map((slot, i) => (
              <TimeCard
                key={slot.id}
                slot={slot}
                isActive={time === slot.id}
                onSelect={onTimeChange}
                index={i}
              />
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={canContinue ? summary : "hint"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mb-1 flex items-center gap-2.5 rounded-2xl bg-pink-100/70 px-3.5 py-2.5 backdrop-blur-sm"
          >
            <IconBadge icon={HeartIconLucide} className="h-7 w-7" iconClassName="h-3.5 w-3.5" />
            {canContinue ? (
              <p className="font-display text-sm font-extrabold leading-snug text-ink">
                {summary}
              </p>
            ) : (
              <p className="text-[0.72rem] font-semibold leading-snug text-ink-soft">
                Santai saja, momen yang tepat membuatnya lebih spesial.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-3">
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Jadi Kencan!
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
