"use server"

import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { TransactionData } from "@/types/transaction"

// Schema validasi
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Keterangan tidak boleh kosong"),
  amount: z.number().positive("Nominal harus lebih dari 0"),
  transactionDate: z.date(),
})

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

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: user.id, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: user.id, type: "expense" },
      _sum: { amount: true },
    }),
  ])

  const totalIncome = Number(incomeResult._sum.amount || 0)
  const totalExpense = Number(expenseResult._sum.amount || 0)
  const profit = totalIncome - totalExpense

  return { totalIncome, totalExpense, profit }
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
      return { success: false, error: error.errors[0].message }
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
      return { success: false, error: error.errors[0].message }
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
