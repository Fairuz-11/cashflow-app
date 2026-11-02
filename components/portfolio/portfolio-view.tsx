"use client"

import { useMemo, useState } from "react"

type TimelinePoint = { date: string; label: string; balance: number }
const periods = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "YTD", days: -1 },
  { label: "1Y", days: 365 },
  { label: "All", days: 0 },
]

const currency = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(value)

export function PortfolioView({ timeline }: { timeline: TimelinePoint[] }) {
  const [period, setPeriod] = useState("1M")
  const latest = timeline[timeline.length - 1]
  const currentBalance = latest?.balance ?? 0

  const performance = useMemo(() => {
    if (!latest || timeline.length === 0) return { points: [], change: 0, percent: null as number | null }
    const selected = periods.find((item) => item.label === period)!
    const start = new Date()
    if (selected.days === -1) start.setMonth(0, 1)
    else if (selected.days > 0) start.setDate(start.getDate() - selected.days)
    else start.setFullYear(1970)
    const startKey = start.toISOString().slice(0, 10)
    const points = timeline.filter((point) => point.date >= startKey)
    const previous = [...timeline].reverse().find((point) => point.date < startKey)
    const baseline = previous?.balance
    const change = currentBalance - (baseline ?? (points[0]?.balance ?? 0))
    const percent = baseline && baseline !== 0 ? (change / baseline) * 100 : null
    return { points: points.length ? points : [latest], change, percent }
  }, [timeline, period, latest, currentBalance])

  const values = performance.points.map((point) => point.balance)
  const min = Math.min(...values, currentBalance)
  const max = Math.max(...values, currentBalance)
  const range = max - min || 1
  const chartPoints = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100
    const y = 92 - ((value - min) / range) * 82
    return `${x},${y}`
  }).join(" ")
  const positive = performance.change >= 0

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 pb-8">
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">PERSONAL FINANCE</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Portofolio</h1>
        <p className="mt-2 text-sm text-slate-500">Pantau perkembangan saldo dan arus keuanganmu.</p>
      </header>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Balance</p>
            <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{currency(currentBalance)}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {positive ? "+" : ""}{currency(performance.change)}
              </span>
              {performance.percent !== null ? (
                <span className={`text-sm font-semibold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
                  {positive ? "+" : ""}{performance.percent.toFixed(2)}%
                </span>
              ) : (
                <span className="text-xs text-slate-400">Persentase belum tersedia untuk periode ini</span>
              )}
              <span className="text-xs text-slate-400">perubahan saldo pada periode terpilih</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
            {periods.map((item) => (
              <button key={item.label} onClick={() => setPeriod(item.label)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${period === item.label ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`} aria-pressed={period === item.label}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 h-52 w-full sm:h-64">
          {timeline.length > 1 ? (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible" role="img" aria-label="Grafik perkembangan saldo">
              <defs>
                <linearGradient id="portfolio-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity=".2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#portfolio-fill)" />
              <polyline points={chartPoints} fill="none" stroke="#059669" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">Belum cukup data transaksi untuk menampilkan grafik.</div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">Grafik berdasarkan akumulasi transaksi yang tercatat. Saldo awal sebelum transaksi pertama dianggap Rp0.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Pemasukan</p>
          <p className="mt-2 text-xl font-bold text-emerald-700">{currency(timeline.length ? Math.max(0, currentBalance) : 0)}</p>
          <p className="mt-1 text-xs text-slate-400">Saldo bersih saat ini bukan total pemasukan</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Perubahan Saldo</p>
          <p className={`mt-2 text-xl font-bold ${positive ? "text-emerald-700" : "text-rose-600"}`}>{positive ? "+" : ""}{currency(performance.change)}</p>
          <p className="mt-1 text-xs text-slate-400">Pada periode terpilih</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Jumlah Hari Tercatat</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{timeline.length}</p>
          <p className="mt-1 text-xs text-slate-400">Sejak transaksi pertama</p>
        </div>
      </section>
    </div>
  )
}
