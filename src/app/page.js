"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepOpening from "@/components/steps/StepOpening";
import StepQuestion from "@/components/steps/StepQuestion";
import StepActivity from "@/components/steps/StepActivity";
import StepLocation from "@/components/steps/StepLocation";
import StepDateTime from "@/components/steps/StepDateTime";
import StepFinal from "@/components/steps/StepFinal";
import HeartProgress from "@/components/HeartProgress";
import { decodeConfig, findLocation, resolveConfig } from "@/lib/dateConfig";

const STEPS = ["opening", "question", "activity", "location", "datetime", "final"];

const transition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35, ease: "easeInOut" },
};

function readRawConfig() {
  if (typeof window === "undefined") return null;
  return decodeConfig(new URLSearchParams(window.location.search).get("d"));
}

export default function Home() {
  const config = useMemo(() => resolveConfig(readRawConfig()), []);
  const { name, activities, locationsByActivity, days, timeSlots } = config;

  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const go = (n) => setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const activity = activities.find((a) => a.id === activityId);
  const locations = activityId ? locationsByActivity[activityId] ?? [] : [];
  const location =
    activityId && locationId
      ? findLocation(locationsByActivity, activityId, locationId)
      : null;

  function handleActivitySelect(id) {
    setActivityId(id);
    setLocationId(null);
  }

  function restart() {
    setActivityId(null);
    setLocationId(null);
    setDate(null);
    setTime(null);
    setStep(0);
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-0 sm:p-6">
      {/* Phone frame */}
      <div
        className={`relative h-dvh w-full max-w-[420px] overflow-hidden sm:h-[850px] sm:rounded-[2.75rem] sm:border-8 sm:border-white sm:shadow-[0_30px_80px_-20px_rgba(176,125,255,0.5)] ${
          step <= 4 ? "" : "bg-white/30 backdrop-blur-sm"
        }`}
      >
        {step >= 1 && <HeartProgress step={step} onBack={back} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step]}
            initial={transition.initial}
            animate={transition.animate}
            exit={transition.exit}
            transition={transition.transition}
            className="absolute inset-0"
          >
            {step === 0 && <StepOpening onNext={next} name={name} />}
            {step === 1 && <StepQuestion onYes={next} name={name} />}
            {step === 2 && (
              <StepActivity
                activities={activities}
                selected={activityId}
                onSelect={handleActivitySelect}
                onNext={next}
              />
            )}
            {step === 3 && (
              <StepLocation
                locations={locations}
                selected={locationId}
                onSelect={setLocationId}
                onNext={next}
              />
            )}
            {step === 4 && (
              <StepDateTime
                days={days}
                timeSlots={timeSlots}
                date={date}
                time={time}
                onDateChange={setDate}
                onTimeChange={setTime}
                onNext={next}
              />
            )}
            {step === 5 && (
              <StepFinal
                activity={activity}
                location={location}
                date={date}
                time={time}
                onRestart={restart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
