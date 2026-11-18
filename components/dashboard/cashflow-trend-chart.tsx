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

  // Rasio untuk progress bar
  const total = income + expense
  const incomeRatio = total > 0 ? Math.round((income / total) * 100) : 50
  const expenseRatio = 100 - incomeRatio
  const isProfit = profit >= 0

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <p className="text-sm font-semibold text-slate-800">Ringkasan Cashflow</p>
        <span className="text-[11px] text-slate-400">Semua transaksi</span>
      </div>

      <div className="h-px bg-slate-100" />

      {/* ── Mobile layout ── */}
      <div className="sm:hidden px-5 py-5 space-y-5">

        {/* Income & Expense rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm text-slate-500">Total Pemasukan</p>
            </div>
            <p className="text-sm font-semibold text-emerald-600">{fmt(income)}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <p className="text-sm text-slate-500">Total Pengeluaran</p>
            </div>
            <p className="text-sm font-semibold text-rose-600">{fmt(expense)}</p>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="space-y-1.5">
            <div className="flex overflow-hidden rounded-full h-1.5 bg-slate-100">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${incomeRatio}%` }}
              />
              <div
                className="h-full bg-rose-400 transition-all duration-500"
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
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">Selisih Bersih</p>
          <p className={`text-base font-bold tracking-tight ${isProfit ? "text-slate-900" : "text-rose-600"}`}>
            {fmt(profit)}
          </p>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden sm:block">

        {/* 3 kolom angka */}
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {[
            { label: "Total Pemasukan",   value: income,  cls: "text-emerald-600", dot: "bg-emerald-500" },
            { label: "Total Pengeluaran", value: expense, cls: "text-rose-600",    dot: "bg-rose-500"    },
            { label: "Selisih Bersih",    value: profit,  cls: isProfit ? "text-slate-900" : "text-rose-600", dot: isProfit ? "bg-slate-400" : "bg-rose-400" },
          ].map((item) => (
            <div key={item.label} className="px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.dot}`} />
                <p className="text-xs font-medium text-slate-400">{item.label}</p>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${item.cls}`}>
                {fmt(item.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar desktop */}
        {total > 0 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <div className="flex overflow-hidden rounded-full h-1 bg-slate-100">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${incomeRatio}%` }}
              />
              <div
                className="h-full bg-rose-400 transition-all duration-500"
                style={{ width: `${expenseRatio}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <p className="text-[10px] text-slate-400">{incomeRatio}% pemasukan</p>
              <p className="text-[10px] text-slate-400">{expenseRatio}% pengeluaran</p>
            </div>
          </div>
        )}
      </div>

    </section>
  )
}
