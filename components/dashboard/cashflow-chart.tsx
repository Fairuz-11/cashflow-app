"use client"

interface CashflowChartProps {
  income: number
  expense: number
  profit: number
}

export function CashflowChart({ income, expense, profit }: CashflowChartProps) {
  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (abs >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  const maxValue = Math.max(income, expense)
  const incomeHeight = (income / maxValue) * 100
  const expenseHeight = (expense / maxValue) * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Cashflow Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">Perbandingan pemasukan vs pengeluaran</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-around gap-8 h-48 mb-4">
        {/* Income Bar */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-500"
              style={{ height: `${incomeHeight}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600">Pemasukan</p>
            <p className="text-lg font-bold text-emerald-600">Rp {fmt(income)}</p>
          </div>
        </div>

        {/* Expense Bar */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-xl transition-all duration-500"
              style={{ height: `${expenseHeight}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600">Pengeluaran</p>
            <p className="text-lg font-bold text-rose-600">Rp {fmt(expense)}</p>
          </div>
        </div>

        {/* Profit Bar */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
            <div 
              className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-500 ${
                profit >= 0 
                  ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                  : 'bg-gradient-to-t from-gray-500 to-gray-400'
              }`}
              style={{ height: `${Math.abs((profit / maxValue) * 100)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600">Profit</p>
            <p className={`text-lg font-bold ${profit >= 0 ? 'text-blue-600' : 'text-gray-600'}`}>
              Rp {fmt(profit)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={`mt-4 p-3 rounded-lg ${profit >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profit >= 0 ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`text-sm font-medium ${profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {profit >= 0 
                ? 'Keuangan Anda sehat! Pemasukan lebih besar dari pengeluaran.' 
                : 'Perhatian! Pengeluaran melebihi pemasukan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
