"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Frown, HeartHandshake, ShieldAlert, HeartCrack, EyeOff } from "lucide-react";
import Button from "../Button";
import { FloatingHearts, Sparkles } from "../Decor";
import { HeartIcon } from "../icons";
import { IconBadge } from "../GradientIcon";
import { useContent } from "../ContentProvider";
import Emphasis from "../Emphasis";

const TOOLTIPS = [
  { key: "question.tooltip.1", fallback: "Yakin nih?", icon: Frown },
  { key: "question.tooltip.2", fallback: "Coba pikir lagi... please?", icon: HeartHandshake },
  { key: "question.tooltip.3", fallback: "Jawaban salah terdeteksi", icon: ShieldAlert },
  { key: "question.tooltip.4", fallback: "Hatiku agak retak nih", icon: HeartCrack },
  { key: "question.tooltip.5", fallback: "Tombolnya menolak ditekan", icon: EyeOff },
];

export default function StepQuestion({ onYes, name }) {
  const { t } = useContent();
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState(null);

  const yesScale = Math.min(1 + dodges * 0.1, 1.55);

  const rabbitSrc =
    dodges === 0
      ? "/images/icon/rabbit-love.png"
      : dodges <= 2
        ? "/images/icon/rabbit-flat.png"
        : "/images/icon/rabbit-sad.png";

  function dodge() {
    const x = (Math.random() - 0.5) * 180;
    const y = (Math.random() - 0.5) * 160;
    setPos({ x, y });
    setTooltip(TOOLTIPS[dodges % TOOLTIPS.length]);
    setDodges((d) => d + 1);
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between px-6 pb-10 pt-16 text-center">
      <Image
        src="/images/background/bg2.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={10} />
      <Sparkles count={8} />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-48 w-48 drop-shadow-[0_18px_28px_rgba(255,91,160,0.35)] sm:h-52 sm:w-52"
          >
            <motion.div
              key={rabbitSrc}
              initial={dodges === 0 ? false : { scale: 0.85, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
              className="absolute inset-0"
            >
              <Image
                src={rabbitSrc}
                alt={t("question.rabbitAlt", "Kelinci lucu membawa hati")}
                fill
                priority
                sizes="208px"
                className="object-contain"
              />
            </motion.div>

            <AnimatePresence>
              {tooltip && (
                <motion.div
                  key={tooltip.key + dodges}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="absolute -top-2 right-0 z-20 sm:right-1"
                >
                  <div className="relative flex items-center gap-1.5 whitespace-nowrap rounded-2xl bg-white/95 px-3 py-1.5 text-sm font-bold text-pink-500 shadow-md">
                    <IconBadge icon={tooltip.icon} className="h-5 w-5" iconClassName="h-3 w-3" />
                    {t(tooltip.key, tooltip.fallback)}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-7 h-3 w-3 rotate-45 rounded-[2px] bg-white/95"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex max-w-sm flex-col items-center text-center"
        >
          <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
            <Emphasis
              text={t("question.title", "Maukah {name} pergi *kencan* denganku?")}
              values={{ name: name || "kamu" }}
              animate
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mt-3 flex items-center justify-center gap-2.5"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-pink-300/80" />
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <HeartIcon className="h-3.5 w-3.5 text-pink-400" />
            </motion.span>
            <span className="h-px w-12 bg-pink-300/80" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm font-semibold text-ink-soft"
          >
            {t("question.subtitle", "Cuma butuh satu jawaban kok, gampang kan?")}
          </motion.p>
        </motion.header>
      </div>

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-3.5">
        <motion.div
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="w-full origin-center"
        >
          <Button onClick={onYes} className="w-full text-2xl tracking-wide">
            {t("question.yesButton", "YA")}
            <HeartIcon className="h-6 w-6" />
          </Button>
        </motion.div>

        <div className="relative h-[58px] w-full">
          <motion.button
            type="button"
            onMouseEnter={dodge}
            onClick={dodge}
            onFocus={dodge}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="absolute left-1/2 top-1 flex min-h-[52px] w-[min(100%,220px)] -translate-x-1/2 items-center justify-center gap-2 rounded-full border-2 border-dashed border-pink-300 bg-white/40 px-7 font-display text-lg font-bold tracking-wide text-pink-500 backdrop-blur-md"
          >
            {t("question.noButton", "TIDAK")}
            <HeartCrack className="h-5 w-5 text-pink-400" strokeWidth={2.4} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
