"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Couple from "../Couple";
import Button from "../Button";
import { Confetti, Sparkles } from "../Decor";
import { SaveIcon, ShareIcon } from "../icons";

function buildICS({ activityLabel, locationLabel }) {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  start.setHours(19, 0, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cute Date//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@cute-date`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Our Date - ${activityLabel} 💖`,
    `LOCATION:${locationLabel}`,
    `DESCRIPTION:${activityLabel} at ${locationLabel}. Can't wait! ✨`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function StepFinal({ activity, location, onRestart }) {
  const [toast, setToast] = useState(null);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleSave() {
    const ics = buildICS({
      activityLabel: activity?.label ?? "Date",
      locationLabel: location?.label ?? "",
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "our-date.ics";
    a.click();
    URL.revokeObjectURL(url);
    flash("Saved to your calendar! 📅");
  }

  async function handleShare() {
    const text = `It's a date! ${activity?.emoji ?? ""} ${activity?.label ?? ""} at ${
      location?.label ?? ""
    } ${location?.emoji ?? ""} 💖`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "It's a Date! 💖", text });
      } else {
        await navigator.clipboard.writeText(text);
        flash("Copied to clipboard! 💌");
      }
    } catch {
      flash("Sharing cancelled 🙈");
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between px-6 py-10 text-center">
      <Confetti count={90} />
      <Sparkles count={14} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <h1 className="font-display text-4xl font-extrabold text-pink-500">
          YAYYY! 🎉
        </h1>
        <p className="font-display text-2xl font-extrabold text-ink">
          It&apos;s a Date! 💖
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 11 }}
        className="relative z-10 animate-floaty drop-shadow-[0_18px_24px_rgba(255,122,178,0.35)]"
      >
        <Couple className="h-44 w-64" />
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative z-10 w-full max-w-xs space-y-3 rounded-3xl border-2 border-white/80 bg-white/70 p-4 backdrop-blur"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-pink-50 px-4 py-3">
          <span className="text-sm font-bold text-ink-soft">Activity</span>
          <span className="font-display font-bold text-ink">
            {activity?.emoji} {activity?.label}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-pink-50 px-4 py-3">
          <span className="text-sm font-bold text-ink-soft">Location</span>
          <span className="font-display font-bold text-ink">
            {location?.emoji} {location?.label}
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-xs space-y-3">
        <Button onClick={handleSave} className="w-full">
          <SaveIcon className="h-5 w-5" />
          Save Our Date
        </Button>
        <Button onClick={handleShare} variant="secondary" className="w-full">
          <ShareIcon className="h-5 w-5" />
          Share This Moment
        </Button>
        <button
          onClick={onRestart}
          className="w-full pt-1 text-sm font-bold text-ink-soft underline-offset-4 hover:underline"
        >
          start over 🔁
        </button>
        <p className="pt-1 font-display text-base font-bold text-pink-400">
          Can&apos;t wait! See you soon ✨
        </p>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
