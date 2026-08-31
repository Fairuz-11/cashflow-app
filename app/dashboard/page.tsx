import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { getSummary, getRecentTransactions } from "@/lib/actions/transaction"

export default async function DashboardPage() {
  const user = await requireAuth()
  const summary = await getSummary()
  const recentTransactions = await getRecentTransactions(10)

  return (
    <DashboardLayout userName={user.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekap</h1>
          <p className="text-gray-600 mt-1">
            Ringkasan keuangan Anda secara keseluruhan
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          profit={summary.profit}
          expenseThisWeek={summary.expenseThisWeek}
          expenseThisMonth={summary.expenseThisMonth}
        />

        {/* Recent Transactions */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </DashboardLayout>
  )
}
