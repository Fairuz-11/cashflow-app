"use client"

import { useState } from "react"

interface WeeklyBarChartProps {
  weeklyData: Array<{
    label: string
    income: number
    expense: number
  }>
}

type TimeRange = "1week" | "1month" | "3months"

interface TooltipData {
  label: string
  income: number
  expense: number
  x: number
  y: number
}

export function WeeklyBarChart({ weeklyData }: WeeklyBarChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1month")
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const getFilteredData = () => {
    switch (timeRange) {
      case "1week":
        return weeklyData.slice(-1)
      case "1month":
        return weeklyData.slice(-4)
      case "3months":
        return weeklyData.slice(-12)
      default:
        return weeklyData.slice(-4)
    }
  }

  const filteredData = getFilteredData()
  const maxValue = Math.max(0, ...filteredData.map((d) => Math.max(d.income, d.expense)))
  const filterButtons: Array<{ value: TimeRange; label: string }> = [
    { value: "1week", label: "1 Week" },
    { value: "1month", label: "1 Month" },
    { value: "3months", label: "3 Months" },
  ]

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const handleBarHover = (data: (typeof filteredData)[number], event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      label: data.label,
      income: data.income,
      expense: data.expense,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  return (
    <section className="min-w-0 rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Trend</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Income vs. spending</h3>
          <p className="mt-1 text-sm text-slate-500">Compare your weekly money flow</p>
        </div>
        <div className="flex w-fit max-w-full items-center gap-1 rounded-xl bg-slate-100 p-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => setTimeRange(btn.value)}
              aria-pressed={timeRange === btn.value}
              className={"rounded-lg px-2.5 py-2 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs " + (
                timeRange === btn.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        {filteredData.length > 0 ? (
          <div className="flex h-48 min-w-full items-end justify-between gap-3 px-1 sm:gap-4">
            {filteredData.map((data, idx) => {
              const incomeHeight = maxValue > 0 ? (data.income / maxValue) * 100 : 0
              const expenseHeight = maxValue > 0 ? (data.expense / maxValue) * 100 : 0
              return (
                <div
                  key={data.label + "-" + idx}
                  className="flex min-w-0 flex-1 flex-col items-center gap-3"
                  onMouseEnter={(event) => handleBarHover(data, event)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="flex h-36 w-full items-end justify-center gap-1.5 sm:gap-2">
                    <div
                      className="w-full max-w-7 rounded-t-lg bg-emerald-500 transition-all duration-300 hover:bg-emerald-600"
                      style={{ height: incomeHeight + "%", minHeight: data.income > 0 ? "4px" : "0" }}
                      aria-label={"Income " + formatCurrency(data.income)}
                    />
                    <div
                      className="w-full max-w-7 rounded-t-lg bg-slate-300 transition-all duration-300 hover:bg-slate-400"
                      style={{ height: expenseHeight + "%", minHeight: data.expense > 0 ? "4px" : "0" }}
                      aria-label={"Spending " + formatCurrency(data.expense)}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[10px] font-medium text-slate-400 sm:text-xs">{data.label}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">
            No cashflow data for this period
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Income</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />Spending</span>
        </div>
      )}

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white shadow-xl"
          style={{ left: tooltip.x + "px", top: tooltip.y + "px" }}
        >
          <p className="mb-2 whitespace-nowrap text-center font-semibold">{tooltip.label}</p>
          <p className="whitespace-nowrap text-emerald-300">Income: {formatCurrency(tooltip.income)}</p>
          <p className="mt-1 whitespace-nowrap text-slate-300">Spending: {formatCurrency(tooltip.expense)}</p>
        </div>
      )}
    </section>
  )
}
