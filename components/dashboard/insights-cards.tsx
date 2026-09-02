"use client"

interface InsightsCardsProps {
  totalIncome: number
  totalExpense: number
  expenseThisWeek: number
  expenseThisMonth: number
}

export function InsightsCards({ totalIncome, totalExpense, expenseThisWeek, expenseThisMonth }: InsightsCardsProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
  
  const avgDailyExpense = expenseThisWeek / 7
  const projectedMonthlyExpense = avgDailyExpense * 30
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0) : "0"

  const insights = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Rata-rata Harian",
      value: fmt(avgDailyExpense),
      subtitle: "Pengeluaran per hari",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Proyeksi Bulan Ini",
      value: fmt(projectedMonthlyExpense),
      subtitle: "Berdasarkan rata-rata",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Savings Rate",
      value: `${savingsRate}%`,
      subtitle: "Dari total pemasukan",
      color: "bg-emerald-50 text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className={`w-10 h-10 rounded-lg ${insight.color} flex items-center justify-center mb-3`}>
            {insight.icon}
          </div>
          <h4 className="text-xs font-medium text-gray-600 mb-1">{insight.title}</h4>
          <p className="text-xl font-bold text-gray-900 mb-0.5">{insight.value}</p>
          <p className="text-xs text-gray-500">{insight.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
