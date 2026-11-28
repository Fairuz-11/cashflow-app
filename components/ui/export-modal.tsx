"use client"

import { useState } from "react"
import { TransactionData } from "@/types/transaction"

type RangeOption = "all" | "this_month" | "last_month" | "last_3_months"

interface ExportModalProps {
  transactions: TransactionData[]
  type: "income" | "expense"
  onClose: () => void
}

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

export function ExportModal({ transactions, type, onClose }: ExportModalProps) {
  const [range, setRange] = useState<RangeOption>("this_month")
  const [isExporting, setIsExporting] = useState(false)

  const rangeOptions: { value: RangeOption; label: string; desc: string }[] = [
    { value: "this_month",    label: "Bulan ini",       desc: getMonthLabel(0) },
    { value: "last_month",    label: "Bulan lalu",      desc: getMonthLabel(-1) },
    { value: "last_3_months", label: "3 bulan terakhir", desc: getLast3Label() },
    { value: "all",           label: "Semua data",      desc: `${transactions.length} transaksi` },
  ]

  function getMonthLabel(offset: number) {
    const d = new Date()
    d.setMonth(d.getMonth() + offset)
    return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  }

  function getLast3Label() {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 3)
    return `${start.toLocaleDateString("id-ID", { month: "short" })} – ${end.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}`
  }

  function getFilteredTransactions(): TransactionData[] {
    const now = new Date()
    if (range === "all") return transactions

    if (range === "this_month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return transactions.filter(t => new Date(t.transactionDate) >= start)
    }
    if (range === "last_month") {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      return transactions.filter(t => {
        const d = new Date(t.transactionDate)
        return d >= start && d <= end
      })
    }
    if (range === "last_3_months") {
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return transactions.filter(t => new Date(t.transactionDate) >= start)
    }
    return transactions
  }

  const preview = getFilteredTransactions()
  const previewTotal = preview.reduce((s, t) => s + t.amount, 0)

  function handleExport() {
    setIsExporting(true)
    setTimeout(() => {
      const data = getFilteredTransactions()
      const header = "Tanggal,Keterangan,Nominal"
      const rows = data.map(t => {
        const tanggal = new Date(t.transactionDate).toLocaleDateString("id-ID")
        const keterangan = `"${t.description.replace(/"/g, '""')}"`
        return `${tanggal},${keterangan},${t.amount}`
      })
      const csv = [header, ...rows].join("\n")
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      const rangeLabel = rangeOptions.find(o => o.value === range)?.desc ?? range
      const prefix = type === "income" ? "uang-masuk" : "uang-keluar"
      a.href     = url
      a.download = `${prefix}-${rangeLabel}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setIsExporting(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full bg-white sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px -12px rgba(15,23,42,0.25)" }}>

        {/* ── Header dark ── */}
        <div
          className="relative overflow-hidden px-6 py-6"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}
        >
          {/* Noise */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }} aria-hidden="true" />
          {/* Glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }}
            aria-hidden="true" />

          {/* Handle bar mobile */}
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <svg className="h-4 w-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Export Data</p>
              </div>
              <h2 className="text-lg font-bold text-white">
                {type === "income" ? "Uang Masuk" : "Uang Keluar"}
              </h2>
              <p className="mt-0.5 text-xs text-white/40">Unduh data transaksi dalam format CSV</p>
            </div>
            <button onClick={onClose}
              className="mt-1 rounded-lg p-1.5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5">

          {/* Range selector */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-3">Pilih rentang waktu</p>
            <div className="grid grid-cols-2 gap-2">
              {rangeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all ${
                    range === opt.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className={`text-[11px] mt-0.5 ${range === opt.value ? "text-white/50" : "text-slate-400"}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total yang akan diekspor</p>
                <p className={`mt-1 text-lg font-bold tracking-tight ${
                  type === "income" ? "text-emerald-600" : "text-slate-900"
                }`}>
                  {type === "income" ? "+" : "−"}{fmt(previewTotal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Jumlah transaksi</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{preview.length}</p>
              </div>
            </div>
            {preview.length === 0 && (
              <p className="mt-2 text-xs text-slate-400 border-t border-slate-200 pt-2">
                Tidak ada transaksi pada periode ini.
              </p>
            )}
          </div>

          {/* Format info */}
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-4 py-3">
            <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs text-slate-500">
              File akan disimpan sebagai <span className="font-semibold text-slate-700">.csv</span> — bisa dibuka di Excel, Google Sheets, atau Numbers.
            </p>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="flex gap-2.5 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={preview.length === 0 || isExporting}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              type === "income"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Menyiapkan...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
