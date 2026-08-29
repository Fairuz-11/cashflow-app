import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "income" | "expense" | null

    const where: any = {
      userId: user.id,
    }

    if (type) {
      where.type = type
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        transactionDate: "desc",
      },
    })

    const formattedTransactions = transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }))

    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}
