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

  const total = income + expense
  const incomeRatio = total > 0 ? Math.round((income / total) * 100) : 50
  const expenseRatio = 100 - incomeRatio
  const isProfit = profit >= 0

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06), 0 4px 16px -4px rgba(15,23,42,0.04)" }}
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-0.5 rounded-full bg-blue-600" />
          <p className="text-sm font-semibold text-slate-800">Ringkasan Cashflow</p>
        </div>
        <span className="text-[11px] font-medium text-slate-400">Semua transaksi</span>
      </div>

      <div className="h-px bg-slate-100" />

      {/* ── Mobile ── */}
      <div className="sm:hidden px-5 py-5 space-y-4">

        <div className="space-y-3.5">
          {/* Pemasukan */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm text-slate-500">Total Pemasukan</p>
            </div>
            <p className="text-sm font-bold text-emerald-600">{fmt(income)}</p>
          </div>

          {/* Pengeluaran */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-blue-900 shrink-0" />
              <p className="text-sm text-slate-500">Total Pengeluaran</p>
            </div>
            <p className="text-sm font-bold text-blue-900">{fmt(expense)}</p>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="space-y-1.5">
            <div className="flex overflow-hidden rounded-full h-2 bg-slate-100">
              <div
                className="h-full rounded-l-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${incomeRatio}%` }}
              />
              <div
                className="h-full rounded-r-full bg-blue-900 transition-all duration-700"
                style={{ width: `${expenseRatio}%` }}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-[10px] text-slate-400">{incomeRatio}% masuk</p>
              <p className="text-[10px] text-slate-400">{expenseRatio}% keluar</p>
            </div>
          </div>
        )}

        {/* Selisih */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: isProfit ? "rgba(16,185,129,0.06)" : "rgba(15,23,42,0.06)" }}
        >
          <p className="text-sm font-medium text-slate-600">Selisih Bersih</p>
          <p className={`text-base font-bold tracking-tight ${isProfit ? "text-slate-900" : "text-blue-900"}`}>
            {fmt(profit)}
          </p>
        </div>

      </div>

      {/* ── Desktop ── */}
      <div className="hidden sm:block">

        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
    { label: "Total Pemasukan",   value: income,  cls: "text-emerald-600", dot: "bg-emerald-500" },
            { label: "Total Pengeluaran", value: expense, cls: "text-blue-900",    dot: "bg-blue-900"    },
            { label: "Selisih Bersih",    value: profit,  cls: isProfit ? "text-slate-900" : "text-blue-900", dot: isProfit ? "bg-slate-300" : "bg-blue-900" },
          ].map((item) => (
            <div key={item.label} className="px-6 py-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.dot}`} />
                <p className="text-xs font-medium text-slate-400">{item.label}</p>
              </div>
              <p className={`text-[1.6rem] font-bold tracking-tight leading-none ${item.cls}`}>
                {fmt(item.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar desktop */}
        {total > 0 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex overflow-hidden rounded-full h-2 bg-slate-100">
              <div
                className="h-full rounded-l-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${incomeRatio}%` }}
              />
              <div
                className="h-full rounded-r-full bg-blue-900 transition-all duration-700"
                style={{ width: `${expenseRatio}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400">{incomeRatio}% pemasukan</span>
                <span className="text-[10px] text-slate-300">·</span>
                <span className="text-[10px] text-slate-400">{expenseRatio}% pengeluaran</span>
              </div>
              <span className={`text-[10px] font-semibold ${isProfit ? "text-emerald-600" : "text-blue-900"}`}>
                {isProfit ? "Surplus" : "Defisit"}
              </span>
            </div>
          </div>
        )}

      </div>

    </section>
  )
}
