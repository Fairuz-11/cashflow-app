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

export function WeeklyBarChart({ weeklyData }: WeeklyBarChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month')

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

      {/* Chart */}
      <div className="h-48 flex items-end justify-between gap-4">
        {filteredData.map((data, idx) => {
          const incomeHeight = maxValue > 0 ? (data.income / maxValue) * 100 : 0
          const expenseHeight = maxValue > 0 ? (data.expense / maxValue) * 100 : 0

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1.5 items-end" style={{ height: '140px' }}>
                {/* Income bar */}
                <div 
                  className="flex-1 bg-emerald-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${incomeHeight}%` }}
                  title={`Income: Rp${data.income.toLocaleString('id-ID')}`}
                />
                {/* Expense bar */}
                <div 
                  className="flex-1 bg-slate-800 rounded-t-lg transition-all duration-500"
                  style={{ height: `${expenseHeight}%` }}
                  title={`Expense: Rp${data.expense.toLocaleString('id-ID')}`}
                />
              </div>
              <span className="text-xs text-gray-500">{data.label}</span>
            </div>
          )
        })}
      </div>

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
