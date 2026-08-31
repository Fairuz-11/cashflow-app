import { Card, CardContent } from "@/components/ui/card"

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  profit: number
  expenseThisWeek: number
  expenseThisMonth: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function SummaryCards({
  totalIncome,
  totalExpense,
  profit,
  expenseThisWeek,
  expenseThisMonth,
}: SummaryCardsProps) {
  return (
    <div className="space-y-4">

      {/* ── Row 1: 3 card utama ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total Uang Masuk */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Uang Masuk
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Semua waktu</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Uang Keluar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Uang Keluar
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpense)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Semua waktu</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 12H4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Profit
                </p>
                <p className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatCurrency(profit)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {profit >= 0 ? "Saldo positif" : "Saldo negatif"}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                profit >= 0 ? "bg-blue-100" : "bg-red-100"
              }`}>
                <svg className={`w-6 h-6 ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: 2 card pengeluaran periodik ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Pengeluaran Minggu Ini */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Pengeluaran Minggu Ini
                </p>
                <p className="text-2xl font-bold text-slate-600">
                  {formatCurrency(expenseThisWeek)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Senin s/d hari ini</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Progress bar vs bulan ini */}
            {expenseThisMonth > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">dari pengeluaran bulan ini</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {Math.round((expenseThisWeek / expenseThisMonth) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Math.round((expenseThisWeek / expenseThisMonth) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pengeluaran Bulan Ini */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Pengeluaran Bulan Ini
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(expenseThisMonth)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date())}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            {/* Progress bar vs total expense */}
            {totalExpense > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">dari total pengeluaran</span>
                  <span className="text-xs font-semibold text-indigo-600">
                    {Math.round((expenseThisMonth / totalExpense) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Math.round((expenseThisMonth / totalExpense) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
