"use client"

import { useMemo, useState } from "react"

interface CashflowLineChartProps {
  balanceData: Array<{
    date: string
    label: string
    balance: number
  }>
}

type TimeRange = "1week" | "1month" | "3months" | "alltime"

const WIDTH = 760
const HEIGHT = 280
const PADDING = { top: 20, right: 22, bottom: 42, left: 76 }
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
  const sign = amount < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}Rp${(abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`
  if (abs >= 1_000) return `${sign}Rp${(abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`
  return `${sign}Rp${abs.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`
}

export function CashflowLineChart({ balanceData }: CashflowLineChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1month")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const filteredData = useMemo(() => {
    if (balanceData.length === 0) return []
    if (timeRange === "alltime") return balanceData

    const days = timeRange === "1week" ? 7 : timeRange === "1month" ? 30 : 90
    const latestDate = new Date(`${balanceData[balanceData.length - 1].date}T00:00:00.000Z`)
    const cutoff = new Date(latestDate)
    cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1))
    const cutoffKey = cutoff.toISOString().slice(0, 10)
    const inRange = balanceData.filter((point) => point.date >= cutoffKey)

    // Keep the balance immediately before the range so the line starts from its prior level.
    let previous: (typeof balanceData)[number] | undefined
    for (const point of balanceData) {
      if (point.date >= cutoffKey) break
      previous = point
    }
    return previous ? [previous, ...inRange] : inRange
  }, [balanceData, timeRange])

  const plottedData = useMemo(() => {
    if (filteredData.length <= 140) return filteredData
    const step = Math.ceil((filteredData.length - 1) / 139)
    const sampled = filteredData.filter((_, index) => index % step === 0)
    const last = filteredData[filteredData.length - 1]
    if (sampled[sampled.length - 1]?.date !== last.date) sampled.push(last)
    return sampled
  }, [filteredData])

  const minValue = Math.min(0, ...plottedData.map((point) => point.balance))
  const maxValue = Math.max(0, ...plottedData.map((point) => point.balance))
  const valueRange = maxValue - minValue
  const paddingValue = valueRange > 0 ? valueRange * 0.12 : Math.max(Math.abs(maxValue) * 0.1, 1000)
  const chartMin = minValue - paddingValue
  const chartMax = maxValue + paddingValue
  const chartRange = chartMax - chartMin || 1
  const xFor = (index: number) =>
    PADDING.left + (plottedData.length <= 1 ? CHART_WIDTH / 2 : (index / (plottedData.length - 1)) * CHART_WIDTH)
  const yFor = (value: number) => PADDING.top + CHART_HEIGHT - ((value - chartMin) / chartRange) * CHART_HEIGHT
  const balancePath = plottedData.map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(point.balance)}`).join(" ")
  const areaPath = plottedData.length > 1
    ? `${balancePath} L ${xFor(plottedData.length - 1)} ${PADDING.top + CHART_HEIGHT} L ${xFor(0)} ${PADDING.top + CHART_HEIGHT} Z`
    : ""
  const selected = activeIndex !== null ? plottedData[activeIndex] : null
  const filterButtons: Array<{ value: TimeRange; label: string }> = [
    { value: "1week", label: "1W" },
    { value: "1month", label: "1M" },
    { value: "3months", label: "3M" },
    { value: "alltime", label: "All Time" },
  ]

  return (
    <section className="min-w-0 rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Cashflow market</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-950">Pergerakan saldo</h3>
          <p className="mt-1 text-sm text-slate-500">Saldo kumulatif berdasarkan transaksi dari waktu ke waktu</p>
        </div>
        <div className="flex w-fit flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1" aria-label="Pilih rentang waktu">
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
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Saldo kumulatif</span>
        <span className="ml-auto text-[11px] text-slate-400">
          {timeRange === "alltime" ? "Sejak transaksi pertama" : timeRange === "1week" ? "7 hari terakhir" : timeRange === "1month" ? "30 hari terakhir" : "90 hari terakhir"}
        </span>
      </div>

      {plottedData.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              role="img"
              aria-label="Grafik saldo kumulatif berdasarkan transaksi"
              className="h-auto min-w-[520px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((tick) => {
                const value = chartMin + (chartRange / 4) * tick
                const y = yFor(value)
                return (
                  <g key={tick}>
                    <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
                    <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{formatCompact(value)}</text>
                  </g>
                )
              })}
              {areaPath && <path d={areaPath} fill="url(#balanceArea)" />}
              <path d={balancePath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {plottedData.map((point, index) => {
                const x = xFor(index)
                const y = yFor(point.balance)
                const isActive = activeIndex === index
                const showLabel = plottedData.length <= 8 || index === 0 || index === plottedData.length - 1 || index === Math.floor(plottedData.length / 2)
                return (
                  <g
                    key={point.date}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label}: saldo ${formatCurrency(point.balance)}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    className="cursor-pointer outline-none"
                  >
                    <rect x={x - 8} y={PADDING.top} width="16" height={CHART_HEIGHT} fill="transparent" />
                    {isActive && <line x1={x} x2={x} y1={PADDING.top} y2={PADDING.top + CHART_HEIGHT} stroke="#cbd5e1" strokeDasharray="3 4" />}
                    {(isActive || plottedData.length === 1) && <circle cx={x} cy={y} r={5} fill="#10b981" stroke="white" strokeWidth="2" />}
                    {showLabel && <text x={x} y={HEIGHT - 14} textAnchor="middle" fontSize="11" fill="#94a3b8">{point.label}</text>}
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
                  <p className="mt-1 text-base font-bold text-emerald-700">{formatCurrency(selected.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Saldo kumulatif</p>
                  <p className={"mt-1 text-base font-bold " + (selected.balance >= 0 ? "text-slate-900" : "text-rose-600")}>
                    {selected.balance < 0 ? "−" : ""}{formatCurrency(Math.abs(selected.balance))}
                  </p>
                </div>
              </div>
            ) : (
              <p className="flex min-h-[42px] items-center text-xs text-slate-400">Arahkan kursor atau fokuskan titik grafik untuk melihat saldo pada tanggal tersebut.</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">
          Belum ada transaksi untuk menampilkan riwayat saldo.
        </div>
      )}
    </section>
  )
}
