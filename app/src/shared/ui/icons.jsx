// A small hand-built icon set — no icon library dependency, just the
// specific marks this app needs, including the Jeremiah AI flame identity.

export function FlameMark({ size = 28, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.4-2-1-3 1.5.8 3 2.6 3 5.5A6.5 6.5 0 0 1 13.5 18 6.5 6.5 0 0 1 7 11.5c0-3.2 1.6-5 3-6.5.6-.7 1.6-1.8 2-3z"
        fill="url(#flameGradient)"
      />
      <defs>
        <linearGradient id="flameGradient" x1="7" y1="2" x2="17" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD000" />
          <stop offset="0.55" stopColor="#FF8A00" />
          <stop offset="1" stopColor="#D1001F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const strokeProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export function HomeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function MapIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function ChatIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  );
}

export function ChartIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

export function UserIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function LockIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
