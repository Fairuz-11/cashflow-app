"use client"

interface AIInsightsProps {
  profit: number
  expenseWeek: number
  expenseMonth: number
}

export function AIInsights({ profit, expenseWeek, expenseMonth }: AIInsightsProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
  const savingsPotential = expenseMonth * 0.2 // 20% savings potential

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">AI insight</h3>
      
      <div className="space-y-3">
        {/* Insight 1 */}
        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-0.5">
              You can save <span className="font-bold text-emerald-600">{fmt(savingsPotential)}</span> this month
            </p>
            <p className="text-xs text-gray-600">if dining spend stays on track</p>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-0.5">Great job!</p>
            <p className="text-xs text-gray-600">You spent 14% less than your average this week</p>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-0.5">Time to resubscribe?</p>
            <p className="text-xs text-gray-600">Your monthly 14% less than your subscriptions are coming</p>
          </div>
        </div>
      </div>
    </div>
  )
}
