"use client"

import { useState, FormEvent, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading"
import { createTransaction, updateTransaction } from "@/lib/actions/transaction"
import { TransactionData } from "@/types/transaction"

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  type: "income" | "expense"
  transaction?: TransactionData | null
  onSuccess: () => void
}

export function TransactionFormModal({
  isOpen,
  onClose,
  type,
  transaction,
  onSuccess,
}: TransactionFormModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isEdit = !!transaction

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description)
      setAmount(transaction.amount.toString())
      setTransactionDate(
        new Date(transaction.transactionDate).toISOString().split("T")[0]
      )
    } else {
      setDescription("")
      setAmount("")
      setTransactionDate(new Date().toISOString().split("T")[0])
    }
    setError("")
  }, [transaction, isOpen])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validasi
    if (!description.trim()) {
      setError("Keterangan tidak boleh kosong")
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Nominal harus lebih dari 0")
      return
    }

    if (!transactionDate) {
      setError("Tanggal harus diisi")
      return
    }

    setIsLoading(true)

    try {
      const data = {
        type,
        description: description.trim(),
        amount: amountNum,
        transactionDate: new Date(transactionDate),
      }

      let result
      if (isEdit && transaction) {
        result = await updateTransaction(transaction.id, data)
      } else {
        result = await createTransaction(data)
      }

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const title = isEdit
    ? `Edit ${type === "income" ? "Pemasukan" : "Pengeluaran"}`
    : `Tambah ${type === "income" ? "Pemasukan" : "Pengeluaran"}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" form="transaction-form" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingButton />
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          type="date"
          label="Tanggal"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          type="text"
          label="Keterangan"
          placeholder="Contoh: Gaji bulan ini"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          type="number"
          label="Nominal"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          disabled={isLoading}
        />
      </form>
    </Modal>
  )
}
