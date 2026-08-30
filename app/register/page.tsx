"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoadingButton } from "@/components/ui/loading"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Password tidak cocok")
      return
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan")
        setIsLoading(false)
        return
      }

      router.push("/login?registered=true")
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
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="absolute top-[80px] left-[60px] w-48 h-48 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute bottom-[100px] right-[40px] w-36 h-36 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute top-1/3 right-[-40px] w-64 h-64 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }} />
        {/* Accent rings & dots */}
        <div className="absolute top-[180px] right-[100px] w-10 h-10 rounded-full border-2"
          style={{ borderColor: "rgba(255,255,255,0.18)" }} />
        <div className="absolute bottom-[240px] left-[80px] w-16 h-16 rounded-full border-2"
          style={{ borderColor: "rgba(255,255,255,0.14)" }} />
        <div className="absolute top-[320px] right-[200px] w-5 h-5 rounded-full"
          style={{ background: "rgba(255,255,255,0.22)" }} />
        <div className="absolute top-[130px] right-[260px] w-3 h-3 rounded-full"
          style={{ background: "rgba(255,255,255,0.28)" }} />
        <div className="absolute bottom-[320px] left-[220px] w-4 h-4 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)" }} />
        <div className="absolute bottom-[160px] right-[160px] w-6 h-6 rounded-full"
          style={{ background: "rgba(255,255,255,0.12)" }} />

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
              Mulai kelola<br />keuangan Anda<br />hari ini
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mt-3">
              Gratis selamanya. Daftar sekarang dan mulai catat transaksi keuangan Anda dalam hitungan menit.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { n: "1", label: "Buat akun gratis" },
              { n: "2", label: "Catat transaksi pertama Anda" },
              { n: "3", label: "Pantau rekap keuangan" },
            ].map((item) => (
              <div key={item.n} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {item.n}
                </div>
                <span className="text-blue-100 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Glassmorphism badge */}
          <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">Gratis selamanya, tanpa kartu kredit</span>
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buat akun baru</h1>
              <p className="text-gray-400 mt-1 text-sm">Gratis dan mudah, selesai dalam 1 menit</p>
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
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

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

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min. 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Konfirmasi
                  </label>
                  <input
                    type="password"
                    placeholder="Ulangi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
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
                  "Buat Akun"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Masuk di sini
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
