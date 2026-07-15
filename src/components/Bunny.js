export default function Bunny({ className = "", mood = "happy" }) {
  return (
    <svg
      viewBox="0 0 220 240"
      className={className}
      role="img"
      aria-label="Kelinci lucu membawa hati"
    >
      <defs>
        <radialGradient id="bunnyBody" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffeaf4" />
        </radialGradient>
        <linearGradient id="bunnyHeart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8fc0" />
          <stop offset="100%" stopColor="#ff5ba0" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <g>
        <ellipse cx="82" cy="55" rx="16" ry="46" fill="url(#bunnyBody)" stroke="#ffd0e6" strokeWidth="3" />
        <ellipse cx="138" cy="55" rx="16" ry="46" fill="url(#bunnyBody)" stroke="#ffd0e6" strokeWidth="3" />
        <ellipse cx="82" cy="58" rx="7" ry="32" fill="#ffd6ea" />
        <ellipse cx="138" cy="58" rx="7" ry="32" fill="#ffd6ea" />
      </g>

      {/* Head */}
      <circle cx="110" cy="120" r="68" fill="url(#bunnyBody)" stroke="#ffd0e6" strokeWidth="3" />

      {/* Cheeks */}
      <circle cx="74" cy="135" r="13" fill="#ffc2dd" opacity="0.8" />
      <circle cx="146" cy="135" r="13" fill="#ffc2dd" opacity="0.8" />

      {/* Eyes */}
      <g fill="#6b3a5b">
        <circle cx="88" cy="115" r="7.5" />
        <circle cx="132" cy="115" r="7.5" />
        <circle cx="90.5" cy="112.5" r="2.4" fill="#fff" />
        <circle cx="134.5" cy="112.5" r="2.4" fill="#fff" />
      </g>

      {/* Nose + mouth */}
      <path d="M110 128 l-5 -5 h10 z" fill="#ff7ab2" />
      {mood === "happy" ? (
        <path
          d="M103 136 q7 7 14 0"
          fill="none"
          stroke="#6b3a5b"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M104 140 q6 -6 12 0"
          fill="none"
          stroke="#6b3a5b"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}

      {/* Paws + heart */}
      <g>
        <circle cx="86" cy="196" r="18" fill="url(#bunnyBody)" stroke="#ffd0e6" strokeWidth="3" />
        <circle cx="134" cy="196" r="18" fill="url(#bunnyBody)" stroke="#ffd0e6" strokeWidth="3" />
        <path
          d="M110 215s-22-13-29-26c-4.7-8.6-.6-18.4 9-20.1 5.7-1 11 1.7 14 6.3 3-4.6 8.3-7.3 14-6.3 9.6 1.7 13.7 11.5 9 20.1-7 13-29 26-29 26z"
          fill="url(#bunnyHeart)"
          stroke="#ff4f97"
          strokeWidth="2"
        />
        <circle cx="103" cy="188" r="3.5" fill="#fff" opacity="0.8" />
      </g>
    </svg>
  );
}
