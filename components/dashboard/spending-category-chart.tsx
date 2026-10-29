"use client"

interface SpendingCategoryChartProps {
  totalIncome: number
  totalExpense: number
}

export function SpendingCategoryChart({ totalIncome, totalExpense }: SpendingCategoryChartProps) {
  const total = totalIncome + totalExpense
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50
  const expensePercent = total > 0 ? (totalExpense / total) * 100 : 50
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

  return (
    <section className="h-full rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Breakdown</p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Income vs. spending</h3>
        <p className="mt-1 text-sm text-slate-500">How your cashflow is distributed</p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-36 w-36 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ background: "conic-gradient(#059669 0% " + incomePercent + "%, #cbd5e1 " + incomePercent + "% 100%)" }}
            role="img"
            aria-label={"Income " + incomePercent.toFixed(1) + "% and spending " + expensePercent.toFixed(1) + "%"}
          />
          <div className="absolute inset-[11px] flex items-center justify-center rounded-full border border-slate-100 bg-white">
            <div className="px-1 text-center">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Combined</p>
              <p className="mt-1 max-w-[6.5rem] break-long-content text-sm font-bold leading-tight text-slate-900">{fmt(total)}</p>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Income
              </div>
              <span className="text-sm font-bold text-slate-900">{incomePercent.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: incomePercent + "%" }} />
            </div>
            <p className="mt-2 break-long-content text-sm font-semibold text-emerald-700">{fmt(totalIncome)}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Spending
              </div>
              <span className="text-sm font-bold text-slate-900">{expensePercent.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-400 transition-all" style={{ width: expensePercent + "%" }} />
            </div>
            <p className="mt-2 break-long-content text-sm font-semibold text-slate-700">{fmt(totalExpense)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
