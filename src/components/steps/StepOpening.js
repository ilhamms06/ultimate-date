"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Bunny from "../Bunny";
import Button from "../Button";
import { FloatingHearts, Sparkles } from "../Decor";
import { ArrowRightIcon } from "../icons";

export default function StepOpening({ onNext }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between px-6 pb-8 pt-12 text-center">
      <Image
        src="/images/background/bg1.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="420px"
      />
      <FloatingHearts count={14} />
      <Sparkles count={10} />

      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10"
      >
        <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-pink-500 shadow-sm backdrop-blur">
          a little something for you 🎀
        </span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.15 }}
          className="animate-floaty drop-shadow-[0_18px_24px_rgba(255,122,178,0.35)]"
        >
          <Bunny className="h-52 w-52" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <h1 className="font-display text-4xl font-extrabold text-pink-500">
            Hey you! 💌
          </h1>
          <p className="font-display text-xl font-bold text-ink">
            I have something important to ask...
          </p>
          <p className="text-base font-semibold text-ink-soft">
            Promise you won&apos;t leave before answering 🥺
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="relative z-10 w-full max-w-xs"
      >
        <Button onClick={onNext} className="w-full text-xl">
          Open the Question
          <ArrowRightIcon className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
