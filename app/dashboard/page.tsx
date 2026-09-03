import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getSummary, getRecentTransactions, getWeeklyData } from "@/lib/actions/transaction"
import { HeroCard } from "@/components/dashboard/hero-card"
import { CashflowTrendChart } from "@/components/dashboard/cashflow-trend-chart"
import { WeeklyBarChart } from "@/components/dashboard/weekly-bar-chart"
import { SpendingCategoryChart } from "@/components/dashboard/spending-category-chart"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { UpcomingTransactions } from "@/components/dashboard/upcoming-transactions"
import { Suspense } from "react"

// Cache page data untuk 30 detik
export const revalidate = 30

// Komponen untuk charts yang berat - akan di-stream
async function ChartsSection() {
  const weeklyData = await getWeeklyData()
  const summary = await getSummary()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <WeeklyBarChart weeklyData={weeklyData} />
      <SpendingCategoryChart 
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />
    </div>
  )
}

// Komponen untuk recent transactions - akan di-stream
async function RecentTransactionsSection() {
  const recentTransactions = await getRecentTransactions(5)
  return <UpcomingTransactions transactions={recentTransactions} />
}

// Skeleton untuk charts
function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
      <div className="bg-white rounded-xl shadow-sm p-6 h-80">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 h-80">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    </div>
  )
}

// Skeleton untuk transactions
function TransactionsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="h-5 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await requireAuth()
  // Data yang cepat di-fetch dulu
  const summary = await getSummary()

  return (
    <DashboardLayout userName={user.name}>
      <div className="space-y-5 pb-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Your smartly shared every day</p>
        </div>

        {/* Hero Card - Balance (quick data) */}
        <HeroCard balance={summary.profit} changePercent={summary.totalIncome > 0 ? ((summary.profit / summary.totalIncome) * 100).toFixed(1) : "0"} />

        {/* Cashflow Insight Line Chart (quick calculation) */}
        <CashflowTrendChart 
          income={summary.totalIncome}
          expense={summary.totalExpense}
          profit={summary.profit}
        />

        {/* Charts - Streaming dengan Suspense */}
        <Suspense fallback={<ChartsSkeleton />}>
          <ChartsSection />
        </Suspense>

        {/* AI Insights (quick calculation) */}
        <AIInsights 
          profit={summary.profit}
          expenseWeek={summary.expenseThisWeek}
          expenseMonth={summary.expenseThisMonth}
        />

        {/* Recent Transactions - Streaming dengan Suspense */}
        <Suspense fallback={<TransactionsSkeleton />}>
          <RecentTransactionsSection />
        </Suspense>

      </div>
    </DashboardLayout>
  )
}
