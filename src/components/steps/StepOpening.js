"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, HeartHandshake } from "lucide-react";
import Button from "../Button";
import { FloatingHearts, Sparkles } from "../Decor";
import { ArrowRightIcon, HeartIcon } from "../icons";
import { GradientIcon } from "../GradientIcon";

const stripeStyle = {
  backgroundImage:
    "repeating-linear-gradient(135deg, var(--pink-300) 0 8px, #fff 8px 16px, var(--purple-300) 16px 24px, #fff 24px 32px)",
};

export default function StepOpening({ onNext }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-10 text-center">
      <Image
        src="/images/background/bg1.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={10} />
      <Sparkles count={8} />

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.1 }}
          className="animate-floaty relative z-20 -mb-6 h-40 w-40"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,182,213,0.6)_55%,transparent_78%)] blur-md"
          />
          <Image
            src="/images/icon/rabbit-love.png"
            alt="Kelinci lucu membawa hati"
            fill
            sizes="160px"
            className="relative object-contain drop-shadow-[0_14px_20px_rgba(255,122,178,0.45)]"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 180, damping: 18 }}
          className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 pb-7 pt-12 shadow-[0_24px_50px_-20px_rgba(255,91,160,0.5)] backdrop-blur-xl"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-3"
            style={stripeStyle}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-3"
            style={stripeStyle}
          />

          <div className="relative px-6">
            <h1 className="flex items-center justify-center gap-2 font-display text-[1.9rem] font-extrabold leading-tight text-ink">
              Hei <span className="text-pink-500">kamu!</span>
              <GradientIcon icon={Mail} className="h-7 w-7 shrink-0" />
            </h1>
            <p className="mt-2 font-display text-base font-extrabold text-ink">
              Ada yang penting yang mau aku tanyakan...
            </p>

            <div
              className="mb-4 mt-4 flex items-center justify-center gap-2.5"
              aria-hidden="true"
            >
              <span className="h-px w-9 bg-pink-300/70" />
              <HeartIcon className="h-3 w-3 text-pink-400" />
              <span className="h-px w-9 bg-pink-300/70" />
            </div>

            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-soft">
              Janji jangan pergi sebelum menjawab ya
              <GradientIcon icon={HeartHandshake} className="h-4 w-4 shrink-0" />
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-20 -mt-6 w-[85%]"
        >
          <Button onClick={onNext} className="w-full text-lg">
            Buka Pertanyaannya
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
