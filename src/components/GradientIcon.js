export function IconGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="iconPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9ec7" />
          <stop offset="100%" stopColor="#b07dff" />
        </linearGradient>
        <linearGradient id="iconGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#ff9500" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const STROKE_GRADIENTS = {
  pink: "url(#iconPinkGrad)",
  gold: "url(#iconGoldGrad)",
};

export function GradientIcon({
  icon: Icon,
  className = "h-5 w-5",
  strokeWidth = 2.2,
  gradient = "pink",
  ...props
}) {
  return (
    <Icon
      className={className}
      stroke={STROKE_GRADIENTS[gradient] ?? STROKE_GRADIENTS.pink}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}

const BADGE_GRADIENTS = {
  pink: "bg-[linear-gradient(160deg,#ff9bc8_0%,#ff5ba0_60%,#f03d8a_100%)]",
  purple: "bg-[linear-gradient(160deg,#d9bfff_0%,#b07dff_60%,#8b4dff_100%)]",
  gold: "bg-[linear-gradient(160deg,#ffe29a_0%,#ffb648_60%,#ff9500_100%)]",
  white: "bg-[linear-gradient(160deg,#ffffff_0%,#ffe7f2_60%,#ffd0e6_100%)]",
};

export function IconBadge({
  icon: Icon,
  className = "h-9 w-9",
  iconClassName = "h-4.5 w-4.5",
  gradient = "pink",
  strokeWidth = 2.4,
}) {
  const isWhite = gradient === "white";
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_6px_14px_-4px_rgba(255,91,160,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] ${
        BADGE_GRADIENTS[gradient] ?? BADGE_GRADIENTS.pink
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-0.5 h-1/3 rounded-full bg-white/35 blur-[1px]"
      />
      <Icon
        className={`relative ${iconClassName} ${isWhite ? "text-pink-500" : "text-white"}`}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    </span>
  );
}
