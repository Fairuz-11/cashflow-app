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
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white px-7 py-8 shadow-sm">

      {/* Accent bar top */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-blue-600" />

      {/* Soft blue glow top-right */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: label + balance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" strokeWidth="1.7" />
                <path d="M3.5 9.5h17M7 14h3" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Saldo Saat Ini
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {fmt(balance)}
          </h2>

          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-700 ring-1 ring-red-200"
            }`}>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(parsedPercent).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400">dari total pemasukan tersimpan</span>
          </div>
        </div>

        {/* Right: mini trend chart */}
        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
          <svg viewBox="0 0 160 56" className="w-40 h-auto overflow-visible">
            <defs>
              <linearGradient id="hcFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(37,99,235,0.12)" />
                <stop offset="100%" stopColor="rgba(37,99,235,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 44 C18 40 28 26 44 30 S68 16 86 20 S112 8 132 11 S148 5 160 2 L160 56 L0 56 Z"
              fill="url(#hcFill)"
            />
            <path
              d="M0 44 C18 40 28 26 44 30 S68 16 86 20 S112 8 132 11 S148 5 160 2"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            <circle cx="160" cy="2" r="3.5" fill="#2563eb" fillOpacity="0.8" />
            <circle cx="160" cy="2" r="7" fill="rgba(37,99,235,0.15)" />
          </svg>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-300">
            Overview
          </p>
        </div>

      </div>
    </section>
  )
}
