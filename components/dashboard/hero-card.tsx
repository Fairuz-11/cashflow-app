"use client"

interface HeroCardProps {
  balance: number
  changePercent: string
  totalIncome?: number
  totalExpense?: number
}

export function HeroCard({ balance, changePercent }: HeroCardProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)

  const parsedPercent = Number.parseFloat(changePercent) || 0
  const isPositive = parsedPercent >= 0

  return (
    <section
      className="relative overflow-hidden rounded-2xl px-7 py-9 sm:px-10 sm:py-10"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1e293b 100%)",
      }}
    >
      {/* ── Noise texture overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* ── Blue glow top-right ── */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Faint bottom-left glow ── */}
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-52 w-52 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ── Horizontal line divider decoration ── */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

        {/* ── LEFT ── */}
        <div className="space-y-6">

          {/* Label row */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg className="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" strokeWidth="1.6" />
                <path d="M3.5 9.5h17M7 14h3" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                Saldo Saat Ini
              </p>
            </div>
          </div>

          {/* Balance amount */}
          <div>
            <p className="text-xs text-white/30 mb-2 tracking-wide">Dana tersedia</p>
            <h2
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              style={{ textShadow: "0 2px 20px rgba(59,130,246,0.25)" }}
            >
              {fmt(balance)}
            </h2>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                isPositive
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
              style={{
                background: isPositive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                border: `1px solid ${isPositive ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(parsedPercent).toFixed(1)}%
            </span>
            <span className="text-xs text-white/35">dari pemasukan tersimpan</span>
          </div>
        </div>

        {/* ── RIGHT: decorative chart ── */}
        <div className="hidden sm:flex flex-col items-end gap-3 shrink-0 self-end pb-1">
          <svg viewBox="0 0 180 64" className="w-44 h-auto overflow-visible">
            <defs>
              <linearGradient id="hcLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(96,165,250,0.2)" />
                <stop offset="100%" stopColor="rgba(96,165,250,0.9)" />
              </linearGradient>
              <linearGradient id="hcArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.0)" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d="M0 52 C22 48 32 32 52 36 S80 20 100 24 S130 10 152 13 S166 6 180 3 L180 64 L0 64 Z"
              fill="url(#hcArea)"
            />
            {/* Line */}
            <path
              d="M0 52 C22 48 32 32 52 36 S80 20 100 24 S130 10 152 13 S166 6 180 3"
              fill="none"
              stroke="url(#hcLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* End dot */}
            <circle cx="180" cy="3" r="4" fill="#93c5fd" />
            <circle cx="180" cy="3" r="8" fill="rgba(147,197,253,0.2)" />
          </svg>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Balance trend
          </p>
        </div>

      </div>
    </section>
  )
}
