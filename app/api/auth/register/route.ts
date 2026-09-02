import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi input
    const validatedData = registerSchema.parse(body)

    // Test koneksi database dulu
    await prisma.$connect()

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: "Registrasi berhasil",
      user
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    // Log error detail ke terminal (bukan browser)
    console.error("=== REGISTRATION ERROR ===")
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("Message:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error && "code" in error) {
      console.error("Code:", (error as any).code)
    }
    console.error("==========================")

    // Kirim detail error ke browser untuk debugging
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat registrasi",
        detail: error instanceof Error ? error.message : String(error),
        code: error instanceof Error && "code" in error ? (error as any).code : undefined,
      },
      { status: 500 }
    )
  }
}
