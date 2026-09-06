"use client"

import { useEffect, useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionData } from "@/types/transaction"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 5

type TimeFilter = 'all' | 'week' | 'month'

export default function IncomePage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

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
      const res = await fetch(`/api/transactions?type=income&t=${Date.now()}`)
      if (res.ok) setTransactions(await res.json())
    } catch {}
    finally { setIsLoading(false) }
  }

  const handleSuccess = () => { 
    fetchTransactions()
    router.refresh()
  }

  // Filter berdasarkan search dan time range
  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by time range
    if (timeFilter !== 'all') {
      const now = new Date()
      const startDate = new Date()
      
      if (timeFilter === 'week') {
        startDate.setDate(now.getDate() - 7)
      } else if (timeFilter === 'month') {
        startDate.setMonth(now.getMonth() - 1)
      }
      
      filtered = filtered.filter(t => 
        new Date(t.transactionDate) >= startDate
      )
    }

    return filtered
  }, [transactions, searchQuery, timeFilter])

  const totalIncome = filteredTransactions.reduce((s, t) => s + t.amount, 0)
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  // Stats untuk cards
  const thisMonthIncome = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return transactions
      .filter(t => new Date(t.transactionDate) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Reset page saat filter berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, timeFilter])

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Uang Masuk
            </h1>
            <p className="text-gray-500 text-sm mt-1">Kelola dan pantau semua pemasukan Anda</p>
          </div>
          <Button 
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true) }} 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Pemasukan</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Income */}
          <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-emerald-700">{fmt(totalIncome)}</p>
                  <p className="text-xs text-gray-500 mt-1">{filteredTransactions.length} transaksi</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Month */}
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Bulan Ini</p>
                  <p className="text-2xl font-bold text-blue-700">{fmt(thisMonthIncome)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {transactions.filter(t => {
                      const now = new Date()
                      const start = new Date(now.getFullYear(), now.getMonth(), 1)
                      return new Date(t.transactionDate) >= start
                    }).length} transaksi
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Transaction */}
          <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Rata-rata</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {fmt(transactions.length > 0 ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length : 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per transaksi</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Time Filter Chips */}
              <div className="flex items-center gap-2">
                {[
                  { value: 'all' as TimeFilter, label: 'Semua' },
                  { value: 'week' as TimeFilter, label: '7 Hari' },
                  { value: 'month' as TimeFilter, label: '30 Hari' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      timeFilter === filter.value
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="shadow-md">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Daftar Transaksi</CardTitle>
              {filteredTransactions.length > 0 && (
                <span className="text-sm text-gray-500">
                  {filteredTransactions.length} hasil
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">Memuat data...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">
                  {searchQuery || timeFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada transaksi'}
                </p>
                <p className="text-sm text-gray-400">
                  {searchQuery || timeFilter !== 'all' 
                    ? 'Coba ubah filter atau kata kunci pencarian' 
                    : 'Tambahkan transaksi pemasukan pertama Anda'}
                </p>
              </div>
            ) : (
              <>
                <TransactionTable 
                  transactions={paginatedTransactions} 
                  onEdit={(t) => { setEditingTransaction(t); setIsModalOpen(true) }}
                  onDelete={fetchTransactions}
                />
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null) }}
        type="income"
        transaction={editingTransaction}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
