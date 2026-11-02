"use client"

import { useMemo, useState } from "react"

type TimelinePoint = { date: string; label: string; balance: number }
type Metric = "balance" | "income" | "expense"

const periods = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "YTD", days: -1 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 1095 },
  { label: "5Y", days: 1825 },
  { label: "All", days: 0 },
]

const currency = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(value)

const compactCurrency = (value: number) => {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`
  if (abs >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`
  if (abs >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`
  return `Rp${Math.round(value)}`
}

export function PortfolioView({ timeline, totalIncome, totalExpense }: { timeline: TimelinePoint[]; totalIncome: number; totalExpense: number }) {
  const [period, setPeriod] = useState("1M")
  const [metric, setMetric] = useState<Metric>("balance")
  const latest = timeline[timeline.length - 1]
  const currentBalance = latest?.balance ?? 0

  const performance = useMemo(() => {
    if (!latest || timeline.length === 0) return { points: [], change: 0, percent: null as number | null }
    const selected = periods.find((item) => item.label === period)!
    const start = new Date()
    if (selected.days === -1) start.setMonth(0, 1)
    else if (selected.days > 0) start.setDate(start.getDate() - selected.days)
    else { start.setFullYear(1970, 0, 1); start.setHours(0, 0, 0, 0) }
    const startKey = start.toISOString().slice(0, 10)
    const points = timeline.filter((point) => point.date >= startKey)
    const previous = [...timeline].reverse().find((point) => point.date < startKey)
    const baseline = selected.days === 0 ? 0 : previous?.balance
    const change = currentBalance - (baseline ?? (points[0]?.balance ?? 0))
    const percent = baseline && baseline !== 0 ? (change / Math.abs(baseline)) * 100 : null
    return { points: points.length ? points : [latest], change, percent }
  }, [timeline, period, latest, currentBalance])

  const chartValues = useMemo(() => {
    const points = performance.points
    if (metric === "balance") return points.map((point) => point.balance)
    return points.map((point, index) => {
      const previous = index > 0 ? points[index - 1].balance : 0
      const movement = point.balance - previous
      return metric === "income" ? Math.max(0, movement) : Math.max(0, -movement)
    })
  }, [performance.points, metric])

  const values = chartValues.length ? chartValues : [0]
  const min = Math.min(...values, ...(metric === "balance" ? [currentBalance] : [0]))
  const max = Math.max(...values, ...(metric === "balance" ? [currentBalance] : [0]))
  const range = max - min || Math.max(Math.abs(max) * 0.08, 1)
  const chartPoints = values.map((value, index) => {
    const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100
    const y = 90 - ((value - min) / range) * 78
    return { x, y }
  })
  const line = chartPoints.map((point) => `${point.x},${point.y}`).join(" ")
  const area = `0,100 ${line} 100,100`
  const positive = performance.change >= 0
  const mainValue = metric === "balance" ? currentBalance : metric === "income" ? totalIncome : totalExpense
  const metricTitle = metric === "balance" ? "Total Saldo" : metric === "income" ? "Total Pemasukan" : "Total Pengeluaran"
  const chartColor = metric === "expense" ? "#f87171" : "#00b386"

  return (
    <div className="-mx-4 -my-6 min-h-[calc(100vh-4rem)] bg-[#101211] px-4 pb-10 pt-6 text-white sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00b386]">CASHFLOW</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">Portofolio</h1>
            <p className="mt-1 text-xs text-[#8b918e]">Ringkasan perkembangan keuanganmu</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-[#aeb5b1]" aria-hidden="true">↗</div>
        </header>

        <section>
          <p className="text-sm font-medium text-[#8b918e]">{metricTitle}</p>
          <h2 className="mt-2 break-words text-[2.35rem] font-bold leading-none tracking-tight text-white sm:text-5xl">{currency(mainValue)}</h2>
          {metric === "balance" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className={positive ? "font-semibold text-[#00b386]" : "font-semibold text-[#f87171]"}>
                {positive ? "+" : ""}{currency(performance.change)}
              </span>
              {performance.percent !== null && (
                <span className={positive ? "font-semibold text-[#00b386]" : "font-semibold text-[#f87171]"}>
                  ({positive ? "+" : ""}{performance.percent.toFixed(2)}%)
                </span>
              )}
              <span className="text-xs text-[#737b76]">Perubahan saldo · {period}</span>
            </div>
          ) : (
            <p className="mt-3 text-xs text-[#737b76]">Akumulasi seluruh transaksi tercatat</p>
          )}
        </section>

        <section className="mt-7">
          <div className="mb-2 flex justify-between text-[10px] tabular-nums text-[#68716c]">
            <span>{compactCurrency(max)}</span>
            <span>{compactCurrency(min)}</span>
          </div>
          <div className="relative h-[230px] w-full sm:h-[300px]">
            {values.length > 1 ? (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible" role="img" aria-label="Grafik portofolio">
                <defs>
                  <linearGradient id="portfolio-fill-dark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity=".22" />
                    <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="90" x2="100" y2="90" stroke="#59615c" strokeWidth=".35" strokeDasharray="1.5 1.5" vectorEffect="non-scaling-stroke" />
                <polygon points={area} fill="url(#portfolio-fill-dark)" />
                <polyline points={line} fill="none" stroke={chartColor} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={chartPoints[chartPoints.length - 1].x} cy={chartPoints[chartPoints.length - 1].y} r="1.4" fill={chartColor} />
              </svg>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#737b76]">Belum cukup data transaksi untuk menampilkan grafik.</div>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-between text-[10px] tabular-nums text-[#68716c]">
              <span>{compactCurrency(max)}</span>
              <span>{compactCurrency(min + range / 2)}</span>
              <span>{compactCurrency(min)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-1 border-b border-white/10 pb-4">
            {periods.map((item) => (
              <button key={item.label} onClick={() => setPeriod(item.label)} className={`min-w-0 rounded px-1.5 py-2 text-[11px] font-medium transition sm:px-3 sm:text-xs ${period === item.label ? "border-b-2 border-[#00b386] text-[#00b386]" : "text-[#737b76] hover:text-white"}`} aria-pressed={period === item.label}>
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
            {([
              { key: "balance", label: "Saldo", value: currentBalance },
              { key: "income", label: "Pemasukan", value: totalIncome },
              { key: "expense", label: "Pengeluaran", value: totalExpense },
            ] as const).map((item, index) => (
              <button key={item.key} onClick={() => setMetric(item.key)} className={`min-w-0 px-2 py-4 text-center transition sm:px-4 ${index > 0 ? "border-l border-white/10" : ""} ${metric === item.key ? "bg-[#00b386]/10" : "hover:bg-white/[0.04]"}`} aria-pressed={metric === item.key}>
                <p className={`text-[10px] sm:text-xs ${metric === item.key ? "text-[#00b386]" : "text-[#858d88]"}`}>{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold tabular-nums text-white sm:text-base">{compactCurrency(item.value)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-[#858d88]">Total Pemasukan</span>
            <span className="text-sm font-semibold tabular-nums text-[#00b386]">{currency(totalIncome)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] py-3">
            <span className="text-sm text-[#858d88]">Total Pengeluaran</span>
            <span className="text-sm font-semibold tabular-nums text-[#f87171]">{currency(totalExpense)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] py-3">
            <span className="text-sm text-[#858d88]">Net Cashflow</span>
            <span className="text-sm font-semibold tabular-nums text-white">{currency(totalIncome - totalExpense)}</span>
          </div>
        </section>
        <p className="mt-5 text-[11px] leading-relaxed text-[#606963]">Grafik berdasarkan akumulasi transaksi yang tercatat. Saldo awal sebelum transaksi pertama dianggap Rp0. Persentase perubahan bukan imbal hasil investasi.</p>
      </div>
    </div>
  )
}
