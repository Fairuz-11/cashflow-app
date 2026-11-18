"use client"

interface HeroCardProps {
  balance: number
  changePercent: string
  expenseThisWeek?: number
  expenseToday?: number
  incomeThisWeek?: number
}

export function HeroCard({
  balance,
  changePercent,
  expenseThisWeek = 0,
  expenseToday = 0,
  incomeThisWeek = 0,
}: HeroCardProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)

  const fmtShort = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000)
      return "Rp\u00a0" + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
    if (abs >= 1_000)
      return "Rp\u00a0" + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
    return fmt(n)
  }

  const parsedPercent = Number.parseFloat(changePercent) || 0
  const isPositive = parsedPercent >= 0

  const stats = [
    { label: "Keluar minggu ini", value: fmtShort(expenseThisWeek), valueColor: "text-white/90" },
    { label: "Keluar hari ini",   value: fmtShort(expenseToday),    valueColor: "text-white/90" },
    { label: "Masuk minggu ini",  value: fmtShort(incomeThisWeek),  valueColor: "text-emerald-400" },
  ]

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1e293b 100%)",
        borderRadius: "2rem",
      }}
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* Blue glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Shimmer top border */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(147,197,253,0.25), transparent)" }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 70% 80% at 85% 20%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 85% 20%, black 20%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main layout ── */}
      <div className="relative flex flex-col lg:flex-row lg:items-stretch">

        {/* LEFT — saldo utama */}
        <div className="flex-1 px-7 py-8 sm:px-10 sm:py-10">

          {/* Label chip */}
          <div
            className="mb-6 flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full bg-blue-400"
              style={{ boxShadow: "0 0 6px rgba(96,165,250,0.8)" }}
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300/80">
              Saldo Saat Ini
            </p>
          </div>

          {/* Balance */}
          <p className="mb-2 text-xs text-white/30">Dana tersedia</p>
          <h2
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ textShadow: "0 2px 24px rgba(59,130,246,0.25)" }}
          >
            {fmt(balance)}
          </h2>

          {/* % badge */}
          <div className="mt-5 flex items-center gap-3">
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
            <span className="text-xs text-white/30">dari pemasukan tersimpan</span>
          </div>
        </div>

        {/* Vertical divider — desktop only */}
        <div
          className="hidden lg:block lg:h-auto lg:w-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
          aria-hidden="true"
        />

        {/* RIGHT — 3 stat */}
        {/* Desktop: vertikal di kanan | Mobile: 3 kolom di bawah */}
        <div className="px-7 pb-7 pt-0 sm:px-10 lg:flex lg:w-72 lg:flex-col lg:justify-center lg:py-10">
          {/* Mobile: grid 3 kolom */}
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="mb-1 text-[10px] font-medium text-white/35 leading-tight">{s.label}</p>
                <p className={`text-sm font-semibold tracking-tight ${s.valueColor}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Desktop: stack vertikal dengan divider */}
          <div className="hidden lg:block">
            {stats.map((s, i) => (
              <div key={s.label}>
                <div className="py-4">
                  <p className="mb-1.5 text-[11px] font-medium text-white/35">{s.label}</p>
                  <p className={`text-lg font-semibold tracking-tight ${s.valueColor}`}>{s.value}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
