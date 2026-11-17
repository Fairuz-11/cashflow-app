"use client"

interface HeroCardProps {
  balance: number
  changePercent: string
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
    <section className="relative overflow-hidden rounded-2xl bg-gray-900 p-6 sm:p-8">

      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03]" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/[0.02]" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: main info */}
        <div className="space-y-5">

          {/* Label */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <svg className="h-4 w-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" strokeWidth="1.7" />
                <path d="M3.5 9.5h17M7 14h3" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Total Balance</p>
            </div>
          </div>

          {/* Balance */}
          <div>
            <p className="text-xs text-white/40 mb-1">Saldo bersih dari semua transaksi</p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {fmt(balance)}
            </h2>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                : "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
            }`}>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(parsedPercent).toFixed(1)}%
            </span>
            <span className="text-xs text-white/40">dari total pemasukan</span>
          </div>
        </div>

        {/* Right: mini chart */}
        <div className="hidden sm:flex flex-col items-end gap-3 shrink-0">
          <svg viewBox="0 0 180 60" className="w-44 h-auto overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>
            <path
              d="M2 50 C25 46 35 32 55 36 S82 20 100 26 S128 10 150 14 S165 6 178 3"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="178" cy="3" r="3" fill="white" fillOpacity="0.6" />
          </svg>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/25">Money overview</p>
        </div>

      </div>
    </section>
  )
}
