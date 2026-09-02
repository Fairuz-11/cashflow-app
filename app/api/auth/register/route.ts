import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Registrasi ditutup. Hubungi administrator untuk membuat akun baru." },
    { status: 403 }
  )
}
