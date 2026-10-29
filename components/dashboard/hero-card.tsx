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

  const isPositive = Number.parseFloat(changePercent) >= 0

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_18px_55px_-35px_rgba(16,185,129,0.35)] sm:p-8">
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-l from-emerald-50/90 via-emerald-50/40 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border-[1px] border-emerald-100/80" />
      <div className="pointer-events-none absolute -right-2 -top-10 -z-10 h-44 w-44 rounded-full border-[1px] border-emerald-100/70" />

      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            TOTAL BALANCE
          </div>

          <p className="mb-2 text-sm font-medium text-slate-500">Your available balance</p>
          <h2 className="break-long-content text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {fmt(balance)}
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold " + (isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPositive ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} />
              </svg>
              {Math.abs(Number.parseFloat(changePercent))}%
            </span>
            <span className="text-slate-500">of total income retained</span>
          </div>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 sm:mb-1">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 7.5A2.25 2.25 0 016 5.25h12A2.25 2.25 0 0120.25 7.5v9A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5v-9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 9h16.5M7.5 14.25h3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
