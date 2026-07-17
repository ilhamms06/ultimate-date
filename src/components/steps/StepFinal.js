"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PartyPopper, Building2, CalendarHeart, Send } from "lucide-react";
import Button from "../Button";
import { Confetti, Sparkles, FloatingHearts } from "../Decor";
import { SaveIcon, PinIcon, UtensilsIcon, ClockIcon, HeartIcon } from "../icons";
import { IconBadge } from "../GradientIcon";
import { formatDateLabel } from "@/lib/dateConfig";
import { useContent } from "../ContentProvider";
import Emphasis from "../Emphasis";

function fill(tpl, values) {
  return String(tpl).replace(/\{(\w+)\}/g, (_, k) =>
    values[k] != null ? values[k] : ""
  );
}

function resolveStart(date, time) {
  if (date && time) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  }
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 7);
  fallback.setHours(19, 0, 0, 0);
  return fallback;
}

function buildICS({ summary, description, locationLabel, date, time }) {
  const start = resolveStart(date, time);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cute Date//ID",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@cute-date`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${locationLabel}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function CalendarDecor({ className = "" }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="8" width="32" height="32" rx="7" fill="#ff8fbf" />
      <rect x="6" y="14" width="28" height="24" rx="5" fill="#fff5f9" />
      <rect x="10" y="4" width="5" height="10" rx="2.5" fill="#ff5ba0" />
      <rect x="25" y="4" width="5" height="10" rx="2.5" fill="#ff5ba0" />
      <path
        d="M20 22.2c-.9-1.4-2.7-1.8-3.9-.8-1.2 1-.9 2.7.4 3.8L20 28.2l3.5-3c1.3-1.1 1.6-2.8.4-3.8-1.2-1-3-0.6-3.9.8z"
        fill="#ff5ba0"
      />
    </svg>
  );
}

function SummaryRow({ icon, label, value, decoration }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 first:pt-1 last:pb-1">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(160deg,#ff9bc8_0%,#ff5ba0_60%,#f03d8a_100%)] text-white shadow-[0_6px_16px_-4px_rgba(255,91,160,0.55),inset_0_1px_0_rgba(255,255,255,0.55)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 top-1 h-1/3 rounded-full bg-white/35 blur-[1px]"
        />
        <span className="relative">{icon}</span>
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[0.72rem] font-semibold text-[#b08aa0]">{label}</p>
        <p className="mt-0.5 text-[0.95rem] font-extrabold leading-snug text-[#5c2d4a]">
          {value}
        </p>
      </div>
      {decoration ? (
        <div className="flex shrink-0 items-center justify-center">{decoration}</div>
      ) : null}
    </div>
  );
}

export default function StepFinal({ activity, location, date, time, onRestart }) {
  const { t } = useContent();
  const [toast, setToast] = useState(null);
  const dateLabel = formatDateLabel(date);

  function flash(message, icon) {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 2200);
  }

  function handleSave() {
    const activityLabel = activity?.label ?? "Kencan";
    const locationLabel = location?.placeName ?? location?.label ?? "";
    const values = { activityLabel, locationLabel };
    const ics = buildICS({
      summary: fill(t("final.icsSummary", "Kencan Kita - {activityLabel}"), values),
      description: fill(
        t("final.icsDescription", "{activityLabel} di {locationLabel}. Tidak sabar!"),
        values
      ),
      locationLabel,
      date,
      time,
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kencan-kita.ics";
    a.click();
    URL.revokeObjectURL(url);
    flash(t("final.saveToast", "Tersimpan ke kalender!"), CalendarHeart);
  }

  const whenValue =
    dateLabel || time
      ? `${dateLabel}${dateLabel && time ? " • " : ""}${time ?? ""}`
      : "—";

  function handleSend() {
    const activityLabel = activity?.label ?? "-";
    const locationLabel = location?.placeName ?? location?.label ?? "-";
    const message = [
      t("final.shareIntro", "Aku udah pilih kencan kita! 💕"),
      "",
      `${t("final.rowActivity", "Aktivitas")}: ${activityLabel}`,
      `${t("final.rowLocation", "Lokasi")}: ${locationLabel}`,
      `${t("final.rowTime", "Waktu")}: ${whenValue}`,
    ].join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const ActivityIcon = activity?.Icon;
  const activityValue = activity ? (
    <span className="inline-flex items-center gap-1.5">
      {ActivityIcon && (
        <ActivityIcon className="h-4 w-4 shrink-0 text-pink-400" strokeWidth={2.4} />
      )}
      {activity.label}
    </span>
  ) : (
    "—"
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-start px-5 pb-8 pt-16 text-center">
      <Image
        src="/images/background/bg2.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="420px"
      />
      <Confetti count={70} />
      <Sparkles count={12} />
      <FloatingHearts count={8} />

      <motion.header
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative z-10 text-center mt-24"
      >
        <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink">
          <Emphasis text={t("final.title", "Yeay, kita *jadi* kencan!")} animate />
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
          {t("final.subtitle", "Tinggal datang pas harinya, sisanya udah beres.")}
        </motion.p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/25 px-5 py-5 shadow-[0_18px_40px_-16px_rgba(255,91,160,0.35)] backdrop-blur-xl backdrop-saturate-150 mt-16"
      >
        <div className="divide-y divide-white/40">
          <SummaryRow
            icon={<UtensilsIcon className="h-5 w-5" />}
            label={t("final.rowActivity", "Aktivitas")}
            value={activityValue}
            decoration={
              <span className="flex items-center -space-x-1 text-pink-400">
                <HeartIcon className="h-5 w-5 drop-shadow-sm" />
                <HeartIcon className="h-4 w-4 translate-y-0.5 opacity-90" />
              </span>
            }
          />
          <SummaryRow
            icon={<PinIcon className="h-5 w-5" />}
            label={t("final.rowLocation", "Lokasi")}
            value={location?.placeName ?? location?.label ?? "—"}
            decoration={
              location?.img ? (
                <Image
                  src={location.img}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain drop-shadow-sm"
                />
              ) : (
                <IconBadge
                  icon={Building2}
                  gradient="purple"
                  className="h-11 w-11"
                  iconClassName="h-5 w-5"
                />
              )
            }
          />
          <SummaryRow
            icon={<ClockIcon className="h-5 w-5" />}
            label={t("final.rowTime", "Waktu")}
            value={whenValue}
            decoration={<CalendarDecor className="h-11 w-10 drop-shadow-sm" />}
          />
        </div>
      </motion.div>

      <div className="relative z-10 mt-auto w-full max-w-sm space-y-2">
        <Button onClick={handleSend} className="w-full">
          <Send className="h-5 w-5" />
          {t("final.sendButton", "Kirim ke Dia")}
        </Button>
        <Button onClick={handleSave} variant="secondary" className="w-full">
          <SaveIcon className="h-5 w-5 text-pink-500" />
          {t("final.saveButton", "Simpan ke Kalender")}
        </Button>
        <button
          onClick={onRestart}
          className="w-full pt-1 text-xs font-semibold text-ink-soft/70 underline-offset-4 hover:underline"
        >
          {t("final.restartLink", "mulai ulang")}
        </button>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-lg"
        >
          {toast.icon && <toast.icon className="h-4 w-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />}
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
