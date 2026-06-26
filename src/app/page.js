"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepOpening from "@/components/steps/StepOpening";
import StepQuestion from "@/components/steps/StepQuestion";
import StepActivity, { ACTIVITIES } from "@/components/steps/StepActivity";
import StepLocation, { LOCATIONS } from "@/components/steps/StepLocation";
import StepFinal from "@/components/steps/StepFinal";
import HeartProgress from "@/components/HeartProgress";

const STEPS = ["opening", "question", "activity", "location", "final"];

const transition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: "easeInOut" },
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState(null);
  const [locationId, setLocationId] = useState(null);

  const go = (n) => setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const activity = ACTIVITIES.find((a) => a.id === activityId);
  const location = LOCATIONS.find((l) => l.id === locationId);

  function restart() {
    setActivityId(null);
    setLocationId(null);
    setStep(0);
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-0 sm:p-6">
      {/* Phone frame */}
      <div
        className={`relative h-dvh w-full max-w-[420px] overflow-hidden sm:h-[850px] sm:rounded-[2.75rem] sm:border-8 sm:border-white sm:shadow-[0_30px_80px_-20px_rgba(176,125,255,0.5)] ${
          step <= 3 ? "" : "bg-white/30 backdrop-blur-sm"
        }`}
      >
        {step >= 1 && <HeartProgress step={step} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step]}
            initial={transition.initial}
            animate={transition.animate}
            exit={transition.exit}
            transition={transition.transition}
            className="absolute inset-0"
          >
            {step === 0 && <StepOpening onNext={next} />}
            {step === 1 && <StepQuestion onYes={next} />}
            {step === 2 && (
              <StepActivity
                selected={activityId}
                onSelect={setActivityId}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <StepLocation
                selected={locationId}
                onSelect={setLocationId}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 4 && (
              <StepFinal
                activity={activity}
                location={location}
                onRestart={restart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
