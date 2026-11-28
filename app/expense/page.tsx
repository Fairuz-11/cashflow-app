"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal"
import { deleteTransaction } from "@/lib/actions/transaction"
import { TransactionData } from "@/types/transaction"
import { ExpenseAreaChart } from "@/components/expense/expense-area-chart"
import { ExportModal } from "@/components/ui/export-modal"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 20
type TimeFilter = "all" | "today" | "week" | "month"

// ─── Formatters ───────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

function fmtCompact(n: number) {
  if (n >= 1_000_000_000) return "Rp\u00a0" + (n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0M"
  if (n >= 1_000_000)     return "Rp\u00a0" + (n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
  if (n >= 1_000)         return "Rp\u00a0" + (n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
  return fmt(n)
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
}

function fmtGroup(d: Date): string {
  const date = new Date(d)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const same = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  if (same(date, today)) return "Hari ini"
  if (same(date, yesterday)) return "Kemarin"
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" }).format(date)
}

// ─── Delete Modal ─────────────────────────────────────────────────
function DeleteModal({ t, onConfirm, onCancel, isDeleting }: {
  t: TransactionData; onConfirm: () => void; onCancel: () => void; isDeleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={!isDeleting ? onCancel : undefined} />
      <div className="relative w-full bg-white rounded-t-2xl sm:rounded-2xl sm:max-w-xs px-5 py-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <p className="text-sm font-semibold text-slate-900 mb-1">Hapus pengeluaran?</p>
        <p className="text-xs text-slate-400 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
          <p className="text-sm font-medium text-slate-700 truncate">{t.description}</p>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">−{fmt(t.amount)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={isDeleting}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40">
            Batal
          </button>
          <button onClick={onConfirm} disabled={isDeleting}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {isDeleting
              ? <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Menghapus...</>
              : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Spending Breakdown ───────────────────────────────────────────
function SpendingBreakdown({ transactions }: { transactions: TransactionData[] }) {
  const items = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      const key = t.description.split(" ").slice(0, 2).join(" ")
      map.set(key, (map.get(key) ?? 0) + t.amount)
    }
    const total = Array.from(map.values()).reduce((s, v) => s + v, 0)
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, amount]) => ({
        label,
        amount,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
  }, [transactions])

  if (items.length === 0) return null

  const colors = ["bg-red-500", "bg-red-400", "bg-red-300", "bg-red-200", "bg-red-100"]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori Pengeluaran</p>
        <p className="text-[11px] text-slate-400">{transactions.length} transaksi</p>
      </div>
      <div className="px-5 pt-4 pb-2 sm:px-6">
        <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
          {items.map((s, i) => (
            <div key={s.label} className={`h-full transition-all duration-500 ${colors[i]}`}
              style={{ width: `${s.pct}%` }} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100 px-5 pb-3 sm:px-6">
        {items.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3 py-3">
            <span className={`h-2 w-2 rounded-full shrink-0 ${colors[i]}`} />
            <p className="flex-1 truncate text-sm text-slate-700">{s.label}</p>
            <p className="text-xs text-slate-400 mr-3">{s.pct}%</p>
            <p className="text-sm font-semibold text-slate-900">{fmtCompact(s.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function ExpensePage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editTarget, setEditTarget]     = useState<TransactionData | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TransactionData | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [userName, setUserName]         = useState<string | null>(null)
  const [page, setPage]                 = useState(1)
  const [search, setSearch]             = useState("")
  const [filter, setFilter]             = useState<TimeFilter>("all")
  const [isExportOpen, setIsExportOpen] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/transactions?type=expense&t=${Date.now()}`)
      if (res.ok) setTransactions(await res.json())
    } catch {}
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [txRes, userRes] = await Promise.all([
          fetch(`/api/transactions?type=expense&t=${Date.now()}`),
          fetch("/api/user"),
        ])
        if (txRes.ok   && !cancelled) setTransactions(await txRes.json())
        if (userRes.ok && !cancelled) setUserName((await userRes.json()).name)
      } catch {}
      finally { if (!cancelled) setIsLoading(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const openAdd    = () => { setEditTarget(null); setIsModalOpen(true) }
  const openEdit   = (t: TransactionData) => { setEditTarget(t); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setEditTarget(null) }
  const handleSuccess = () => { fetchTransactions(); router.refresh() }

  const exportCSV = () => setIsExportOpen(true)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeletingId(deleteTarget.id)
    try {
      const r = await deleteTransaction(deleteTarget.id)
      if (r.success) { setDeleteTarget(null); fetchTransactions(); router.refresh() }
    } finally { setDeletingId(null) }
  }

  // ─── Derived stats ───────────────────────────────────────────────
  const totalAll = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions])

  const { thisMonth, thisMonthCount, lastMonth } = useMemo(() => {
    const now = new Date()
    const startThis = new Date(now.getFullYear(), now.getMonth(), 1)
    const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endLast   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const thisArr = transactions.filter(t => new Date(t.transactionDate) >= startThis)
    const lastArr = transactions.filter(t => {
      const d = new Date(t.transactionDate)
      return d >= startLast && d <= endLast
    })
    return {
      thisMonth:      thisArr.reduce((s, t) => s + t.amount, 0),
      thisMonthCount: thisArr.length,
      lastMonth:      lastArr.reduce((s, t) => s + t.amount, 0),
    }
  }, [transactions])

  const monthPctChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : null

  // ─── Filtered list ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = transactions
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(t => t.description.toLowerCase().includes(q))
    }
    if (filter !== "all") {
      const start = new Date()
      if (filter === "today")      start.setHours(0, 0, 0, 0)
      else if (filter === "week")  start.setDate(start.getDate() - 7)
      else if (filter === "month") start.setMonth(start.getMonth() - 1)
      r = r.filter(t => new Date(t.transactionDate) >= start)
    }
    return r
  }, [transactions, search, filter])

  const totalFiltered = useMemo(() => filtered.reduce((s, t) => s + t.amount, 0), [filtered])
  const totalPages    = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated     = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const grouped = useMemo(() => {
    const map = new Map<string, TransactionData[]>()
    for (const t of paginated) {
      const key = new Date(t.transactionDate).toISOString().slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return Array.from(map.values()).map(items => ({
      label: fmtGroup(items[0].transactionDate),
      total: items.reduce((s, t) => s + t.amount, 0),
      items,
    }))
  }, [paginated])

  const isFiltering = search !== "" || filter !== "all"

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto max-w-2xl space-y-5 pb-24 lg:max-w-none lg:pb-8">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Pengeluaran</p>
            <h1 className="mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">Uang Keluar</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportCSV}
              disabled={transactions.length === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Tambah
            </button>
          </div>
        </div>

        {/* ── Hero Stats ────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7"
          style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}>
          {/* Accent bar — merah untuk expense */}
          <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-red-500" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Pengeluaran bulan ini</p>
              <p className="mt-1.5 break-all text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {fmt(thisMonth)}
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <span className="text-xs text-slate-400">{thisMonthCount} transaksi</span>
                {monthPctChange !== null && (
                  <>
                    <span className="h-3 w-px bg-slate-200" />
                    {/* Untuk expense: naik = buruk (merah), turun = bagus (emerald) */}
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      monthPctChange > 0 ? "text-red-600" : "text-emerald-600"
                    }`}>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d={monthPctChange > 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                      </svg>
                      {Math.abs(monthPctChange).toFixed(1)}% vs bulan lalu
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-7">
              <div>
                <p className="text-[11px] text-slate-400">Bulan lalu</p>
                <p className="mt-0.5 text-base font-semibold text-slate-700">{fmtCompact(lastMonth)}</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div>
                <p className="text-[11px] text-slate-400">Total semua</p>
                <p className="mt-0.5 text-base font-semibold text-slate-700">{fmtCompact(totalAll)}</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div>
                <p className="text-[11px] text-slate-400">Rata-rata</p>
                <p className="mt-0.5 text-base font-semibold text-slate-700">
                  {fmtCompact(transactions.length > 0 ? totalAll / transactions.length : 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop 2-col / Mobile stack ─────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

          {/* LEFT */}
          <div className="space-y-5 min-w-0">

            {/* Chart */}
            {isLoading ? (
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white h-64" />
            ) : (
              <ExpenseAreaChart transactions={transactions} />
            )}

            {/* Search + Filter */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Cari transaksi..."
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100" />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1) }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
                {(["all", "today", "week", "month"] as TimeFilter[]).map(v => {
                  const labels: Record<TimeFilter, string> = { all: "Semua", today: "Hari ini", week: "7 hari", month: "30 hari" }
                  return (
                    <button key={v} onClick={() => { setFilter(v); setPage(1) }}
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === v ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}>
                      {labels[v]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Transaction List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}>

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {isFiltering ? "Hasil pencarian" : "Riwayat"}
                </p>
                {filtered.length > 0 && (
                  <div className="flex items-center gap-2">
                    {isFiltering && <span className="text-xs font-bold text-red-600">−{fmtCompact(totalFiltered)}</span>}
                    <span className="text-[11px] text-slate-400">{filtered.length} transaksi</span>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-slate-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-slate-100" />
                        <div className="h-2.5 w-20 rounded bg-slate-100" />
                      </div>
                      <div className="h-3 w-16 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>

              ) : filtered.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    {isFiltering ? "Tidak ada hasil" : "Belum ada pengeluaran"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {isFiltering ? "Coba ubah kata kunci atau pilih filter lain" : "Ketuk tombol Tambah untuk mencatat pengeluaran pertama"}
                  </p>
                </div>

              ) : (
                <div>
                  {grouped.map((group, gi) => (
                    <div key={group.label}>
                      <div className="flex items-center justify-between bg-slate-50 px-5 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400">{group.label}</p>
                        <p className="text-[11px] font-semibold text-red-600">−{fmtCompact(group.total)}</p>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {group.items.map(t => (
                          <div key={t.id}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50">
                              <svg className="h-3.5 w-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-800">{t.description}</p>
                              <p className="mt-0.5 text-xs text-slate-400">{fmtDate(t.transactionDate)}</p>
                            </div>

                            <p className="shrink-0 text-sm font-bold text-red-600">−{fmtCompact(t.amount)}</p>

                            <div className="flex shrink-0 items-center gap-0.5">
                              <button onClick={() => openEdit(t)}
                                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Edit">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button onClick={() => setDeleteTarget(t)}
                                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label="Hapus">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {gi < grouped.length - 1 && <div className="h-px bg-slate-100" />}
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Sebelumnya
                      </button>
                      <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 disabled:opacity-30 hover:text-slate-800 transition-colors">
                        Berikutnya
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Spending breakdown */}
          <div className="space-y-5">
            {!isLoading && transactions.length > 0 && (
              <SpendingBreakdown transactions={transactions} />
            )}
            {isLoading && (
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white h-48" />
            )}
          </div>
        </div>
      </div>

      {isExportOpen && (
        <ExportModal
          transactions={transactions}
          type="expense"
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          t={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deletingId === deleteTarget.id}
        />
      )}

      <TransactionFormModal
        key={`${isModalOpen}-${editTarget?.id ?? "new"}`}
        isOpen={isModalOpen}
        onClose={closeModal}
        type="expense"
        transaction={editTarget}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
