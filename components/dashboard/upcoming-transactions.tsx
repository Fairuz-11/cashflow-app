"use client"

import { TransactionData } from "@/types/transaction"

interface UpcomingTransactionsProps {
  transactions: TransactionData[]
}

export function UpcomingTransactions({ transactions }: UpcomingTransactionsProps) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Upcoming bills</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700">View all</button>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 4).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
              }`}>
                <svg className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
              {fmt(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
