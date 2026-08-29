"use client"

import { ReactNode } from "react"
import { Sidebar } from "../ui/sidebar"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  userName?: string | null
}

export function DashboardLayout({ children, userName }: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userName} onLogout={handleLogout} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
