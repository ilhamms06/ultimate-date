"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../Button";
import { FloatingHearts } from "../Decor";
import { CheckIcon, ArrowRightIcon, HeartIcon } from "../icons";
import { IconBadge } from "../GradientIcon";
import { ACTIVITY_CATALOG } from "@/lib/dateConfig";
import { useContent } from "../ContentProvider";
import Emphasis from "../Emphasis";

export default function StepActivity({
  activities = ACTIVITY_CATALOG,
  selected,
  onSelect,
  onNext,
}) {
  const { t } = useContent();
  return (
    <div className="relative flex h-full w-full flex-col overflow-visible px-5 py-8">
      <Image
        src="/images/background/bg2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={8} />

      <header className="relative z-10 mb-5 mt-16 text-center">
        <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          <Emphasis text={t("activity.title", "Kencan seperti apa yang *seru*?")} />
          <span className="ml-1 inline-flex items-center gap-0.5 align-middle text-pink-400" aria-hidden="true">
            <HeartIcon className="h-3.5 w-3.5" />
            <HeartIcon className="h-3.5 w-3.5" />
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-[18rem] text-sm font-semibold leading-snug text-ink-soft">
          {t(
            "activity.subtitle",
            "Pilih suasana yang cocok dengan mood-mu dan mari buat tak terlupakan!"
          )}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2.5" aria-hidden="true">
          <span className="h-px w-10 bg-pink-300/80" />
          <HeartIcon className="h-3 w-3 text-pink-400" />
          <span className="h-px w-10 bg-pink-300/80" />
        </div>
      </header>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-2 content-start gap-4 px-4 pb-5 pt-5">
          {activities.map((a, i) => {
          const isActive = selected === a.id;
          return (
            <div
              key={a.id}
              className={`relative overflow-visible ${isActive ? "z-20" : "z-0"}`}
            >
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0.7, 0.35, 0.7], scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -inset-1.5 rounded-4xl bg-pink-400/50 blur-lg"
                  aria-hidden="true"
                />
              )}
              <motion.button
                type="button"
                onClick={() => onSelect(a.id)}
                initial={{ opacity: 0, y: 18, scale: 0.9 }}
                animate={
                  isActive
                    ? { opacity: 1, y: 0, scale: 1, rotate: [0, -3, 3, -2, 0] }
                    : { opacity: 1, y: 0, scale: 1, rotate: 0 }
                }
                transition={{
                  delay: 0.1 + i * 0.07,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  rotate: { type: "tween", duration: 0.5, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.94 }}
                aria-pressed={isActive}
                className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-3xl border p-2 text-center backdrop-blur-md backdrop-saturate-150 transition-colors ${
                  isActive
                    ? "border-pink-300/60 bg-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_0_0_3px_rgba(255,182,213,0.45),0_14px_28px_-10px_rgba(255,91,160,0.6)]"
                    : "border-white/25 bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_8px_20px_-12px_rgba(176,125,255,0.3)]"
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${a.bg} ${
                    isActive ? "opacity-45" : "opacity-25"
                  }`}
                  aria-hidden="true"
                />
                <motion.span
                  animate={
                    isActive
                      ? { scale: [1, 1.18, 1.05, 1.18, 1], y: [0, -6, -2, -6, 0] }
                      : { y: [0, -3, 0] }
                  }
                  transition={{
                    duration: isActive ? 2.6 : 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  {a.img ? (
                    <Image
                      src={a.img}
                      alt={a.label}
                      fill
                      sizes="180px"
                      className="object-contain drop-shadow-[0_6px_10px_rgba(176,125,255,0.35)]"
                    />
                  ) : (
                    <IconBadge
                      icon={a.Icon}
                      className="h-16 w-16"
                      iconClassName="h-8 w-8"
                    />
                  )}
                </motion.span>
              </motion.button>

              {isActive && (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: [0, 1.4, 0.9, 1.15, 1], rotate: [-20, 12, -6, 0] }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="pointer-events-none absolute -right-2.5 -top-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pink-400 text-white shadow-[0_4px_10px_-2px_rgba(255,91,160,0.8)]"
                >
                  <CheckIcon className="h-4 w-4" />
                </motion.span>
              )}
            </div>
          );
        })}
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <Button
          onClick={onNext}
          disabled={!selected}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("activity.nextButton", "Lanjut")}
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
