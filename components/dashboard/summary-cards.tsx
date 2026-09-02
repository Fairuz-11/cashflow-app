"use client"

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  profit: number
  expenseThisWeek: number
  expenseThisMonth: number
}

export function SummaryCards({ totalIncome, totalExpense, profit, expenseThisWeek, expenseThisMonth }: SummaryCardsProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  // Calculate profit percentage
  const profitPercentage = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(2) : "0.00"
  const isPositive = profit >= 0

  const cards = [
    {
      title: "Total Pemasukan",
      value: totalIncome,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "emerald",
      type: "default",
    },
    {
      title: "Total Pengeluaran",
      value: totalExpense,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      color: "rose",
      type: "default",
    },
    {
      title: "Profit",
      value: profit,
      percentage: profitPercentage,
      isPositive: isPositive,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: profit >= 0 ? "blue" : "gray",
      type: "profit",
    },
    {
      title: "Pengeluaran Minggu Ini",
      value: expenseThisWeek,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "orange",
      type: "default",
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: expenseThisMonth,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "purple",
      type: "default",
    },
  ]

  const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", iconBg: "bg-rose-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100" },
    gray: { bg: "bg-gray-50", text: "text-gray-700", iconBg: "bg-gray-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", iconBg: "bg-orange-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", iconBg: "bg-purple-100" },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {cards.map((card) => {
        const colors = colorClasses[card.color]
        
        if (card.type === "profit") {
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${colors.iconBg} p-2 rounded-lg ${colors.text}`}>
                  {card.icon}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{card.title}</p>
              
              {/* Profit value */}
              <p className={`text-2xl font-bold ${colors.text} mb-2`}>
                {fmt(card.value)}
              </p>
              
              {/* Percentage indicator - stock style */}
              <div className="flex items-center gap-1.5">
                {card.isPositive ? (
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                <span className={`text-sm font-semibold ${card.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                  {card.percentage}%
                </span>
                <span className="text-xs text-gray-500">dari pemasukan</span>
              </div>
            </div>
          )
        }
        
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${colors.iconBg} p-2 rounded-lg ${colors.text}`}>
                {card.icon}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{card.title}</p>
            <p className={`text-2xl font-bold ${colors.text}`}>
              {fmt(card.value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
