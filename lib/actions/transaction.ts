"use server"

import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { TransactionData } from "@/types/transaction"
import { transactionSchema } from "@/lib/validations/transaction"

// Helper: cast Prisma result ke TransactionData
function toTransactionData(t: any): TransactionData {
  return {
    ...t,
    type: t.type as "income" | "expense",
    amount: Number(t.amount),
  }
}

// Get summary (total income, expense, profit)
export async function getSummary() {
  const user = await requireAuth()

  const now = new Date()

  // Awal minggu ini (Senin)
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay()
  const diff = day === 0 ? -6 : 1 - day // Senin = 1
  startOfWeek.setDate(now.getDate() + diff)
  startOfWeek.setHours(0, 0, 0, 0)

  // Awal bulan ini
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    incomeResult,
    expenseResult,
    expenseWeekResult,
    expenseMonthResult,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: user.id, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: user.id, type: "expense" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "expense",
        transactionDate: { gte: startOfWeek },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: user.id,
        type: "expense",
        transactionDate: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
  ])

  const totalIncome = Number(incomeResult._sum.amount || 0)
  const totalExpense = Number(expenseResult._sum.amount || 0)
  const profit = totalIncome - totalExpense
  const expenseThisWeek = Number(expenseWeekResult._sum.amount || 0)
  const expenseThisMonth = Number(expenseMonthResult._sum.amount || 0)

  return { totalIncome, totalExpense, profit, expenseThisWeek, expenseThisMonth }
}

// Get recent transactions
export async function getRecentTransactions(limit: number = 10): Promise<TransactionData[]> {
  const user = await requireAuth()

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { transactionDate: "desc" },
    take: limit,
  })

  return transactions.map(toTransactionData)
}

// Get all transactions by type
export async function getTransactionsByType(type: "income" | "expense"): Promise<TransactionData[]> {
  const user = await requireAuth()

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id, type },
    orderBy: { transactionDate: "desc" },
  })

  return transactions.map(toTransactionData)
}

// Create transaction
export async function createTransaction(data: z.infer<typeof transactionSchema>) {
  const user = await requireAuth()

  try {
    const validatedData = transactionSchema.parse(data)

    const transaction = await prisma.transaction.create({
      data: { ...validatedData, userId: user.id },
    })

    revalidatePath("/dashboard")
    revalidatePath("/income")
    revalidatePath("/expense")

    return { success: true, transaction: toTransactionData(transaction) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Gagal membuat transaksi" }
  }
}

// Update transaction
export async function updateTransaction(
  id: string,
  data: z.infer<typeof transactionSchema>
) {
  const user = await requireAuth()

  try {
    const validatedData = transactionSchema.parse(data)

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingTransaction) {
      return { success: false, error: "Transaksi tidak ditemukan" }
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath("/dashboard")
    revalidatePath("/income")
    revalidatePath("/expense")

    return { success: true, transaction: toTransactionData(transaction) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Gagal mengupdate transaksi" }
  }
}

// Delete transaction
export async function deleteTransaction(id: string) {
  const user = await requireAuth()

  try {
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    })

    if (!existingTransaction) {
      return { success: false, error: "Transaksi tidak ditemukan" }
    }

    await prisma.transaction.delete({ where: { id } })

    revalidatePath("/dashboard")
    revalidatePath("/income")
    revalidatePath("/expense")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal menghapus transaksi" }
  }
}

// Get single transaction
export async function getTransaction(id: string): Promise<TransactionData | null> {
  const user = await requireAuth()

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  })

  if (!transaction) return null

  return toTransactionData(transaction)
}

// Get weekly data for chart
export async function getWeeklyData() {
  const user = await requireAuth()

  // Get last 5 weeks of data
  const weeks = []
  for (let i = 4; i >= 0; i--) {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - (i * 7))
    endDate.setHours(23, 59, 59, 999)
    
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: "income",
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: "expense",
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
      }),
    ])

    weeks.push({
      label: endDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
      income: Number(income._sum.amount || 0),
      expense: Number(expense._sum.amount || 0),
    })
  }

  return weeks
}
