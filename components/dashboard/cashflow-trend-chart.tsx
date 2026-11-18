"use client"

interface CashflowTrendChartProps {
  income: number
  expense: number
  profit: number
}

export function CashflowTrendChart({ income, expense, profit }: CashflowTrendChartProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000)
      return (n < 0 ? "−\u00a0" : "") + "Rp\u00a0" + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
    if (abs >= 1_000)
      return (n < 0 ? "−\u00a0" : "") + "Rp\u00a0" + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)
  }

  const items = [
    {
      label: "Total Pemasukan",
      value: income,
      valueClass: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    {
      label: "Total Pengeluaran",
      value: expense,
      valueClass: "text-rose-600",
      dot: "bg-rose-500",
    },
    {
      label: "Selisih Bersih",
      value: profit,
      valueClass: profit < 0 ? "text-rose-600" : "text-slate-900",
      dot: profit < 0 ? "bg-rose-400" : "bg-slate-400",
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <p className="text-sm font-semibold text-slate-800">Ringkasan Cashflow</p>
        <span className="text-[11px] text-slate-400">Semua transaksi</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Mobile: stack vertikal */}
      <div className="sm:hidden">
        {items.map((item, i) => (
          <div key={item.label}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
              <p className={`text-base font-semibold tracking-tight ${item.valueClass}`}>
                {fmt(item.value)}
              </p>
            </div>
            {i < items.length - 1 && <div className="mx-5 h-px bg-slate-100" />}
          </div>
        ))}
      </div>

      {/* Desktop: 3 kolom */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:divide-x sm:divide-slate-100">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
              <p className="text-xs font-medium text-slate-400">{item.label}</p>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${item.valueClass}`}>
              {fmt(item.value)}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}
