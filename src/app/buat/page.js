"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Plus,
  X,
  Check,
  Copy,
  Link2,
  ExternalLink,
  Share2,
  Wand2,
  MapPin,
  CalendarHeart,
} from "lucide-react";
import Button from "@/components/Button";
import { IconBadge } from "@/components/GradientIcon";
import { HeartIcon } from "@/components/icons";
import {
  ACTIVITY_CATALOG,
  PLACE_TYPE_OPTIONS,
  TIME_SLOT_CATALOG,
  upcomingISO,
  buildDayObjects,
  encodeConfig,
} from "@/lib/dateConfig";

const DAY_OPTIONS = buildDayObjects(upcomingISO(14));
const DEFAULT_TYPE = PLACE_TYPE_OPTIONS[0].id;

function SectionHeader({ icon, step, title, subtitle }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <IconBadge icon={icon} className="h-9 w-9" iconClassName="h-4.5 w-4.5" />
      <div className="min-w-0">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-pink-400">
          Langkah {step}
        </p>
        <h2 className="font-display text-lg font-extrabold leading-tight text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs font-semibold text-ink-soft">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/30 p-4 shadow-[0_16px_36px_-20px_rgba(255,91,160,0.35)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      {children}
    </section>
  );
}

export default function SetupPage() {
  const [to, setTo] = useState("");
  const [acts, setActs] = useState([]);
  const [locsByAct, setLocsByAct] = useState({});
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  function toggleActivity(id) {
    setActs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id);
      }
      // seed one empty location row for a freshly-added activity
      setLocsByAct((m) =>
        m[id]?.length ? m : { ...m, [id]: [{ n: "", t: DEFAULT_TYPE }] }
      );
      return [...prev, id];
    });
    setLink("");
  }

  function updateLoc(actId, index, patch) {
    setLocsByAct((m) => {
      const list = (m[actId] ?? []).map((l, i) =>
        i === index ? { ...l, ...patch } : l
      );
      return { ...m, [actId]: list };
    });
    setLink("");
  }

  function addLoc(actId) {
    setLocsByAct((m) => ({
      ...m,
      [actId]: [...(m[actId] ?? []), { n: "", t: DEFAULT_TYPE }],
    }));
    setLink("");
  }

  function removeLoc(actId, index) {
    setLocsByAct((m) => ({
      ...m,
      [actId]: (m[actId] ?? []).filter((_, i) => i !== index),
    }));
    setLink("");
  }

  function toggleFrom(setter) {
    return (value) => {
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
      setLink("");
    };
  }
  const toggleDay = toggleFrom(setDays);
  const toggleTime = toggleFrom(setTimes);

  const orderedActs = ACTIVITY_CATALOG.filter((a) => acts.includes(a.id));

  const config = useMemo(() => {
    const locs = {};
    orderedActs.forEach((a) => {
      const list = (locsByAct[a.id] ?? [])
        .map((l) => ({ n: l.n.trim(), t: l.t }))
        .filter((l) => l.n);
      if (list.length) locs[a.id] = list;
    });
    return {
      to: to.trim(),
      acts: orderedActs.map((a) => a.id),
      locs,
      days: [...days].sort(),
      times: TIME_SLOT_CATALOG.filter((s) => times.includes(s.id)).map(
        (s) => s.id
      ),
    };
  }, [to, orderedActs, locsByAct, days, times]);

  const missing = [];
  if (!config.to) missing.push("nama penerima");
  if (!config.acts.length) missing.push("minimal 1 aktivitas");
  const actsMissingLoc = orderedActs.filter((a) => !config.locs[a.id]);
  if (actsMissingLoc.length)
    missing.push(`lokasi untuk ${actsMissingLoc.map((a) => a.label).join(", ")}`);
  if (!config.days.length) missing.push("minimal 1 hari");
  if (!config.times.length) missing.push("minimal 1 jam");
  const canGenerate = missing.length === 0;

  function generate() {
    if (!canGenerate) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/?d=${encodeConfig(config)}`;
    setLink(url);
    setCopied(false);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document
          .getElementById("link-result")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function shareLink() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Undangan Kencan",
          text: `Hei ${config.to}, ada sesuatu buat kamu 💌`,
          url: link,
        });
      } else {
        copyLink();
      }
    } catch {
      /* dibatalkan */
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-0 sm:p-6">
      <div className="relative h-dvh w-full max-w-[420px] overflow-hidden bg-white/10 sm:h-[850px] sm:rounded-[2.75rem] sm:border-8 sm:border-white sm:shadow-[0_30px_80px_-20px_rgba(176,125,255,0.5)]">
        <Image
          src="/images/background/bg1.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="420px"
        />

        <div className="relative z-10 flex h-full flex-col overflow-y-auto px-5 pb-10 pt-12 scrollbar-none">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mb-6 text-center"
          >
            <div className="mb-2 flex justify-center">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0], y: [0, -4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <IconBadge
                  icon={Wand2}
                  gradient="purple"
                  className="h-11 w-11"
                  iconClassName="h-5 w-5"
                />
              </motion.div>
            </div>
            <h1 className="font-serif text-[1.85rem] font-semibold leading-tight tracking-tight text-ink">
              Bikin undangan{" "}
              <span className="font-serif italic font-medium text-pink-500">
                kencan
              </span>
            </h1>
            <div
              className="mt-2.5 mb-2 flex items-center justify-center gap-2.5"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-pink-300/80" />
              <HeartIcon className="h-3 w-3 text-pink-400" />
              <span className="h-px w-10 bg-pink-300/80" />
            </div>
            <p className="text-sm font-semibold text-ink-soft">
              Atur pilihannya, lalu kirim link ke dia.
            </p>
          </motion.header>

          <div className="space-y-4">
            {/* 1. Name */}
            <Panel>
              <SectionHeader
                icon={User}
                step={1}
                title="Buat siapa nih?"
                subtitle="Nama yang bakal muncul di undangannya."
              />
              <input
                type="text"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setLink("");
                }}
                maxLength={24}
                placeholder="Nama penerima…"
                className="w-full rounded-2xl border border-white/70 bg-white/60 px-4 py-3 font-display text-base font-bold text-ink placeholder:font-semibold placeholder:text-ink-soft/60 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/50"
              />
            </Panel>

            {/* 2. Activities */}
            <Panel>
              <SectionHeader
                icon={ACTIVITY_CATALOG[0].Icon}
                step={2}
                title="Pilihan aktivitas"
                subtitle="Aktivitas apa aja yang bisa dia pilih."
              />
              <div className="grid grid-cols-2 gap-2.5">
                {ACTIVITY_CATALOG.map((a) => {
                  const active = acts.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleActivity(a.id)}
                      aria-pressed={active}
                      className={`relative flex items-center gap-2 overflow-hidden rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-pink-300/80 bg-white/45 shadow-[0_0_0_2px_rgba(255,182,213,0.5)]"
                          : "border-white/40 bg-white/15"
                      } backdrop-blur-md`}
                    >
                      <span
                        className={`pointer-events-none absolute inset-0 ${a.bg} ${
                          active ? "opacity-40" : "opacity-15"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="relative h-9 w-9 shrink-0">
                        <Image
                          src={a.img}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-contain drop-shadow-[0_3px_6px_rgba(176,125,255,0.35)]"
                        />
                      </span>
                      <span className="relative min-w-0 flex-1 font-display text-xs font-extrabold leading-tight text-ink">
                        {a.label}
                      </span>
                      {active && (
                        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-400 text-white shadow-sm">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Panel>

            {/* 3. Locations per activity */}
            <AnimatePresence initial={false}>
              {orderedActs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Panel>
                    <SectionHeader
                      icon={MapPin}
                      step={3}
                      title="Tempatnya di mana?"
                      subtitle="Isi pilihan lokasi untuk tiap aktivitas."
                    />
                    <div className="space-y-4">
                      {orderedActs.map((a) => (
                        <div key={a.id}>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="relative h-6 w-6 shrink-0">
                              <Image
                                src={a.img}
                                alt=""
                                fill
                                sizes="24px"
                                className="object-contain"
                              />
                            </span>
                            <span className="font-display text-sm font-extrabold text-ink">
                              {a.label}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {(locsByAct[a.id] ?? []).map((loc, i) => (
                              <div
                                key={i}
                                className="rounded-2xl border border-white/60 bg-white/45 p-2"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={loc.n}
                                    onChange={(e) =>
                                      updateLoc(a.id, i, { n: e.target.value })
                                    }
                                    maxLength={40}
                                    placeholder="Nama tempat…"
                                    className="min-w-0 flex-1 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-bold text-ink placeholder:font-semibold placeholder:text-ink-soft/60 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/40"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeLoc(a.id, i)}
                                    aria-label="Hapus tempat"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-ink-soft transition-colors hover:text-pink-500"
                                  >
                                    <X className="h-4 w-4" strokeWidth={2.6} />
                                  </button>
                                </div>
                                <div className="mt-2 flex gap-1.5">
                                  {PLACE_TYPE_OPTIONS.map((pt) => {
                                    const on = loc.t === pt.id;
                                    return (
                                      <button
                                        key={pt.id}
                                        type="button"
                                        onClick={() =>
                                          updateLoc(a.id, i, { t: pt.id })
                                        }
                                        aria-pressed={on}
                                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold transition-colors ${
                                          on
                                            ? "border-pink-300 bg-pink-100/80 text-pink-500"
                                            : "border-white/70 bg-white/40 text-ink-soft"
                                        }`}
                                      >
                                        <span className="relative h-4 w-4">
                                          <Image
                                            src={pt.img}
                                            alt=""
                                            fill
                                            sizes="16px"
                                            className="object-contain"
                                          />
                                        </span>
                                        {pt.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => addLoc(a.id)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-pink-300 bg-white/40 px-3 py-1.5 text-xs font-bold text-pink-500 transition-colors hover:bg-white/70"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.8} />
                            Tambah tempat
                          </button>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 4. Days + times */}
            <Panel>
              <SectionHeader
                icon={CalendarHeart}
                step={4}
                title="Kapan kamu bisa?"
                subtitle="Pilih hari & jam yang kamu available."
              />

              <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                Hari
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {DAY_OPTIONS.map((d) => {
                  const on = days.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      aria-pressed={on}
                      className={`flex w-14 flex-col items-center rounded-2xl border px-1 py-2 transition-colors ${
                        on
                          ? "border-pink-300 bg-[linear-gradient(165deg,#ff9bc8_0%,#ff5ba0_100%)] text-white shadow-[0_8px_18px_-8px_rgba(255,91,160,0.7)]"
                          : "border-white/60 bg-white/40 text-ink"
                      }`}
                    >
                      <span
                        className={`text-[0.6rem] font-bold uppercase ${
                          on ? "text-white/90" : "text-ink-soft"
                        }`}
                      >
                        {d.isToday ? "Ini" : d.dayName}
                      </span>
                      <span className="font-display text-lg font-extrabold leading-none">
                        {d.dayNum}
                      </span>
                      <span
                        className={`text-[0.58rem] font-semibold ${
                          on ? "text-white/90" : "text-ink-soft"
                        }`}
                      >
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                Jam
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOT_CATALOG.map((slot) => {
                  const on = times.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleTime(slot.id)}
                      aria-pressed={on}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-colors ${
                        on
                          ? "border-pink-300 bg-white/55 shadow-[0_0_0_2px_rgba(255,182,213,0.5)]"
                          : "border-white/50 bg-white/25"
                      } backdrop-blur-md`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          on
                            ? "bg-[linear-gradient(160deg,#ff9bc8_0%,#ff5ba0_100%)]"
                            : "bg-white/60"
                        }`}
                      >
                        <slot.Icon
                          className={on ? "h-4 w-4 text-white" : "h-4 w-4 text-pink-500"}
                          strokeWidth={2.2}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-extrabold leading-none text-ink">
                          {slot.label}
                        </span>
                        <span className="text-[0.65rem] font-semibold text-ink-soft">
                          {slot.part}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            {/* Generate */}
            <div className="pt-1">
              <Button
                onClick={generate}
                disabled={!canGenerate}
                className="w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wand2 className="h-5 w-5" />
                Buat Link Undangan
              </Button>
              {!canGenerate && (
                <p className="mt-2 text-center text-xs font-semibold text-ink-soft">
                  Lengkapi dulu: {missing.join(", ")}.
                </p>
              )}
            </div>

            {/* Result */}
            <AnimatePresence>
              {link && (
                <motion.div
                  id="link-result"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <Panel className="bg-white/45">
                    <div className="mb-2 flex items-center gap-2">
                      <IconBadge
                        icon={Link2}
                        className="h-7 w-7"
                        iconClassName="h-3.5 w-3.5"
                      />
                      <span className="font-display text-sm font-extrabold text-ink">
                        Link siap dibagikan!
                      </span>
                    </div>
                    <div className="mb-3 truncate rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-ink-soft">
                      {link}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyLink} className="flex-1">
                        {copied ? (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                        {copied ? "Tersalin!" : "Salin"}
                      </Button>
                      <Button
                        onClick={shareLink}
                        variant="secondary"
                        className="flex-1"
                      >
                        <Share2 className="h-5 w-5 text-pink-500" />
                        Bagikan
                      </Button>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-ink-soft underline-offset-4 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Lihat pratinjau undangan
                    </a>
                  </Panel>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
