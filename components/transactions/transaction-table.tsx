"use client"

import { useState, memo } from "react"
import { TransactionData } from "@/types/transaction"
import { Button } from "@/components/ui/button"
import { deleteTransaction } from "@/lib/actions/transaction"
import { useRouter } from "next/navigation"

interface TransactionTableProps {
  transactions: TransactionData[]
  onEdit: (transaction: TransactionData) => void
  onDelete?: () => void
}

/* ─── Delete Confirmation Modal ─────────────────────────────── */
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
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isDeleting ? onCancel : undefined} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">Hapus Transaksi?</h3>
        <p className="text-sm text-gray-500 text-center mb-1">Transaksi ini akan dihapus permanen.</p>

        {/* Transaction preview */}
        <div className="mt-3 mb-5 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
          <p className={`text-sm font-semibold mt-0.5 ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menghapus...
              </>
            ) : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Table Component ───────────────────────────────────── */
function TransactionTableComponent({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<TransactionData | null>(null)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date))

  const handleDeleteClick = (transaction: TransactionData) => {
    setConfirmTarget(transaction)
  }

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return
    setDeletingId(confirmTarget.id)
    try {
      const result = await deleteTransaction(confirmTarget.id)
      if (result.success) {
        setConfirmTarget(null)
        router.refresh()
        onDelete?.()
      } else {
        alert(result.error || "Gagal menghapus transaksi")
      }
    } catch {
      alert("Terjadi kesalahan")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {confirmTarget && (
        <DeleteConfirmModal
          transaction={confirmTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
          isDeleting={deletingId === confirmTarget.id}
        />
      )}
      <TableContent
        transactions={transactions}
        deletingId={deletingId}
        onEdit={onEdit}
        onDelete={handleDeleteClick}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </>
  )
}

/* ─── Table Content ──────────────────────────────────────────── */
function TableContent({
  transactions,
  deletingId,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
}: {
  transactions: TransactionData[]
  deletingId: string | null
  onEdit: (t: TransactionData) => void
  onDelete: (t: TransactionData) => void
  formatCurrency: (n: number) => string
  formatDate: (d: Date) => string
}) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-14 h-14 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 font-medium">Belum ada transaksi</p>
        <p className="text-gray-400 text-sm mt-1">Klik tombol di atas untuk menambahkan</p>
      </div>
    )
  }

  return (
    <>
      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {formatDate(t.transactionDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                  {t.description}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(t)} disabled={deletingId === t.id}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(t)} disabled={deletingId === t.id}>
                    {deletingId === t.id ? "..." : "Hapus"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARD LIST (< md) ── */}
      <div className="md:hidden divide-y divide-gray-100">
        {transactions.map((t) => (
          <div key={t.id} className="py-3 flex items-center gap-3">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              t.type === "income" ? "bg-green-100" : "bg-red-100"
            }`}>
              {t.type === "income" ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.transactionDate)}</p>
            </div>

            {/* Amount + actions */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <p className={`text-sm font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(t)}
                  disabled={deletingId === t.id}
                  className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t)}
                  disabled={deletingId === t.id}
                  className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletingId === t.id ? "..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// Memoized untuk mencegah re-render yang tidak perlu
export const TransactionTable = memo(TransactionTableComponent)