import {
  UtensilsCrossed,
  Clapperboard,
  Trees,
  Coffee,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles as SparklesIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Catalog — the fixed set of things that have art assets.
 * Config only stores ids/text; icons & images are resolved from here.
 * ------------------------------------------------------------------ */

export const ACTIVITY_CATALOG = [
  {
    id: "dinner",
    label: "Kencan Makan Malam",
    Icon: UtensilsCrossed,
    img: "/images/icon/dinner-date.png",
    bg: "bg-linear-to-br from-amber-100 via-orange-50 to-rose-100",
  },
  {
    id: "movie",
    label: "Kencan Nonton",
    Icon: Clapperboard,
    img: "/images/icon/movie-date.png",
    bg: "bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-100",
  },
  {
    id: "park",
    label: "Jalan di Taman",
    Icon: Trees,
    img: "/images/icon/park-date.png",
    bg: "bg-linear-to-br from-lime-100 via-green-50 to-emerald-100",
  },
  {
    id: "coffee",
    label: "Kencan Ngopi",
    Icon: Coffee,
    img: "/images/icon/coffe-date.png",
    bg: "bg-linear-to-br from-amber-200 via-orange-50 to-rose-100",
  },
];

export function getActivity(id) {
  return ACTIVITY_CATALOG.find((a) => a.id === id) ?? null;
}

/* Soft, uniform tint for every location card — icons come from the
 * parent activity, so places no longer carry their own type/art. */
const LOCATION_TINT = "from-pink-200/25 via-white/10 to-rose-200/10";

export const TIME_SLOT_CATALOG = [
  { id: "10:00", label: "10:00", part: "Pagi", Icon: Sunrise },
  { id: "13:00", label: "13:00", part: "Siang", Icon: UtensilsCrossed },
  { id: "16:00", label: "16:00", part: "Sore", Icon: Sun },
  { id: "18:00", label: "18:00", part: "Senja", Icon: Sunset },
  { id: "19:30", label: "19:30", part: "Malam", Icon: Moon },
  { id: "21:00", label: "21:00", part: "Larut malam", Icon: SparklesIcon },
];

/* Default locations — reproduces the original hardcoded demo data so a
 * bare "/" (no config) still behaves exactly as before. */
export const DEFAULT_LOCATIONS = {
  dinner: [
    { n: "Blok M Plaza", t: "mall" },
    { n: "Pacific Place", t: "mall" },
    { n: "Grand Indonesia", t: "mall" },
    { n: "Pondok Indah Mall", t: "mall" },
  ],
  movie: [
    { n: "Blok M XXI", t: "cinema" },
    { n: "Grand Indonesia XXI", t: "cinema" },
    { n: "Pondok Indah XXI", t: "cinema" },
    { n: "FX Sudirman XXI", t: "cinema" },
    { n: "Kemang Village XXI", t: "cinema" },
  ],
  park: [
    { n: "Taman Suropati", t: "mall" },
    { n: "Taman GBK", t: "mall" },
    { n: "Taman Menteng", t: "mall" },
    { n: "Taman Tebet Eco Park", t: "mall" },
  ],
  coffee: [
    { n: "Kopi Kenangan", t: "mall" },
    { n: "Fore Coffee", t: "mall" },
    { n: "Starbucks Reserve", t: "mall" },
    { n: "Tuku Kebayoran", t: "mall" },
    { n: "Djournal Coffee", t: "mall" },
  ],
};

/* ------------------------------------------------------------------ *
 * Dates
 * ------------------------------------------------------------------ */

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/** List of the next `count` calendar days as ISO strings. */
export function upcomingISO(count = 14) {
  const today = startOfToday();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return toISO(d);
  });
}

/** Turn ISO date strings into the day-card objects the UI renders. */
export function buildDayObjects(isoList) {
  const todayISO = toISO(startOfToday());
  return isoList.map((value) => {
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return {
      value,
      dayName: DAY_NAMES[date.getDay()],
      dayNum: d,
      monthName: MONTH_NAMES[m - 1],
      isToday: value === todayISO,
    };
  });
}

export function formatDateLabel(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES[date.getDay()]}, ${d} ${MONTH_NAMES[m - 1]}`;
}

export function formatDayLong(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES[date.getDay()]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

/* ------------------------------------------------------------------ *
 * Config encode / decode  (base64url of JSON, lives in ?d=)
 * ------------------------------------------------------------------ */

function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeConfig(cfg) {
  return b64urlEncode(JSON.stringify(cfg));
}

export function decodeConfig(str) {
  if (!str) return null;
  try {
    const parsed = JSON.parse(b64urlDecode(str));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Resolve raw config → fully-hydrated objects the receiver renders.
 * Falls back to the original demo data when a field is missing.
 * ------------------------------------------------------------------ */

function resolveLocations(list, keyPrefix, activity) {
  return (list ?? [])
    .filter((l) => l && (l.n ?? l.placeName))
    .map((l, index) => ({
      id: `${keyPrefix}-${index}`,
      placeName: l.n ?? l.placeName,
      label: activity?.label ?? "",
      img: activity?.img,
      tint: LOCATION_TINT,
      col: index % 2 === 0 ? "left" : "right",
      row: Math.floor(index / 2),
    }));
}

export function resolveConfig(raw, catalog = ACTIVITY_CATALOG) {
  const cfg = raw ?? {};
  const lookup = (id) => catalog.find((a) => a.id === id) ?? null;

  const activityIds =
    Array.isArray(cfg.acts) && cfg.acts.length
      ? cfg.acts.filter((id) => lookup(id))
      : catalog.map((a) => a.id);

  const activities = activityIds.map((id) => lookup(id)).filter(Boolean);

  const rawLocs = cfg.locs ?? DEFAULT_LOCATIONS;
  const locationsByActivity = {};
  activityIds.forEach((id) => {
    locationsByActivity[id] = resolveLocations(rawLocs[id], id, lookup(id));
  });

  const todayISO = toISO(startOfToday());
  let dayISO;
  if (Array.isArray(cfg.days) && cfg.days.length) {
    dayISO = cfg.days.filter((v) => v >= todayISO).sort();
    if (!dayISO.length) dayISO = cfg.days.slice().sort(); // all past → still show them
  } else {
    dayISO = upcomingISO(7);
  }
  const days = buildDayObjects(dayISO);

  const timeIds =
    Array.isArray(cfg.times) && cfg.times.length
      ? cfg.times.filter((id) => TIME_SLOT_CATALOG.some((s) => s.id === id))
      : TIME_SLOT_CATALOG.map((s) => s.id);
  const timeSlots = TIME_SLOT_CATALOG.filter((s) => timeIds.includes(s.id));

  return {
    name: (cfg.to ?? "").trim(),
    activities,
    locationsByActivity,
    days,
    timeSlots,
  };
}

export function findLocation(locationsByActivity, activityId, locationId) {
  return (
    (locationsByActivity[activityId] ?? []).find((l) => l.id === locationId) ??
    null
  );
}
