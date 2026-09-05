"use client"

import { useState } from "react"

interface WeeklyBarChartProps {
  weeklyData: Array<{
    label: string
    income: number
    expense: number
  }>
}

type TimeRange = '1week' | '1month' | '3months'

interface TooltipData {
  label: string
  income: number
  expense: number
  x: number
  y: number
}

export function WeeklyBarChart({ weeklyData }: WeeklyBarChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month')
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  // Filter data berdasarkan time range
  const getFilteredData = () => {
    switch (timeRange) {
      case '1week':
        return weeklyData.slice(-1) // 1 minggu terakhir
      case '1month':
        return weeklyData.slice(-4) // 4 minggu terakhir
      case '3months':
        return weeklyData.slice(-12) // 12 minggu terakhir
      default:
        return weeklyData.slice(-4)
    }
  }

  const filteredData = getFilteredData()
  const maxValue = Math.max(...filteredData.map(d => Math.max(d.income, d.expense)))

  const filterButtons: Array<{ value: TimeRange; label: string }> = [
    { value: '1week', label: '1 Week' },
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleBarHover = (data: typeof filteredData[0], event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      label: data.label,
      income: data.income,
      expense: data.expense,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  const handleBarLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Income vs. Spending</h3>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setTimeRange(btn.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeRange === btn.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container dengan horizontal scroll */}
      <div className="overflow-x-auto pb-2">
        <div 
          className="h-48 flex items-end justify-between gap-3 sm:gap-4 px-2"
          style={{ 
            minWidth: filteredData.length > 4 ? `${filteredData.length * 60}px` : '100%' 
          }}
        >
          {filteredData.map((data, idx) => {
            const incomeHeight = maxValue > 0 ? (data.income / maxValue) * 100 : 0
            const expenseHeight = maxValue > 0 ? (data.expense / maxValue) * 100 : 0

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-2"
                style={{ 
                  width: filteredData.length > 4 ? '50px' : 'auto',
                  flex: filteredData.length <= 4 ? '1' : 'none'
                }}
                onMouseEnter={(e) => handleBarHover(data, e)}
                onMouseLeave={handleBarLeave}
              >
                {/* Bar container dengan max height */}
                <div className="w-full flex gap-1 sm:gap-1.5 items-end" style={{ height: '140px' }}>
                  {/* Income bar */}
                  <div 
                    className="flex-1 bg-emerald-400 rounded-t-lg transition-all duration-300 hover:bg-emerald-500 cursor-pointer"
                    style={{ 
                      height: `${Math.min(incomeHeight, 100)}%`,
                      minHeight: incomeHeight > 0 ? '4px' : '0'
                    }}
                  />
                  {/* Expense bar */}
                  <div 
                    className="flex-1 bg-slate-800 rounded-t-lg transition-all duration-300 hover:bg-slate-700 cursor-pointer"
                    style={{ 
                      height: `${Math.min(expenseHeight, 100)}%`,
                      minHeight: expenseHeight > 0 ? '4px' : '0'
                    }}
                  />
                </div>
                {/* Label dengan truncate untuk text panjang */}
                <span className="text-[10px] sm:text-xs text-gray-500 truncate w-full text-center">
                  {data.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll Hint - muncul kalau data banyak */}
      {filteredData.length > 4 && (
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Scroll untuk lihat semua</span>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`,
          }}
        >
          <div className="font-semibold mb-1 text-center whitespace-nowrap">{tooltip.label}</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-2 h-2 bg-emerald-400 rounded-sm flex-shrink-0"></div>
              <span className="text-gray-300">Income:</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(tooltip.income)}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-2 h-2 bg-slate-400 rounded-sm flex-shrink-0"></div>
              <span className="text-gray-300">Expense:</span>
              <span className="font-semibold text-red-400">{formatCurrency(tooltip.expense)}</span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
          <span className="text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-slate-800 rounded-sm" />
          <span className="text-gray-600">Spending</span>
        </div>
      </div>
    </div>
  )
}
