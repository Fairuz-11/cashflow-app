"use client"

import { useState } from "react"
import { TransactionData } from "@/types/transaction"

interface UpcomingTransactionsProps {
  transactions: TransactionData[]
}

const ITEMS_PER_PAGE = 5

export function UpcomingTransactions({ transactions }: UpcomingTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = transactions.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <section className="min-w-0 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">History</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Recent transactions</h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{transactions.length} total</span>
      </div>

      <div className="divide-y divide-slate-100">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + (
                  transaction.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                )}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    {transaction.type === "income"
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />}
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{transaction.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(transaction.transactionDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className={"break-long-content shrink-0 text-right text-sm font-bold " + (
                transaction.type === "income" ? "text-emerald-700" : "text-rose-600"
              )}>
                {transaction.type === "income" ? "+" : "-"}{fmt(transaction.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Belum ada transaksi</p>
            <p className="mt-1 text-xs text-slate-400">Transaksi terbaru akan muncul di sini.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Showing {startIndex + 1}–{Math.min(endIndex, transactions.length)} of {transactions.length}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={"Go to page " + page}
                className={"h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition-colors " + (
                  currentPage === page ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
