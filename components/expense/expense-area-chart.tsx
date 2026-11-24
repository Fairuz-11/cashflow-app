"use client"

import { useMemo, useState, useRef, useCallback } from "react"
import { TransactionData } from "@/types/transaction"

type Period = "1W" | "1M" | "3M" | "6M" | "1Y" | "All"

const W = 600
const H = 200
const PAD = { top: 16, right: 8, bottom: 32, left: 8 }
const CW = W - PAD.left - PAD.right
const CH = H - PAD.top - PAD.bottom

function fmtCompact(n: number) {
  if (n >= 1_000_000_000) return "Rp\u00a0" + (n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0M"
  if (n >= 1_000_000)     return "Rp\u00a0" + (n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
  if (n >= 1_000)         return "Rp\u00a0" + (n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

interface DayPoint { date: string; total: number }

interface ExpenseAreaChartProps {
  transactions: TransactionData[]
}

export function ExpenseAreaChart({ transactions }: ExpenseAreaChartProps) {
  const [period, setPeriod] = useState<Period>("1M")
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const allDays = useMemo<DayPoint[]>(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      const key = new Date(t.transactionDate).toISOString().slice(0, 10)
      map.set(key, (map.get(key) ?? 0) + t.amount)
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }))
  }, [transactions])

  const data = useMemo<DayPoint[]>(() => {
    if (allDays.length === 0) return []
    if (period === "All") return allDays
    const days = period === "1W" ? 7 : period === "1M" ? 30 : period === "3M" ? 90 : period === "6M" ? 180 : 365
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffKey = cutoff.toISOString().slice(0, 10)
    return allDays.filter(d => d.date >= cutoffKey)
  }, [allDays, period])

  const { linePath, areaPath, points } = useMemo(() => {
    if (data.length === 0) return { linePath: "", areaPath: "", points: [] }
    const maxVal = Math.max(...data.map(d => d.total))
    const safeMax = maxVal === 0 ? 1 : maxVal * 1.15
    const xFor = (i: number) => PAD.left + (data.length <= 1 ? CW / 2 : (i / (data.length - 1)) * CW)
    const yFor = (v: number) => PAD.top + CH - (v / safeMax) * CH
    const pts = data.map((d, i) => ({ x: xFor(i), y: yFor(d.total), ...d }))
    let line = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.5
      const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.5
      line += ` C ${cp1x} ${pts[i - 1].y} ${cp2x} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
    }
    const area = `${line} L ${pts[pts.length - 1].x} ${PAD.top + CH} L ${pts[0].x} ${PAD.top + CH} Z`
    return { linePath: line, areaPath: area, points: pts }
  }, [data])

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (points.length === 0) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0, minDist = Infinity
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(points[i].x - svgX)
      if (d < minDist) { minDist = d; nearest = i }
    }
    setHoverIdx(nearest)
  }, [points])

  const hovered = hoverIdx !== null ? points[hoverIdx] : null
  const fmtDateLabel = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

  const periods: Period[] = ["1W", "1M", "3M", "6M", "1Y", "All"]
  const periodTotal = data.reduce((s, d) => s + d.total, 0)
  const periodTxCount = useMemo(() => {
    if (data.length === 0) return 0
    const start = data[0].date
    const end = data[data.length - 1].date
    return transactions.filter(t => {
      const k = new Date(t.transactionDate).toISOString().slice(0, 10)
      return k >= start && k <= end
    }).length
  }, [data, transactions])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-400">Total periode ini</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {fmtCompact(hovered ? hovered.total : periodTotal)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {hovered ? fmtDateLabel(hovered.date) : `${periodTxCount} transaksi`}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 shrink-0">
            {periods.map(p => (
              <button key={p} onClick={() => { setPeriod(p); setHoverIdx(null) }}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                  period === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 sm:px-3">
        {data.length < 2 ? (
          <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50">
            <p className="text-xs text-slate-400">
              {data.length === 0 ? "Belum ada data untuk periode ini" : "Tambahkan lebih banyak transaksi untuk melihat grafik"}
            </p>
          </div>
        ) : (
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#expenseGrad)" />
            <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
            {points.length > 0 && (() => {
              const labelCount = Math.min(5, points.length)
              const step = Math.floor((points.length - 1) / (labelCount - 1)) || 1
              return Array.from({ length: labelCount }, (_, i) =>
                Math.min(i * step, points.length - 1)
              ).map(i => {
                const p = points[i]
                const lbl = new Date(`${p.date}T12:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                return (
                  <text key={p.date} x={p.x} y={H - 4} textAnchor="middle"
                    fontSize="11" fill="#94a3b8" fontFamily="inherit">{lbl}</text>
                )
              })
            })()}
            {hovered && (
              <g>
                <line x1={hovered.x} x2={hovered.x} y1={PAD.top} y2={PAD.top + CH}
                  stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
                <circle cx={hovered.x} cy={hovered.y} r="5" fill="#ef4444" stroke="white" strokeWidth="2.5" />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Tooltip bar */}
      {hovered && (
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between sm:px-6">
          <p className="text-xs text-slate-500">{fmtDateLabel(hovered.date)}</p>
          <p className="text-sm font-bold text-red-600">−{fmtFull(hovered.total)}</p>
        </div>
      )}
    </div>
  )
}
