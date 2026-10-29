"use client"

interface AIInsightsProps {
  profit: number
  expenseWeek: number
  expenseMonth: number
}

export function AIInsights({ expenseMonth }: AIInsightsProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
  const savingsPotential = expenseMonth * 0.2

  const insights = [
    {
      title: <>Potential savings of <span className="font-bold text-emerald-700">{fmt(savingsPotential)}</span></>,
      description: "if dining spend stays on track",
      icon: "M13 10V3L4 14h7v7l9-11h-7",
      tone: "emerald",
    },
    {
      title: "Great job!",
      description: "You spent 14% less than your average this week",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0",
      tone: "blue",
    },
    {
      title: "Time to resubscribe?",
      description: "Your monthly subscriptions may be coming up",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      tone: "amber",
    },
  ]

  return (
    <section className="h-full rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Personalized notes</p>
        <div className="mt-1 flex items-center gap-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">AI insights</h3>
          <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">Beta</span>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.description} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-colors hover:bg-white">
            <span className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + (insight.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : insight.tone === "blue" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={insight.icon} />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-5 text-slate-800">{insight.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
