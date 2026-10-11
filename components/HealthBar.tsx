export default function HealthBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const color =
    pct > 60 ? "bg-gold" : pct > 30 ? "bg-amber-500" : "bg-blood";

  return (
    <div className="mb-4" role="status" aria-label={`سلامت: ${Math.round(pct)} درصد`}>
      <div className="mb-1 flex items-center justify-between text-xs text-bone-dim">
        <span>سلامت</span>
        <span className="tabular-nums">{Math.round(pct)}٪</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-line bg-void">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
