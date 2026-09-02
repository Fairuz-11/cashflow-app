export default function DashboardLoading() {
  return (
    <div className="space-y-5 pb-6 animate-pulse">
      {/* Greeting skeleton */}
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
      </div>

      {/* Hero card skeleton */}
      <div className="h-40 bg-gray-200 rounded-2xl"></div>

      {/* Cashflow trend skeleton */}
      <div className="h-32 bg-gray-200 rounded-2xl"></div>

      {/* Charts grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
        <div className="h-80 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* AI insights skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Transactions skeleton */}
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
    </div>
  )
}
