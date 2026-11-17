import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getSummary, getRecentTransactions, getBalanceTimeline } from "@/lib/actions/transaction"
import { HeroCard } from "@/components/dashboard/hero-card"
import { CashflowTrendChart } from "@/components/dashboard/cashflow-trend-chart"
import { CashflowLineChart } from "@/components/dashboard/cashflow-line-chart"
import { SpendingCategoryChart } from "@/components/dashboard/spending-category-chart"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { UpcomingTransactions } from "@/components/dashboard/upcoming-transactions"
import { Suspense } from "react"

// Cache page data for 30 seconds
export const revalidate = 30

async function ChartsSection() {
  const balanceData = await getBalanceTimeline()
  const summary = await getSummary()

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <CashflowLineChart balanceData={balanceData} />
      <SpendingCategoryChart
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />
    </div>
  )
}

async function RecentTransactionsSection() {
  const recentTransactions = await getRecentTransactions(20)
  return <UpcomingTransactions transactions={recentTransactions} />
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 animate-pulse">
      {[1, 2].map((item) => (
        <div key={item} className="h-80 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 h-3 w-28 rounded-full bg-slate-200" />
          <div className="mb-3 h-5 w-44 rounded-full bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function TransactionsSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 h-3 w-28 rounded-full bg-slate-200" />
      <div className="mb-6 h-5 w-48 rounded-full bg-slate-200" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div>
                <div className="mb-2 h-3 w-32 rounded-full bg-slate-200" />
                <div className="h-2.5 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="h-3 w-24 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await requireAuth()
  const summary = await getSummary()

  return (
    <DashboardLayout userName={user.name}>
      <div className="mx-auto max-w-[1440px] space-y-6 pb-8 sm:space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">PERSONAL FINANCE</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Good morning, {user.name} <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Here&apos;s a clear overview of your money and recent activity.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your financial overview
          </div>
        </header>

        <HeroCard
          balance={summary.profit}
          changePercent={summary.totalIncome > 0 ? ((summary.profit / summary.totalIncome) * 100).toFixed(1) : "0"}
        />

        <CashflowTrendChart
          income={summary.totalIncome}
          expense={summary.totalExpense}
          profit={summary.profit}
        />

        <section className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Your activity</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Cashflow analytics</h2>
          </div>
          <Suspense fallback={<ChartsSkeleton />}>
            <ChartsSection />
          </Suspense>
        </section>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <section className="min-w-0 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Latest activity</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Recent transactions</h2>
            </div>
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactionsSection />
            </Suspense>
          </section>
          <AIInsights
            profit={summary.profit}
            expenseWeek={summary.expenseThisWeek}
            expenseMonth={summary.expenseThisMonth}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
