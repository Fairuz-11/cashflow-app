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

  // Pagination logic
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
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
        <span className="text-xs text-gray-500">{transactions.length} total</span>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                }`}>
                  <svg className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {transaction.type === 'income' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    )}
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ml-2 ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{fmt(transaction.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Belum ada transaksi</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <div className="text-xs text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
