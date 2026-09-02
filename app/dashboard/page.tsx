import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getSummary, getRecentTransactions, getWeeklyData } from "@/lib/actions/transaction"
import { HeroCard } from "@/components/dashboard/hero-card"
import { CashflowTrendChart } from "@/components/dashboard/cashflow-trend-chart"
import { WeeklyBarChart } from "@/components/dashboard/weekly-bar-chart"
import { SpendingCategoryChart } from "@/components/dashboard/spending-category-chart"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { UpcomingTransactions } from "@/components/dashboard/upcoming-transactions"

export default async function DashboardPage() {
  const user = await requireAuth()
  const summary = await getSummary()
  const recentTransactions = await getRecentTransactions(5)
  const weeklyData = await getWeeklyData()

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

        {/* Hero Card - Balance */}
        <HeroCard balance={summary.profit} changePercent={summary.totalIncome > 0 ? ((summary.profit / summary.totalIncome) * 100).toFixed(1) : "0"} />

        {/* Cashflow Insight Line Chart */}
        <CashflowTrendChart 
          income={summary.totalIncome}
          expense={summary.totalExpense}
          profit={summary.profit}
        />

        {/* Grid: Bar Chart + Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklyBarChart weeklyData={weeklyData} />
          <SpendingCategoryChart 
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
          />
        </div>

        {/* AI Insights */}
        <AIInsights 
          profit={summary.profit}
          expenseWeek={summary.expenseThisWeek}
          expenseMonth={summary.expenseThisMonth}
        />

        {/* Upcoming Bills / Recent Transactions */}
        <UpcomingTransactions transactions={recentTransactions} />

      </div>
    </DashboardLayout>
  )
}
