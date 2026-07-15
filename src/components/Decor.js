"use client";

import { useEffect, useRef, useState } from "react";
import { HeartIcon, SparkleIcon } from "./icons";

function useClientItems(count, make) {
  const [items, setItems] = useState([]);
  const makeRef = useRef(make);
  makeRef.current = make;

  useEffect(() => {
    setItems(Array.from({ length: count }, (_, i) => makeRef.current(i)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return items;
}

const HEART_COLORS = ["#ff9ec7", "#ffb6d5", "#cdaaff", "#ff7ab2", "#ffd0e6"];

export function FloatingHearts({ count = 14 }) {
  const hearts = useClientItems(count, (i) => ({
    id: i,
    left: Math.random() * 100,
    size: 12 + Math.random() * 22,
    duration: 8 + Math.random() * 9,
    delay: Math.random() * 10,
    rot: -30 + Math.random() * 60,
    opacity: 0.5 + Math.random() * 0.5,
    color: HEART_COLORS[i % HEART_COLORS.length],
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px]"
          style={{
            left: `${h.left}%`,
            color: h.color,
            animation: `floatUp ${h.duration}s linear ${h.delay}s infinite`,
            "--float-rot": `${h.rot}deg`,
            "--float-opacity": h.opacity,
          }}
        >
          <HeartIcon style={{ width: h.size, height: h.size }} />
        </span>
      ))}
    </div>
  );
}

export function Sparkles({ count = 12 }) {
  const sparks = useClientItems(count, (i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 8 + Math.random() * 16,
    duration: 1.8 + Math.random() * 2.4,
    delay: Math.random() * 3,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute text-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <SparkleIcon style={{ width: s.size, height: s.size }} />
        </span>
      ))}
    </div>
  );
}

const CONFETTI_COLORS = [
  "#ff7ab2",
  "#ffb6d5",
  "#cdaaff",
  "#b07dff",
  "#ffd166",
  "#7ad7ff",
  "#9bf6c0",
];

export function Confetti({ count = 90 }) {
  const pieces = useClientItems(count, (i) => ({
    id: i,
    left: Math.random() * 100,
    size: 7 + Math.random() * 9,
    duration: 2.6 + Math.random() * 2.6,
    delay: Math.random() * 1.8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: Math.random() > 0.5,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-20px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "999px" : "2px",
            animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
