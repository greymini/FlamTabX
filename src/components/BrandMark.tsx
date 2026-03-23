/** Climate / envelope motif for navbar and small brand use */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="h-5 w-5 text-primary"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 4c-4 6-7 10-7 14a7 7 0 1014 0c0-4-3-8-7-14z"
          fill="currentColor"
          fillOpacity={0.22}
        />
        <path
          d="M16 8c-2.8 4.2-5 7.4-5 10a5 5 0 0010 0c0-2.6-2.2-5.8-5-10z"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M16 22v6M12 26h8"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
