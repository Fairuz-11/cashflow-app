"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoadingButton } from "@/components/ui/loading"

/* ─── Floating-label input with icon ─────────────────────────── */
function FloatingInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  required,
  icon,
}: {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  required?: boolean
  icon: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="relative">
      {/* left icon */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{ color: focused ? "#2563eb" : "#9ca3af" }}
      >
        {icon}
      </div>

      {/* input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ""}
        required={required}
        disabled={disabled}
        className="peer w-full pl-11 pr-4 pt-6 pb-2 text-sm text-gray-900 bg-white border rounded-xl outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-300"
        style={{
          borderColor: focused ? "#2563eb" : "#e5e7eb",
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
        }}
      />

      {/* floating label */}
      <label
        htmlFor={id}
        className="absolute left-11 transition-all duration-200 pointer-events-none select-none"
        style={{
          top: active ? "8px" : "50%",
          transform: active ? "translateY(0)" : "translateY(-50%)",
          fontSize: active ? "10px" : "14px",
          fontWeight: active ? 600 : 400,
          color: focused ? "#2563eb" : active ? "#6b7280" : "#9ca3af",
          letterSpacing: active ? "0.05em" : "0",
          textTransform: active ? "uppercase" : "none",
        }}
      >
        {label}
      </label>
    </div>
  )
}

/* ─── Icons ──────────────────────────────────────────────────── */
const IconUser = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const IconMail = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const IconLock = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)
const IconShield = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

/* ─── Page ───────────────────────────────────────────────────── */
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
    if (password !== confirmPassword) { setError("Password tidak cocok"); return }
    if (password.length < 6) { setError("Password minimal 6 karakter"); return }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || "Terjadi kesalahan"); setIsLoading(false); return }
      router.push("/login?registered=true")
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}
      >
        {/* blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="absolute top-[80px] left-[60px] w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute bottom-[100px] right-[40px] w-36 h-36 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute top-1/3 right-[-40px] w-64 h-64 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute top-[180px] right-[100px] w-10 h-10 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.18)" }} />
        <div className="absolute bottom-[240px] left-[80px] w-16 h-16 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.14)" }} />
        <div className="absolute top-[320px] right-[200px] w-5 h-5 rounded-full" style={{ background: "rgba(255,255,255,0.22)" }} />
        <div className="absolute top-[130px] right-[260px] w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.28)" }} />
        <div className="absolute bottom-[320px] left-[220px] w-4 h-4 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <div className="absolute bottom-[160px] right-[160px] w-6 h-6 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />

        {/* logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Cashflow</span>
        </div>

        {/* content */}
        <div className="relative z-10 space-y-7">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Mulai kelola<br />keuangan Anda<br />hari ini
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mt-3">
              Gratis selamanya. Daftar sekarang dan mulai catat transaksi keuangan Anda dalam hitungan menit.
            </p>
          </div>
          <div className="space-y-4">
            {[{ n: "1", label: "Buat akun gratis" }, { n: "2", label: "Catat transaksi pertama Anda" }, { n: "3", label: "Pantau rekap keuangan" }].map((item) => (
              <div key={item.n} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {item.n}
                </div>
                <span className="text-blue-100 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5"
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">Gratis selamanya, tanpa kartu kredit</span>
          </div>
        </div>

        <p className="relative z-10 text-blue-300 text-xs">© 2024 Cashflow. Aplikasi pencatat keuangan sederhana.</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-blue-600 font-bold text-xl tracking-tight">Cashflow</span>
          </div>

          {/* card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buat akun baru</h1>
              <p className="text-gray-400 mt-1 text-sm">Gratis dan mudah, selesai dalam 1 menit</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                id="name"
                label="Nama Lengkap"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={setName}
                required
                disabled={isLoading}
                icon={IconUser}
              />
              <FloatingInput
                id="email"
                label="Email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={setEmail}
                required
                disabled={isLoading}
                icon={IconMail}
              />
              <FloatingInput
                id="password"
                label="Password"
                type="password"
                placeholder="Min. 6 karakter"
                value={password}
                onChange={setPassword}
                required
                disabled={isLoading}
                icon={IconLock}
              />
              <FloatingInput
                id="confirmPassword"
                label="Konfirmasi Password"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                disabled={isLoading}
                icon={IconShield}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-3.5 px-4 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{
                  background: isLoading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                  boxShadow: isLoading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                {isLoading ? <><LoadingButton />Memproses...</> : "Buat Akun →"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Masuk di sini
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Aman & terlindungi. Data Anda tidak pernah dibagikan.
          </p>
        </div>
      </div>
    </div>
  )
}
