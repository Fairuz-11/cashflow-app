"use client"

interface CashflowTrendChartProps {
  income: number
  expense: number
  profit: number
}

export function CashflowTrendChart({ income, expense, profit }: CashflowTrendChartProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1000000) return `Rp${(n / 1000000).toFixed(1)}M`
    if (abs >= 1000) return `Rp${(n / 1000).toFixed(0)}K`
    return `Rp${n}`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Cash flow insight</h3>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Income</p>
          <p className="text-lg font-bold text-emerald-600">{fmt(income)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Outcome</p>
          <p className="text-lg font-bold text-gray-900">{fmt(expense)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">This month</p>
          <p className="text-lg font-bold text-blue-600">{fmt(profit)}</p>
        </div>
      </div>
    </div>
  )
}
