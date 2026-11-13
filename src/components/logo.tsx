export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <circle cx="16" cy="16" r="16" className="fill-leaf" />
        <path
          d="M9 22c0-7 5-12 14-13-1 9-6 14-13 14m0-1 8-8"
          fill="none"
          stroke="#88ffc7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="leading-none">
        <span className="block text-lg font-semibold tracking-tight text-leaf">Herbal</span>
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate">
          Essentials Pro
        </span>
      </span>
    </span>
  );
}
