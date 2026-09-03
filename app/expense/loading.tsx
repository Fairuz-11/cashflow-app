export default function ExpenseLoading() {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Total card skeleton */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="px-4 pb-4 lg:px-6 lg:pb-6 pt-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
