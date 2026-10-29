"use client"

interface CashflowTrendChartProps {
  income: number
  expense: number
  profit: number
}

export function CashflowTrendChart({ income, expense, profit }: CashflowTrendChartProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return (n < 0 ? "−" : "") + "Rp" + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt"
    if (abs >= 1_000) return (n < 0 ? "−" : "") + "Rp" + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " rb"
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  }

  const items = [
    {
      label: "Total pemasukan",
      value: income,
      description: "Uang masuk tercatat",
      tone: "emerald",
      icon: "M12 5v14m7-7H5",
    },
    {
      label: "Total pengeluaran",
      value: expense,
      description: "Uang keluar tercatat",
      tone: "rose",
      icon: "M5 12h14",
    },
    {
      label: "Selisih bersih",
      value: profit,
      description: "Pemasukan dikurangi pengeluaran",
      tone: "blue",
      icon: "M4 14l5-5 4 4 7-7",
    },
  ] as const

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">At a glance</p>
          <h3 className="mt-1.5 text-xl font-bold tracking-tight text-slate-950">Cashflow summary</h3>
          <p className="mt-1 text-sm text-slate-500">Ringkasan seluruh transaksi yang tercatat</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All transactions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={"group relative min-w-0 overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 " + (
              item.tone === "emerald"
                ? "border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white hover:border-emerald-200 hover:shadow-emerald-900/5"
                : item.tone === "rose"
                  ? "border-rose-100 bg-gradient-to-br from-rose-50/80 to-white hover:border-rose-200 hover:shadow-rose-900/5"
                  : "border-blue-100 bg-gradient-to-br from-blue-50/80 to-white hover:border-blue-200 hover:shadow-blue-900/5"
            )}
          >
            <div className={"absolute inset-x-0 top-0 h-1 " + (
              item.tone === "emerald" ? "bg-emerald-500" : item.tone === "rose" ? "bg-rose-400" : "bg-blue-500"
            )} />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
              </div>
              <span className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset " + (
                item.tone === "emerald"
                  ? "bg-emerald-100 text-emerald-700 ring-emerald-200/70"
                  : item.tone === "rose"
                    ? "bg-rose-100 text-rose-700 ring-rose-200/70"
                    : "bg-blue-100 text-blue-700 ring-blue-200/70"
              )}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
            </div>
            <p className={"break-long-content text-2xl font-bold tracking-tight sm:text-[1.7rem] " + (
              item.tone === "emerald" ? "text-emerald-700" : item.tone === "rose" ? "text-rose-700" : profit < 0 ? "text-rose-700" : "text-slate-950"
            )}>
              {fmt(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
