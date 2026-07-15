export default function Couple({ className = "" }) {
  return (
    <svg
      viewBox="0 0 260 200"
      className={className}
      role="img"
      aria-label="Pasangan lucu yang sedang jatuh cinta"
    >
      <defs>
        <radialGradient id="cBody" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffeaf4" />
        </radialGradient>
        <linearGradient id="cHeart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8fc0" />
          <stop offset="100%" stopColor="#ff5ba0" />
        </linearGradient>
      </defs>

      {/* floating heart between them */}
      <path
        d="M130 38s-12-7-16-14c-2.6-4.7-.3-10 5-11 3.1-.6 6 .9 7.6 3.4 1.6-2.5 4.5-4 7.6-3.4 5.3 1 7.6 6.3 5 11-4 7-16 14-16 14z"
        fill="url(#cHeart)"
      />

      {/* Left character (bunny) */}
      <g transform="translate(20,60)">
        <ellipse cx="34" cy="4" rx="8" ry="26" fill="url(#cBody)" stroke="#ffd0e6" strokeWidth="3" />
        <ellipse cx="54" cy="4" rx="8" ry="26" fill="url(#cBody)" stroke="#ffd0e6" strokeWidth="3" />
        <circle cx="44" cy="48" r="40" fill="url(#cBody)" stroke="#ffd0e6" strokeWidth="3" />
        <circle cx="26" cy="56" r="8" fill="#ffc2dd" opacity="0.8" />
        <circle cx="62" cy="56" r="8" fill="#ffc2dd" opacity="0.8" />
        <circle cx="34" cy="44" r="4.5" fill="#6b3a5b" />
        <circle cx="54" cy="44" r="4.5" fill="#6b3a5b" />
        <path d="M40 52 l4 4 4 -4z" fill="#ff7ab2" />
        <path d="M38 58 q6 6 12 0" fill="none" stroke="#6b3a5b" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* Right character (bear) */}
      <g transform="translate(140,60)">
        <circle cx="34" cy="6" r="13" fill="#ffe1c2" stroke="#f4c79b" strokeWidth="3" />
        <circle cx="66" cy="6" r="13" fill="#ffe1c2" stroke="#f4c79b" strokeWidth="3" />
        <circle cx="34" cy="6" r="6" fill="#f9d3ad" />
        <circle cx="66" cy="6" r="6" fill="#f9d3ad" />
        <circle cx="50" cy="48" r="42" fill="#ffe9d2" stroke="#f4c79b" strokeWidth="3" />
        <circle cx="32" cy="56" r="8" fill="#ffc2a0" opacity="0.7" />
        <circle cx="68" cy="56" r="8" fill="#ffc2a0" opacity="0.7" />
        <circle cx="40" cy="44" r="4.5" fill="#6b3a5b" />
        <circle cx="60" cy="44" r="4.5" fill="#6b3a5b" />
        <ellipse cx="50" cy="54" rx="11" ry="9" fill="#fff4e8" />
        <ellipse cx="50" cy="51" rx="4" ry="3" fill="#6b3a5b" />
        <path d="M50 54 q-6 8 -12 4 M50 54 q6 8 12 4" fill="none" stroke="#6b3a5b" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
