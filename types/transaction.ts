// Custom type untuk Transaction karena MySQL menggunakan String bukan enum
// Field `type` dijaga type-safety di level aplikasi menggunakan Zod

export type TransactionType = "income" | "expense"

export interface TransactionData {
  id: string
  type: TransactionType
  description: string
  amount: number
  transactionDate: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}
