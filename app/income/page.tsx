"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal"
import { deleteTransaction } from "@/lib/actions/transaction"
import { TransactionData } from "@/types/transaction"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10
type TimeFilter = "all" | "today" | "week" | "month"

// ── Helpers ──────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

function fmtShort(n: number) {
  const abs = Math.abs(n)
  if (abs >= 1_000_000)
    return "Rp\u00a0" + (abs / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + "\u00a0jt"
  if (abs >= 1_000)
    return "Rp\u00a0" + (abs / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + "\u00a0rb"
  return fmt(n)
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d))
}

function fmtDateGroup(d: Date) {
  const date = new Date(d)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  if (isSameDay(date, today)) return "Hari ini"
  if (isSameDay(date, yesterday)) return "Kemarin"
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

// ── Delete Confirm Modal ──────────────────────────────────────────
function DeleteConfirmModal({
  transaction,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  transaction: TransactionData
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isDeleting ? onCancel : undefined} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Hapus transaksi?</h3>
        <p className="text-sm text-gray-400 text-center mb-5">Tindakan ini tidak dapat dibatalkan.</p>
        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-5">
          <p className="text-sm font-medium text-gray-800 truncate">{transaction.description}</p>
          <p className="text-sm font-semibold text-emerald-600 mt-0.5">+{fmt(transaction.amount)}</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menghapus...</>
              : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function IncomePage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<TransactionData | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/transactions?type=income&t=${Date.now()}`)
      if (res.ok) setTransactions(await res.json())
    } catch {}
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [txRes, userRes] = await Promise.all([
          fetch(`/api/transactions?type=income&t=${Date.now()}`),
          fetch("/api/user"),
        ])
        if (txRes.ok && !cancelled) setTransactions(await txRes.json())
        if (userRes.ok && !cancelled) setUserName((await userRes.json()).name)
      } catch {}
      finally { if (!cancelled) setIsLoading(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const handleSuccess = () => { fetchTransactions(); router.refresh() }

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return
    setDeletingId(confirmTarget.id)
    try {
      const result = await deleteTransaction(confirmTarget.id)
      if (result.success) {
        setConfirmTarget(null)
        fetchTransactions()
        router.refresh()
      }
    } finally { setDeletingId(null) }
  }

  // ── Filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = transactions
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => t.description.toLowerCase().includes(q))
    }
    if (timeFilter !== "all") {
      const now = new Date()
      const start = new Date()
      if (timeFilter === "today") {
        start.setHours(0, 0, 0, 0)
      } else if (timeFilter === "week") {
        start.setDate(now.getDate() - 7)
      } else if (timeFilter === "month") {
        start.setMonth(now.getMonth() - 1)
      }
      result = result.filter(t => new Date(t.transactionDate) >= start)
    }
    return result
  }, [transactions, searchQuery, timeFilter])

  // ── Stats ──────────────────────────────────────────────────────
  const totalAll = useMemo(() =>
    transactions.reduce((s, t) => s + t.amount, 0), [transactions])

  const totalFiltered = useMemo(() =>
    filtered.reduce((s, t) => s + t.amount, 0), [filtered])

  const thisMonthTotal = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return transactions.filter(t => new Date(t.transactionDate) >= start).reduce((s, t) => s + t.amount, 0)
  }, [transactions])

  const avgPerTransaction = transactions.length > 0 ? totalAll / transactions.length : 0

  // ── Pagination ─────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // ── Group by date ──────────────────────────────────────────────
  const grouped = useMemo(() => {
    const groups: { label: string; items: TransactionData[] }[] = []
    const map = new Map<string, TransactionData[]>()
    for (const t of paginated) {
      const key = new Date(t.transactionDate).toISOString().slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    for (const [, items] of map) {
      groups.push({ label: fmtDateGroup(items[0].transactionDate), items })
    }
    return groups
  }, [paginated])

  const isFiltering = searchQuery !== "" || timeFilter !== "all"

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-5 pb-24 lg:pb-8">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Uang Masuk</h1>
            <p className="text-sm text-slate-400 mt-0.5">Kelola semua pemasukan Anda</p>
          </div>
          <button
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true) }}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Tambah</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* ── Summary ─────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}
        >
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {[
              { label: "Total Semua", value: fmtShort(totalAll), sub: `${transactions.length} transaksi`, color: "text-slate-900" },
              { label: "Bulan Ini",   value: fmtShort(thisMonthTotal), sub: "30 hari terakhir", color: "text-emerald-600" },
              { label: "Rata-rata",   value: fmtShort(avgPerTransaction), sub: "per transaksi", color: "text-slate-900" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-[11px] font-medium text-slate-400 mb-1.5">{s.label}</p>
                <p className={`text-base font-bold tracking-tight ${s.color} sm:text-xl`}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search + Filter ──────────────────────────────────── */}
        <div className="space-y-2.5">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setCurrentPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2">
            {([
              { v: "all",   l: "Semua" },
              { v: "today", l: "Hari Ini" },
              { v: "week",  l: "7 Hari" },
              { v: "month", l: "30 Hari" },
            ] as { v: TimeFilter; l: string }[]).map((f) => (
              <button
                key={f.v}
                onClick={() => { setTimeFilter(f.v); setCurrentPage(1) }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  timeFilter === f.v
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Transaction List ─────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          style={{ boxShadow: "0 1px 4px 0 rgba(15,23,42,0.06)" }}
        >
          {/* List header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <p className="text-sm font-semibold text-slate-800">
              {isFiltering ? "Hasil pencarian" : "Riwayat Transaksi"}
            </p>
            {filtered.length > 0 && (
              <div className="flex items-center gap-2">
                {isFiltering && (
                  <span className="text-xs font-semibold text-emerald-600">{fmtShort(totalFiltered)}</span>
                )}
                <span className="text-xs text-slate-400">{filtered.length} transaksi</span>
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="px-5 py-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-9 w-9 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded bg-slate-100" />
                    <div className="h-2.5 w-20 rounded bg-slate-100" />
                  </div>
                  <div className="h-3 w-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="px-5 py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">
                {isFiltering ? "Tidak ada hasil" : "Belum ada pemasukan"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isFiltering ? "Coba ubah filter atau kata kunci" : "Ketuk tombol Tambah untuk mencatat pemasukan pertama"}
              </p>
            </div>
          ) : (
            /* Transaction groups */
            <div>
              {grouped.map((group, gi) => (
                <div key={group.label}>
                  {/* Date label */}
                  <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400">{group.label}</p>
                  </div>

                  {/* Items */}
                  {group.items.map((t, ti) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 px-5 py-3.5 ${
                        ti < group.items.length - 1 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{t.description}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{fmtDate(t.transactionDate)}</p>
                      </div>

                      {/* Amount + actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-sm font-bold text-emerald-600">+{fmtShort(t.amount)}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingTransaction(t); setIsModalOpen(true) }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Edit"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmTarget(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Hapus"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Divider between groups */}
                  {gi < grouped.length - 1 && <div className="h-px bg-slate-100" />}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Sebelumnya
                  </button>
                  <span className="text-xs text-slate-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"
                  >
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

      {/* ── Modals ───────────────────────────────────────────────── */}
      {confirmTarget && (
        <DeleteConfirmModal
          transaction={confirmTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
          isDeleting={deletingId === confirmTarget.id}
        />
      )}

      <TransactionFormModal
        key={`${isModalOpen ? "open" : "closed"}-${editingTransaction?.id ?? "new"}`}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null) }}
        type="income"
        transaction={editingTransaction}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
