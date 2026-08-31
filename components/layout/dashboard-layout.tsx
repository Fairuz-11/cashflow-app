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

      {/* 
        Mobile:  pt-14 (top bar) + pb-16 (bottom nav) 
        Desktop: p-8, sidebar ada di kiri 
      */}
      <main className="flex-1 pt-14 pb-20 px-4 lg:pt-0 lg:pb-0 lg:px-8 lg:py-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
