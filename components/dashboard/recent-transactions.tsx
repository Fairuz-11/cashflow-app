"use client"

import { TransactionData } from "@/types/transaction"

interface RecentTransactionsProps {
  transactions: TransactionData[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Transaksi Terbaru</h2>
        <p className="text-xs text-gray-500 mt-0.5">10 transaksi terakhir</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto mb-2.5 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">Belum ada transaksi</p>
            <p className="text-xs text-gray-400 mt-0.5">Mulai catat transaksi pertama Anda</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.transactionDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p
                    className={`text-base font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
