import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"

export async function GET() {
  try {
    const user = await requireAuth()
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}
