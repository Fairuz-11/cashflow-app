import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"

export async function GET() {
  try {
    const user = await requireAuth()
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=600',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}
