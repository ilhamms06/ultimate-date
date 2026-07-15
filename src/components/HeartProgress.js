"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon } from "./icons";

const INDICATOR_STEPS = 5;
const WIDTH = 200;
const HEIGHT = 28;
const HEART = 26;

const HEART_PATH =
  "M14 24.5S5.7 18.5 3.5 13.5 4.5 5.9 8.6 5.3c2.3-.4 4.3 0.9 5.4 2.7 1.1-1.8 3.1-3.1 5.4-2.7 4.1.6 5.7 5.4 3.5 8.2C22.3 18.5 14 24.5 14 24.5z";

function heartX(index) {
  const pad = HEART / 2;
  const gap = (WIDTH - pad * 2) / (INDICATOR_STEPS - 1);
  return pad + index * gap;
}

export default function HeartProgress({ step, onBack }) {
  const current = step - 1;
  const midY = HEIGHT / 2;
  const positions = Array.from({ length: INDICATOR_STEPS }, (_, i) => heartX(i));

  return (
    <div className="absolute inset-x-0 top-4 z-30 flex items-center px-4">
      <motion.button
        type="button"
        onClick={onBack}
        aria-label="Kembali"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-white/25 shadow-[0_6px_16px_-4px_rgba(255,91,160,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 top-1 h-1/3 rounded-full bg-white/50 blur-[1px]"
        />
        <ArrowLeftIcon className="relative h-5 w-5 text-pink-500" />
      </motion.button>

      <div className="pointer-events-none flex flex-1 justify-center">
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="overflow-visible"
          aria-hidden="true"
        >
          {positions.slice(0, -1).map((x, i) => (
            <line
              key={`seg-${i}`}
              x1={x + HEART * 0.34}
              y1={midY}
              x2={positions[i + 1] - HEART * 0.34}
              y2={midY}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          <polygon
            points={`${WIDTH - 2},${midY} ${WIDTH - 10},${midY - 4} ${WIDTH - 10},${midY + 4}`}
            fill="white"
          />

          {positions.map((x, i) => {
            const filled = i <= current;
            const active = i === current;
            const tx = x - HEART / 2;
            const ty = (HEIGHT - HEART) / 2;

            return (
              <g
                key={i}
                transform={`translate(${tx}, ${ty}) scale(${active ? 1.1 : 1})`}
                style={{ transformOrigin: `${HEART / 2}px ${HEART / 2}px` }}
              >
                <path
                  d={HEART_PATH}
                  fill={filled ? "#ff5ba0" : "rgba(255,255,255,0.5)"}
                  stroke="white"
                  strokeWidth={active ? 3 : 2.5}
                  strokeLinejoin="round"
                />
                {filled && (
                  <path
                    d="M9.5 8.5c1.6-1.1 3.7-.5 4.6 1"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Spacer so hearts stay visually centered with back button on the left */}
      <div className="h-10 w-10 shrink-0" aria-hidden="true" />
    </div>
  );
}
