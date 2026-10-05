"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/* ─── Page ───────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke login - registrasi dinonaktifkan
    router.replace("/login")
  }, [router])

  // Loading state saat redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  )
}
