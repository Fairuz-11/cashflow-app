import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test koneksi database
    await prisma.$connect()
    
    // Test query sederhana
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      message: "MySQL connection berhasil!"
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      database: "failed",
      message: error instanceof Error ? error.message : String(error),
      code: error instanceof Error && "code" in error ? (error as any).code : undefined,
    }, { status: 500 })
  }
}
