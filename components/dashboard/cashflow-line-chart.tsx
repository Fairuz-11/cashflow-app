"use client"

import { useMemo, useState } from "react"

interface CashflowLineChartProps {
  weeklyData: Array<{
    label: string
    income: number
    expense: number
  }>
}

type TimeRange = "1week" | "1month" | "3months"

const WIDTH = 760
const HEIGHT = 280
const PADDING = { top: 20, right: 22, bottom: 42, left: 66 }
const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right
const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCompact(amount: number) {
  const abs = Math.abs(amount)
  if (abs >= 1_000_000) return `Rp${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`
  if (abs >= 1_000) return `Rp${(amount / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`
  return `Rp${amount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`
}

export function CashflowLineChart({ weeklyData }: CashflowLineChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1month")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const filteredData = useMemo(() => {
    if (timeRange === "1week") return weeklyData.slice(-1)
    if (timeRange === "1month") return weeklyData.slice(-4)
    return weeklyData.slice(-12)
  }, [timeRange, weeklyData])

  const maxValue = Math.max(0, ...filteredData.flatMap((point) => [point.income, point.expense]))
  const chartMax = maxValue > 0 ? maxValue * 1.15 : 1
  const xFor = (index: number) =>
    PADDING.left + (filteredData.length <= 1 ? CHART_WIDTH / 2 : (index / (filteredData.length - 1)) * CHART_WIDTH)
  const yFor = (value: number) => PADDING.top + CHART_HEIGHT - (value / chartMax) * CHART_HEIGHT
  const incomePath = filteredData.map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(point.income)}`).join(" ")
  const expensePath = filteredData.map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(point.expense)}`).join(" ")
  const selected = activeIndex !== null ? filteredData[activeIndex] : null
  const filterButtons: Array<{ value: TimeRange; label: string }> = [
    { value: "1week", label: "1W" },
    { value: "1month", label: "1M" },
    { value: "3months", label: "3M" },
  ]

  return (
    <section className="min-w-0 rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Cashflow market</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-950">Pergerakan arus uang</h3>
          <p className="mt-1 text-sm text-slate-500">Pantau pemasukan dan pengeluaran dari minggu ke minggu</p>
        </div>
        <div className="flex w-fit items-center gap-1 rounded-xl bg-slate-100 p-1" aria-label="Pilih rentang waktu">
          {filterButtons.map((button) => (
            <button
              key={button.value}
              type="button"
              onClick={() => {
                setTimeRange(button.value)
                setActiveIndex(null)
              }}
              aria-pressed={timeRange === button.value}
              className={"rounded-lg px-3 py-2 text-xs font-semibold transition-colors " + (
                timeRange === button.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Pemasukan</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" />Pengeluaran</span>
        <span className="ml-auto text-[11px] text-slate-400">Nilai per minggu</span>
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              role="img"
              aria-label="Grafik garis pemasukan dan pengeluaran per minggu"
              className="h-auto min-w-[520px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((tick) => {
                const value = (chartMax / 4) * tick
                const y = yFor(value)
                return (
                  <g key={tick}>
                    <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
                    <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{formatCompact(value)}</text>
                  </g>
                )
              })}
              {filteredData.length > 1 && (
                <path
                  d={`${incomePath} L ${xFor(filteredData.length - 1)} ${PADDING.top + CHART_HEIGHT} L ${xFor(0)} ${PADDING.top + CHART_HEIGHT} Z`}
                  fill="url(#incomeArea)"
                />
              )}
              <path d={incomePath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={expensePath} fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {filteredData.map((point, index) => {
                const x = xFor(index)
                const incomeY = yFor(point.income)
                const expenseY = yFor(point.expense)
                const isActive = activeIndex === index
                return (
                  <g
                    key={point.label + "-" + index}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: pemasukan ${formatCurrency(point.income)}, pengeluaran ${formatCurrency(point.expense)}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    className="cursor-pointer outline-none"
                  >
                    <rect x={x - 18} y={PADDING.top} width="36" height={CHART_HEIGHT} fill="transparent" />
                    <line x1={x} x2={x} y1={PADDING.top} y2={PADDING.top + CHART_HEIGHT} stroke={isActive ? "#cbd5e1" : "transparent"} strokeDasharray="3 4" />
                    <circle cx={x} cy={incomeY} r={isActive ? 6 : 4} fill="#10b981" stroke="white" strokeWidth="2" />
                    <circle cx={x} cy={expenseY} r={isActive ? 5.5 : 3.5} fill="#fb7185" stroke="white" strokeWidth="2" />
                    <text x={x} y={HEIGHT - 14} textAnchor="middle" fontSize="11" fill={isActive ? "#334155" : "#94a3b8"} fontWeight={isActive ? 600 : 400}>{point.label}</text>
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="mt-2 min-h-[68px] rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            {selected ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{selected.label}</p>
                  <p className="mt-1 text-sm font-bold text-emerald-700">+{formatCurrency(selected.income)}</p>
                  <p className="mt-0.5 text-xs text-rose-600">−{formatCurrency(selected.expense)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Selisih minggu ini</p>
                  <p className={"mt-1 text-base font-bold " + (selected.income - selected.expense >= 0 ? "text-slate-900" : "text-rose-600")}>
                    {formatCurrency(selected.income - selected.expense)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="flex min-h-[42px] items-center text-xs text-slate-400">Arahkan kursor atau fokuskan titik grafik untuk melihat detail pemasukan dan pengeluaran.</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">
          Belum ada data arus kas untuk periode ini.
        </div>
      )}
    </section>
  )
}
