"use client";

const INDICATOR_STEPS = 4;
const WIDTH = 230;
const HEIGHT = 28;
const HEART = 28;

const HEART_PATH =
  "M14 24.5S5.7 18.5 3.5 13.5 4.5 5.9 8.6 5.3c2.3-.4 4.3 0.9 5.4 2.7 1.1-1.8 3.1-3.1 5.4-2.7 4.1.6 5.7 5.4 3.5 8.2C22.3 18.5 14 24.5 14 24.5z";

function heartX(index) {
  const pad = HEART / 2;
  const gap = (WIDTH - pad * 2) / (INDICATOR_STEPS - 1);
  return pad + index * gap;
}

export default function HeartProgress({ step }) {
  const current = step - 1;
  const midY = HEIGHT / 2;
  const positions = Array.from({ length: INDICATOR_STEPS }, (_, i) => heartX(i));

  return (
    <div className="pointer-events-none absolute inset-x-0 top-5 z-30 flex justify-center px-8">
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
  );
}
