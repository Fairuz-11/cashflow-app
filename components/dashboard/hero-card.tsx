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
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-[#062f2a] via-[#075b4b] to-[#0d8061] p-6 text-white shadow-[0_24px_70px_-35px_rgba(5,150,105,0.65)] sm:p-8 lg:p-9">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" aria-hidden="true">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/40" />
        <div className="absolute -right-4 -top-12 h-52 w-52 rounded-full border border-white/30" />
        <div className="absolute right-10 top-8 h-32 w-32 rounded-full border border-white/20" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-l from-emerald-300/10 to-transparent" aria-hidden="true" />

      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-100 shadow-inner shadow-white/5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" strokeWidth="1.7" />
                <path d="M3.5 9.5h17M7 14h3" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/80">Total balance</p>
              <p className="mt-1 text-xs text-white/60">Your financial overview</p>
            </div>
          </div>

          <p className="mb-2 text-sm font-medium text-emerald-50/75">Net balance from recorded transactions</p>
          <h2 className="break-long-content text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {fmt(balance)}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold " + (isPositive ? "border-emerald-200/20 bg-emerald-300/15 text-emerald-100" : "border-rose-200/20 bg-rose-300/15 text-rose-100")}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(parsedPercent).toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-white/65">of total income retained</span>
          </div>
        </div>

        <div className="hidden w-40 shrink-0 self-center sm:block lg:w-48" aria-hidden="true">
          <svg viewBox="0 0 180 76" className="h-auto w-full overflow-visible">
            <path d="M2 62 C22 58 27 44 45 48 S72 30 88 37 S112 18 130 25 S155 9 178 5" fill="none" stroke="white" strokeOpacity=".15" strokeWidth="12" strokeLinecap="round" />
            <path d="M2 62 C22 58 27 44 45 48 S72 30 88 37 S112 18 130 25 S155 9 178 5" fill="none" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="178" cy="5" r="4" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
          </svg>
          <p className="mt-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Money overview</p>
        </div>
      </div>
    </section>
  )
}
