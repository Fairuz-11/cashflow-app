import { z } from "zod"

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Keterangan tidak boleh kosong"),
  amount: z.number().positive("Nominal harus lebih dari 0"),
  transactionDate: z.date(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
