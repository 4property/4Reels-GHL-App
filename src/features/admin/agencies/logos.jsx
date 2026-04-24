/** Inline brand logos for the data source cards — local to avoid clashes. */

export function GHLLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="12" fill="#1f80f0" />
      <path
        d="M18 40 L32 20 L46 40 M24 40 L24 32 H40 V40"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function WPLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#21759b" />
      <text
        x="32" y="40"
        textAnchor="middle"
        fontSize="26" fontWeight="700" fill="white"
        fontFamily="system-ui"
      >
        W
      </text>
    </svg>
  );
}
