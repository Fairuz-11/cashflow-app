"use client"

interface SpendingCategoryChartProps {
  totalIncome: number
  totalExpense: number
}

export function SpendingCategoryChart({ totalIncome, totalExpense }: SpendingCategoryChartProps) {
  const total = totalIncome + totalExpense
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50
  const expensePercent = total > 0 ? (totalExpense / total) * 100 : 50

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Income vs Spending</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              background: `conic-gradient(
                #10b981 0% ${incomePercent}%, 
                #1e293b ${incomePercent}% 100%
              )` 
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold text-gray-900">{fmt(total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-700">Pemasukan</span>
              </div>
              <span className="font-semibold text-gray-900">{incomePercent.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold ml-5">{fmt(totalIncome)}</p>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <span className="text-gray-700">Pengeluaran</span>
              </div>
              <span className="font-semibold text-gray-900">{expensePercent.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold ml-5">{fmt(totalExpense)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
