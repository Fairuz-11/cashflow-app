import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getSummary, getRecentTransactions } from "@/lib/actions/transaction"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy components
const SummaryCards = dynamic(() => import('@/components/dashboard/summary-cards').then(mod => ({ default: mod.SummaryCards })), {
  loading: () => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /></div>
})

const RecentTransactions = dynamic(() => import('@/components/dashboard/recent-transactions').then(mod => ({ default: mod.RecentTransactions })), {
  loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
})

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function DashboardPage() {
  const user = await requireAuth()
  const summary = await getSummary()
  const recentTransactions = await getRecentTransactions(10)

  return (
    <DashboardLayout userName={user.name}>
      <div className="space-y-4 lg:space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Rekap</h1>
          <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">
            Ringkasan keuangan Anda secara keseluruhan
          </p>
        </div>

        {/* Summary Cards */}
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /><div className="h-28 bg-gray-100 rounded-xl animate-pulse" /></div>}>
          <SummaryCards
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            profit={summary.profit}
            expenseThisWeek={summary.expenseThisWeek}
            expenseThisMonth={summary.expenseThisMonth}
          />
        </Suspense>

        {/* Recent Transactions */}
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse" />}>
          <RecentTransactions transactions={recentTransactions} />
        </Suspense>

      </div>
    </DashboardLayout>
  )
}
