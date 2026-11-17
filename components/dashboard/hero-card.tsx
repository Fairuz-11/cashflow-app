"use client"

interface HeroCardProps {
  balance: number
  changePercent: string
  totalIncome?: number
  totalExpense?: number
}

export function HeroCard({ balance, changePercent, totalIncome = 0, totalExpense = 0 }: HeroCardProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)

  const fmtShort = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return (n < 0 ? "-" : "") + "Rp " + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt"
    if (abs >= 1_000) return (n < 0 ? "-" : "") + "Rp " + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb"
    return fmt(n)
  }

  const parsedPercent = Number.parseFloat(changePercent) || 0
  const isPositive = parsedPercent >= 0

  // Bar chart ratio
  const total = totalIncome + totalExpense
  const incomeRatio = total > 0 ? (totalIncome / total) * 100 : 50
  const expenseRatio = total > 0 ? (totalExpense / total) * 100 : 50

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Top-right glow */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      {/* Bottom-left glow */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Grid lines background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* ── LEFT: Balance ── */}
        <div className="flex-1 space-y-6">

          {/* Badge */}
          <div className="flex items-center gap-2 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Total Balance
            </p>
          </div>

          {/* Main balance */}
          <div>
            <p className="text-xs text-white/35 mb-2">Saldo bersih dari semua transaksi</p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {fmt(balance)}
            </h2>
          </div>

          {/* Change badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/25"
                : "bg-red-500/15 text-red-400 ring-1 ring-red-400/25"
            }`}>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(parsedPercent).toFixed(1)}%
            </span>
            <span className="text-xs text-white/35">dari total pemasukan tersimpan</span>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="hidden lg:block w-px h-28 bg-white/10 shrink-0" />

        {/* ── RIGHT: Income vs Expense breakdown ── */}
        <div className="flex flex-col gap-5 lg:w-72 shrink-0">

          {/* Header */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Ringkasan
          </p>

          {/* Income row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-white/60">Pemasukan</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">{fmtShort(totalIncome)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${incomeRatio}%` }}
              />
            </div>
          </div>

          {/* Expense row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-white/60">Pengeluaran</span>
              </div>
              <span className="text-sm font-bold text-red-400">{fmtShort(totalExpense)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-red-400 transition-all duration-700"
                style={{ width: `${expenseRatio}%` }}
              />
            </div>
          </div>

          {/* Mini chart */}
          <div className="pt-1">
            <svg viewBox="0 0 200 48" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.2)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.8)" />
                </linearGradient>
                <linearGradient id="heroFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M0 40 C20 36 30 24 50 28 S75 14 95 18 S125 6 148 10 S170 4 200 2 L200 48 L0 48 Z"
                fill="url(#heroFillGrad)"
              />
              {/* Line */}
              <path
                d="M0 40 C20 36 30 24 50 28 S75 14 95 18 S125 6 148 10 S170 4 200 2"
                fill="none"
                stroke="url(#heroLineGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="200" cy="2" r="3" fill="#34d399" />
              <circle cx="200" cy="2" r="6" fill="rgba(52,211,153,0.2)" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  )
}
