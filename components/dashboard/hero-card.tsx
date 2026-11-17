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
      className="relative overflow-hidden px-7 py-9 sm:px-10 sm:py-10"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1e293b 100%)",
        borderRadius: "2rem",
      }}
    >
      {/* ── Noise texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* ── Dot grid pattern top-right ── */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 80% 80% at 90% 20%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 90% 20%, black 30%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Blue glow top-right ── */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Shimmer line top ── */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 40%, rgba(147,197,253,0.3) 60%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* ── Curved shape bottom-left ── */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

        {/* ── LEFT ── */}
        <div className="space-y-6">

          {/* Top chip */}
          <div className="flex items-center gap-2 w-fit rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" style={{ boxShadow: "0 0 6px rgba(96,165,250,0.8)" }} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300/80">
              Saldo Saat Ini
            </p>
          </div>

          {/* Balance */}
          <div>
            <p className="text-xs text-white/30 mb-2.5 tracking-wide">Dana tersedia</p>
            <h2
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              style={{ textShadow: "0 2px 24px rgba(59,130,246,0.3)" }}
            >
              {fmt(balance)}
            </h2>
          </div>

          {/* Divider + badge row */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                isPositive ? "text-emerald-300" : "text-red-300"
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
            <span
              className="h-4 w-px"
              style={{ background: "rgba(255,255,255,0.12)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-white/30">dari pemasukan tersimpan</span>
          </div>
        </div>

        {/* ── RIGHT: chart ── */}
        <div className="hidden sm:flex flex-col items-end gap-3 shrink-0 self-end pb-1">
          <svg viewBox="0 0 180 64" className="w-44 h-auto overflow-visible">
            <defs>
              <linearGradient id="hcLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(96,165,250,0.15)" />
                <stop offset="100%" stopColor="rgba(96,165,250,1)" />
              </linearGradient>
              <linearGradient id="hcArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.22)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 52 C22 48 32 32 52 36 S80 20 100 24 S130 10 152 13 S166 6 180 3 L180 64 L0 64 Z"
              fill="url(#hcArea)"
            />
            <path
              d="M0 52 C22 48 32 32 52 36 S80 20 100 24 S130 10 152 13 S166 6 180 3"
              fill="none"
              stroke="url(#hcLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="180" cy="3" r="4" fill="#93c5fd" />
            <circle cx="180" cy="3" r="9" fill="rgba(147,197,253,0.18)" />
          </svg>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Balance trend
          </p>
        </div>

      </div>
    </section>
  )
}
