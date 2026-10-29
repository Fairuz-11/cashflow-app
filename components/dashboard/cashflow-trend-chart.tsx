"use client"

interface CashflowTrendChartProps {
  income: number
  expense: number
  profit: number
}

export function CashflowTrendChart({ income, expense, profit }: CashflowTrendChartProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1000000) return "Rp" + (n / 1000000).toFixed(1) + " jt"
    if (abs >= 1000) return "Rp" + (n / 1000).toFixed(0) + " rb"
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
  }

  const items = [
    { label: "Total pemasukan", value: income, tone: "emerald", icon: "M12 5v14m7-7H5" },
    { label: "Total pengeluaran", value: expense, tone: "rose", icon: "M5 12h14" },
    { label: "Selisih bulan ini", value: profit, tone: "blue", icon: "M4 14l5-5 4 4 7-7" },
  ]

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Overview</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Cashflow summary</h3>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">All transactions</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:bg-white hover:border-slate-200">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " + (item.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : item.tone === "rose" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700")}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </span>
            </div>
            <p className={"break-long-content text-xl font-bold tracking-tight sm:text-2xl " + (item.tone === "emerald" ? "text-emerald-700" : item.tone === "rose" ? "text-rose-700" : "text-slate-900")}>
              {fmt(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
