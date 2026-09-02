"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionData } from "@/types/transaction"
import { useRouter } from "next/navigation"

export default function ExpensePage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user")
      if (res.ok) setUserName((await res.json()).name)
    } catch {}
  }

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/transactions?type=expense")
      if (res.ok) setTransactions(await res.json())
    } catch {}
    finally { setIsLoading(false) }
  }

  const handleSuccess = () => { fetchTransactions(); router.refresh() }

  const totalExpense = transactions.reduce((s, t) => s + t.amount, 0)
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-4 lg:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Uang Keluar</h1>
            <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">Kelola semua transaksi pengeluaran Anda</p>
          </div>
          <Button onClick={() => { setEditingTransaction(null); setIsModalOpen(true) }} size="sm" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah</span>
          </Button>
        </div>

        {/* Total card */}
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Pengeluaran</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-600">{fmt(totalExpense)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="px-4 py-3 lg:px-6 lg:py-4">
            <CardTitle className="text-base lg:text-lg">Daftar Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Memuat data...</p>
              </div>
            ) : (
              <TransactionTable transactions={transactions} onEdit={(t) => { setEditingTransaction(t); setIsModalOpen(true) }} />
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null) }}
        type="expense"
        transaction={editingTransaction}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
