"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionData } from "@/types/transaction"
import { useRouter } from "next/navigation"

export default function IncomePage() {
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
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUserName(data.name)
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error)
    }
  }

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/transactions?type=income")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClick = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (transaction: TransactionData) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleSuccess = () => {
    fetchTransactions()
    router.refresh()
  }

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Uang Masuk</h1>
            <p className="text-gray-600 mt-1">
              Kelola semua transaksi pemasukan Anda
            </p>
          </div>
          <Button onClick={handleAddClick}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pemasukan
          </Button>
        </div>

        {/* Total Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Pemasukan
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEditClick}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        type="income"
        transaction={editingTransaction}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
