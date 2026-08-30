"use client"

import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoadingButton } from "@/components/ui/loading"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}>

        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute top-[60px] right-[40px] w-40 h-40 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="absolute bottom-[120px] left-[30px] w-32 h-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.03)" }} />
        {/* Small accent dots */}
        <div className="absolute top-[200px] right-[120px] w-8 h-8 rounded-full border-2"
          style={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <div className="absolute bottom-[200px] right-[80px] w-14 h-14 rounded-full border-2"
          style={{ borderColor: "rgba(255,255,255,0.15)" }} />
        <div className="absolute top-[380px] left-[200px] w-5 h-5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }} />
        <div className="absolute top-[150px] left-[180px] w-3 h-3 rounded-full"
          style={{ background: "rgba(255,255,255,0.25)" }} />
        <div className="absolute bottom-[280px] right-[200px] w-4 h-4 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Cashflow</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-7">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Kelola keuangan<br />Anda dengan mudah
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mt-3">
              Catat setiap pemasukan dan pengeluaran, pantau profit, dan buat keputusan finansial yang lebih cerdas.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Rekap keuangan real-time",
              "Catat uang masuk & keluar",
              "Pantau profit setiap saat",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Stats pill */}
          <div className="flex gap-3 pt-1">
            <div className="rounded-2xl px-4 py-3 flex-1"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
              <p className="text-white font-bold text-xl">100%</p>
              <p className="text-blue-200 text-xs mt-0.5">Gratis selamanya</p>
            </div>
            <div className="rounded-2xl px-4 py-3 flex-1"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
              <p className="text-white font-bold text-xl">Simpel</p>
              <p className="text-blue-200 text-xs mt-0.5">Mudah digunakan</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-blue-300 text-xs">
          © 2024 Cashflow. Aplikasi pencatat keuangan sederhana.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-blue-600 font-bold text-xl tracking-tight">Cashflow</span>
          </div>

          {/* Card wrapper */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat datang kembali</h1>
              <p className="text-gray-400 mt-1 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-3 px-4 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-sm"
                style={{
                  background: isLoading
                    ? "#93c5fd"
                    : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                }}
              >
                {isLoading ? (
                  <>
                    <LoadingButton />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Aman & terlindungi. Data Anda tidak pernah dibagikan.
          </p>
        </div>
      </div>
    </div>
  )
}
