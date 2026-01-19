import Link from "next/link";

type GoogleRatingBadgeProps = {
  value: number;
  count: number;
  url: string;
};

export function GoogleRatingBadge({
  value,
  count,
  url,
}: GoogleRatingBadgeProps) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-5 py-2 shadow-sm hover:shadow transition"
      aria-label={`Valoración ${value} sobre 5 en Google`}
    >
      {/* Google Icon */}
      <GoogleIcon />

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < Math.round(value) ? "text-amber-400" : "text-stone-300"}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>

      {/* Value */}
      <span className="text-sm font-semibold text-stone-900">
        {value.toFixed(1)}
      </span>

      {/* Count */}
      <span className="text-xs text-stone-500">({count})</span>
    </Link>
  );
}

/* ---------- ICON ---------- */

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden
      className="shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.82 2.38 30.28 0 24 0 14.64 0 6.56 5.38 2.56 13.22l7.98 6.19C12.43 13.42 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.01c4.51-4.18 7.09-10.36 7.09-17.66z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.83 0 20.28 0 24s.92 7.17 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.28 0 11.56-2.08 15.41-5.64l-7.73-6.01c-2.15 1.44-4.92 2.3-7.68 2.3-6.26 0-11.57-3.92-13.47-9.41l-7.98 6.19C6.56 42.62 14.64 48 24 48z"
      />
    </svg>
  );
}
