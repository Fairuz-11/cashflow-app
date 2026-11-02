import { requireAuth } from "@/lib/session"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getBalanceTimeline, getSummary } from "@/lib/actions/transaction"
import { PortfolioView } from "@/components/portfolio/portfolio-view"

export const revalidate = 30

export default async function PortfolioPage() {
  const user = await requireAuth()
  const [timeline, summary] = await Promise.all([getBalanceTimeline(), getSummary()])

  return (
    <DashboardLayout userName={user.name}>
      <PortfolioView
        timeline={timeline}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />
    </DashboardLayout>
  )
}
